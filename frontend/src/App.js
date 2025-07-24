import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import './App.css';
import { BusinessContext } from './contexts/BusinessContext';

// --- Import Existing Pages ---
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import ProjectsPage from './pages/ProjectsPage';
import Settings from './pages/Settings';
import ClientsPage from './pages/ClientsPage';
import SalesPage from './pages/SalesPage';
import InvoicesPage from './pages/InvoicesPage';
import ContractsPage from './pages/ContractsPage';
import TeamPage from './pages/TeamPage';
import ReportsPage from './pages/ReportsPage';
import TimeTrackingPage from './pages/TimeTrackingPage';
import TimeLogReportPage from './pages/TimeLogReportPage';
import ProposalsPage from './pages/ProposalsPage';
import ExpensesPage from './pages/ExpensesPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import PayrollPage from './pages/PayrollPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import SoftwareAssetsPage from './pages/SoftwareAssetsPage';
import TasksPage from './pages/TasksPage';
import PayoutsPage from './pages/PayoutsPage';


// --- Layout Component with a Full-Featured Sidebar ---
const AppLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { settings } = useContext(BusinessContext);
  const [openDropdowns, setOpenDropdowns] = useState({}); // Use an object to track multiple dropdowns

  if (!user) {
    return <Navigate to="/login" />;
  }

  const toggleDropdown = (label) => {
    setOpenDropdowns(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const navLinks = {
    ceo: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      {
        label: 'Workspace', isDropdown: true, icon: '💼',
        sub: [ { path: '/projects', label: 'Projects' }, { path: '/tasks', label: 'Tasks Board' }, { path: '/time-tracking', label: 'Time Tracking' } ],
      },
      {
        label: 'Financials', isDropdown: true, icon: '💵',
        sub: [ { path: '/proposals', label: 'Proposals' }, { path: '/invoices', label: 'Invoices' }, { path: '/expenses', label: 'Expenses' }, { path: '/subscriptions', label: 'Subscriptions' }, { path: '/reports/time-logs', label: 'Time Log Report' }, { path: '/payouts', label: 'Bank Payouts' } ],
      },
      {
        label: 'Clients & Sales', isDropdown: true, icon: '📈',
        sub: [ { path: '/clients', label: 'Clients' }, { path: '/sales', label: 'Sales Pipeline' }, { path: '/contracts', label: 'Contracts' } ],
      },
      {
        label: 'Team', isDropdown: true, icon: '👥',
        sub: [ { path: '/team', label: 'Team Management' }, { path: '/payroll', label: 'Payroll' } ],
      },
      {
        label: 'Company', isDropdown: true, icon: '🏢',
        sub: [ { path: '/knowledge-base', label: 'Knowledge Base' }, { path: '/software', label: 'Software Assets' }, { path: '/reports', label: 'Reports' }, { path: '/settings', label: 'Settings' } ],
      },
    ],
    developer: [
        { path: '/dashboard', label: 'My Dashboard', icon: '🏠' },
        {
          label: 'Workspace', isDropdown: true, icon: '💼',
          sub: [ { path: '/projects', label: 'Projects' }, { path: '/tasks', label: 'Tasks Board' }, { path: '/time-tracking', label: 'Time Tracking' } ],
        },
        {
          label: 'Company', isDropdown: true, icon: '🏢',
          sub: [ { path: '/knowledge-base', label: 'Knowledge Base' }, { path: '/settings', label: 'Settings' } ],
        },
    ],
    cto: [
        // CTO sees a mix of developer and management views
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
        {
          label: 'Financials', isDropdown: true, icon: '💵',
          sub: [ { path: '/proposals', label: 'Proposals' }, { path: '/invoices', label: 'Invoices' }, { path: '/payroll', label: 'Payroll' } ],
        },
        {
          label: 'Workspace', isDropdown: true, icon: '💼',
          sub: [ { path: '/projects', label: 'Projects' }, { path: '/tasks', label: 'Tasks Board' }, { path: '/time-tracking', label: 'Time Tracking' } ],
        },
        {
          label: 'Company', isDropdown: true, icon: '🏢',
          sub: [ { path: '/knowledge-base', label: 'Knowledge Base' }, { path: '/software', label: 'Software Assets' }, { path: '/subscriptions', label: 'Subscriptions' }, { path: '/expenses', label: 'Expenses' }, { path: '/settings', label: 'Settings' } ],
        },
    ],
    sales: [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/clients', label: 'Clients', icon: '📈' },
        { path: '/sales', label: 'Sales Pipeline', icon: '📊' },
        { path: '/proposals', label: 'Proposals', icon: '📝' },
        { path: '/knowledge-base', label: 'Knowledge Base', icon: '📚' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
    ]
  };
  
  const userLinks = navLinks[user?.role] || [];

  return (
    <div className="app-layout">
      <div className="sidebar">
        <h3>{settings.businessName}</h3>
        <nav>
          {userLinks.map((link, index) =>
            link.isDropdown ? (
              <div key={index} className="nav-dropdown">
                <div className="nav-dropdown-toggle" onClick={() => toggleDropdown(link.label)}>
                  <span>{link.icon} {link.label}</span>
                  <span className={`arrow ${openDropdowns[link.label] ? 'open' : ''}`}>▼</span>
                </div>
                {openDropdowns[link.label] && (
                  <div className="nav-dropdown-menu">
                    {link.sub.map((subLink) => (
                      <Link key={subLink.path} to={subLink.path}>{subLink.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.path} to={link.path}>{link.icon} {link.label}</Link>
            )
          )}
        </nav>
        <button onClick={logout}>Logout</button>
      </div>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

// --- Main App Component with All New Routes ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/time-logs" element={<TimeLogReportPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/payouts" element={<PayoutsPage />} />
          {/* --- ADDING ALL NEW ROUTES --- */}
          <Route path="/proposals" element={<ProposalsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/time-tracking" element={<TimeTrackingPage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="/software" element={<SoftwareAssetsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;