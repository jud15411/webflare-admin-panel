import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskFormModal from '../components/TaskFormModal';
import './TasksPage.css';

// Updated TaskCard to handle opening the edit modal
const TaskCard = ({ task, onEdit }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="task-card" onClick={() => onEdit(task)}>
            <h4>{task.title}</h4>
            <p>{task.project.name}</p>
            <span>Assigned to: {task.assignedTo.name}</span>
        </div>
    );
};

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchTasks = async () => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/tasks', config);
        setTasks(data);
    };

    useEffect(() => { if (user) fetchTasks(); }, [user]);

    const handleSaveTask = async (formData, taskId) => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        try {
            if (taskId) { // Editing existing task
                await axios.put(`/api/tasks/${taskId}`, formData, config);
            } else { // Creating new task
                await axios.post('/api/tasks', formData, config);
            }
            fetchTasks(); // Refresh the board
            setModalOpen(false);
        } catch (error) {
            alert(error.response.data.message || 'Failed to save task.');
        }
    };

    const handleDragEnd = (event) => { /* ... this function remains the same ... */ };

    const columns = {
        'To Do': tasks.filter(t => t.status === 'To Do'),
        'In Progress': tasks.filter(t => t.status === 'In Progress'),
        'On Hold': tasks.filter(t => t.status === 'On Hold'),
        'Done': tasks.filter(t => t.status === 'Done'),
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Tasks Board</h1>
                <button className="btn btn-primary" onClick={() => { setEditingTask(null); setModalOpen(true); }}>Add New Task</button>
            </div>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="kanban-board">
                    {Object.entries(columns).map(([columnId, columnTasks]) => (
                        <div key={columnId} className="kanban-column">
                            <h3>{columnId}</h3>
                            <SortableContext items={columnTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                                {columnTasks.map(task => <TaskCard key={task._id} task={task} onEdit={(t) => { setEditingTask(t); setModalOpen(true); }} />)}
                            </SortableContext>
                        </div>
                    ))}
                </div>
            </DndContext>
            <TaskFormModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveTask}
                taskData={editingTask}
                user={user}
            />
        </div>
    );
};

export default TasksPage;