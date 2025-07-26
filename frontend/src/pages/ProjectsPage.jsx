// pages/ProjectsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ProjectFormModal from '../components/ProjectFormModal';
import ConfirmModal from '../components/ConfirmModal';
import api from '../api/axios';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await api.get('/api/projects', config);
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const handleSave = async (formData) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editingProject) {
        await api.put(`/api/projects/${editingProject._id}`, formData, config);
      } else {
        await api.post('/api/projects', formData, config);
      }
      fetchProjects();
      setFormOpen(false);
      setEditingProject(null);
    } catch (error) {
      alert('Failed to save project.');
    }
  };

  const handleDeleteRequest = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.delete(`/api/projects/${deletingId}`, config);
      fetchProjects();
    } catch (error) {
      alert('Failed to delete project.');
    } finally {
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={() => { setEditingProject(null); setFormOpen(true); }}>Add New Project</button>
      </div>
      <div className="table-container">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Client</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>{project.name}</td>
                <td>{project.client?.name || 'N/A'}</td>
                <td><span className={`status status-${project.status.toLowerCase().replace(' ', '-')}`}>{project.status}</span></td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditingProject(project); setFormOpen(true); }}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRequest(project._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        projectData={editingProject}
        userToken={user?.token}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message="Are you sure you want to permanently delete this project? All associated data may be lost."
      />
    </div>
  );
};

export default ProjectsPage;