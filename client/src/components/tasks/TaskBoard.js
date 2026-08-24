'use client';

import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, generateAITasks, getProjectClasses } from '../../lib/api';

export default function TaskBoard({ project }) {
  const [tasks, setTasks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'list', 'timeline'
  const [selectedClass, setSelectedClass] = useState('');
  const [myTasksOnly, setMyTasksOnly] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('medium');
  const [classId, setClassId] = useState('');
  const [assignedTo, setAssignedTo] = useState(project?.owner_name || 'Alex Tech Lead');

  // AI Breakdown Modal
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiGoal, setAiGoal] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (project?.id) {
      loadTasks();
      loadClasses();
    }
  }, [project?.id, selectedClass, myTasksOnly]);

  const loadTasks = async () => {
    try {
      const params = {};
      if (selectedClass) params.class_id = selectedClass;
      if (myTasksOnly) params.assigned_to = project?.owner_name || 'Alex Tech Lead';
      const res = await getTasks(project.id, params);
      setTasks(res.data);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  const loadClasses = async () => {
    try {
      const res = await getProjectClasses(project.id);
      setClasses(res.data);
    } catch (err) {
      console.error('Error loading classes:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask(project.id, {
        title: title.trim(),
        description: desc.trim(),
        priority,
        status: 'todo',
        class_id: classId || null,
        assigned_to: assignedTo.trim() || 'Unassigned',
      });
      setTitle('');
      setDesc('');
      await loadTasks();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      await loadTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
      await loadTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleAIBreakdown = async (e) => {
    e.preventDefault();
    if (!aiGoal.trim() || aiLoading) return;
    setAiLoading(true);
    try {
      await generateAITasks(project.id, aiGoal.trim());
      setAiGoal('');
      setShowAIModal(false);
      await loadTasks();
    } catch (err) {
      console.error('Error generating AI tasks:', err);
      alert('Failed to generate AI tasks.');
    } finally {
      setAiLoading(false);
    }
  };

  const kanbanColumns = [
    { id: 'todo', name: 'To Do', color: '#9ca3af', icon: 'bi-circle' },
    { id: 'in_progress', name: 'In Progress', color: '#3b82f6', icon: 'bi-arrow-repeat' },
    { id: 'completed', name: 'Completed', color: '#10b981', icon: 'bi-check-circle-fill' },
    { id: 'blocked', name: 'Blocked', color: '#ef4444', icon: 'bi-exclamation-octagon-fill' },
  ];

  return (
    <div className="dark-card p-4">
      {/* Header & Controls */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h5 className="text-white mb-1 fw-bold">
            <i className="bi bi-kanban-fill text-cyan me-2"></i>
            Tasks, Goals & Project Planning
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
            Manage workstream tasks, assigned members, Kanban status, and AI subtask breakdowns.
          </p>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* View Selector */}
          <div className="btn-group btn-group-sm">
            <button
              className={`btn ${viewMode === 'kanban' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('kanban')}
            >
              <i className="bi bi-kanban me-1"></i> Kanban
            </button>
            <button
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('list')}
            >
              <i className="bi bi-list-ul me-1"></i> List
            </button>
            <button
              className={`btn ${viewMode === 'timeline' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('timeline')}
            >
              <i className="bi bi-calendar3 me-1"></i> Timeline
            </button>
          </div>

          {/* AI Task Generator Trigger */}
          <button className="btn btn-sm btn-purple text-light fw-bold" onClick={() => setShowAIModal(true)} style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
            <i className="bi bi-stars me-1"></i> AI Breakdown
          </button>

          {/* My Tasks Filter */}
          <button
            className={`btn btn-sm ${myTasksOnly ? 'btn-cyan text-dark font-bold' : 'btn-outline-secondary text-light'}`}
            onClick={() => setMyTasksOnly(!myTasksOnly)}
          >
            <i className="bi bi-person-fill me-1"></i> My Tasks
          </button>
        </div>
      </div>

      {/* Class Filter Bar */}
      <div className="d-flex align-items-center gap-2 mb-4 overflow-auto pb-2">
        <span className="text-muted small fw-bold me-2">Workstream:</span>
        <button
          className={`btn btn-xs rounded-pill ${!selectedClass ? 'btn-cyan text-dark font-bold' : 'btn-outline-secondary text-light'}`}
          onClick={() => setSelectedClass('')}
        >
          All Classes
        </button>
        {classes.map((cls) => (
          <button
            key={cls.id}
            className={`btn btn-xs rounded-pill ${selectedClass === cls.id ? 'btn-cyan text-dark font-bold' : 'btn-outline-secondary text-light'}`}
            onClick={() => setSelectedClass(cls.id)}
          >
            <i className={`bi ${cls.icon} me-1`}></i> {cls.name}
          </button>
        ))}
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleAddTask} className="mb-4 bg-dark p-3 rounded border border-secondary">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control dark-input form-control-sm"
              placeholder="Task Title (e.g. Implement OAuth JWT Refresh)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="col-12 col-md-3">
            <select className="form-select dark-input form-select-sm" value={classId} onChange={(e) => setClassId(e.target.value)}>
              <option value="">-- Assign Workstream --</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select className="form-select dark-input form-select-sm" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div className="col-6 col-md-3">
            <button type="submit" className="btn btn-sm btn-primary w-100 fw-bold">
              + Add Task
            </button>
          </div>
        </div>
      </form>

      {/* VIEW 1: KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="row g-3">
          {kanbanColumns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="col-12 col-md-6 col-lg-3">
                <div className="kanban-col">
                  {/* Column Header */}
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary">
                    <span className="fw-bold text-white d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                      <i className={`bi ${col.icon}`} style={{ color: col.color }}></i> {col.name}
                    </span>
                    <span className="badge bg-dark border border-secondary text-muted" style={{ fontSize: '0.75rem' }}>
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Task Cards */}
                  {colTasks.length === 0 ? (
                    <div className="text-center text-muted py-4 small opacity-50">No tasks</div>
                  ) : (
                    colTasks.map((t) => (
                      <div key={t.id} className="kanban-task-card">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span
                            className={`badge ${t.priority === 'high' ? 'bg-danger' : t.priority === 'medium' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}
                            style={{ fontSize: '0.65rem' }}
                          >
                            {t.priority.toUpperCase()}
                          </span>
                          <button className="btn btn-xs text-muted text-hover-danger p-0" onClick={() => handleDeleteTask(t.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>

                        <h6 className="fw-bold text-white mb-1" style={{ fontSize: '0.88rem' }}>{t.title}</h6>
                        {t.description && <p className="text-muted small mb-2 text-truncate" style={{ fontSize: '0.78rem' }}>{t.description}</p>}

                        <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top border-secondary text-muted" style={{ fontSize: '0.72rem' }}>
                          <span><i className="bi bi-person me-1"></i>{t.assigned_to}</span>
                          <div className="btn-group btn-group-xs">
                            {col.id !== 'todo' && (
                              <button className="btn btn-xs btn-outline-secondary py-0 px-1" title="Move Left" onClick={() => handleStatusChange(t.id, col.id === 'in_progress' ? 'todo' : 'in_progress')}>
                                ◀
                              </button>
                            )}
                            {col.id !== 'completed' && (
                              <button className="btn btn-xs btn-outline-secondary py-0 px-1" title="Move Right" onClick={() => handleStatusChange(t.id, col.id === 'todo' ? 'in_progress' : 'completed')}>
                                ▶
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>Status</th>
                <th>Task Title & Details</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span className={`badge ${t.status === 'completed' ? 'bg-success' : t.status === 'in_progress' ? 'bg-primary' : t.status === 'blocked' ? 'bg-danger' : 'bg-secondary'}`}>
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <strong className="text-white d-block">{t.title}</strong>
                    {t.description && <small className="text-muted">{t.description}</small>}
                  </td>
                  <td>
                    <span className={`badge ${t.priority === 'high' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                      {t.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-light">{t.assigned_to}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTask(t.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 3: TIMELINE ROADMAP VIEW */}
      {viewMode === 'timeline' && (
        <div className="p-4 bg-dark rounded border border-secondary text-light">
          <h6 className="fw-bold text-white mb-3"><i className="bi bi-clock-history text-cyan me-2"></i> Project Roadmap Timeline</h6>
          <div className="timeline-list border-start border-cyan ms-3 ps-3">
            {tasks.map((t, idx) => (
              <div key={t.id} className="mb-4 position-relative">
                <div className="position-absolute top-0 start-0 translate-middle-x rounded-circle bg-cyan" style={{ width: '12px', height: '12px', marginLeft: '-19px', marginTop: '4px' }}></div>
                <h6 className="fw-bold text-white mb-1">{t.title}</h6>
                <small className="text-muted d-block mb-1">{t.description || 'Sprint task item'}</small>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-secondary" style={{ fontSize: '0.68rem' }}>Status: {t.status}</span>
                  <span className="text-cyan small" style={{ fontSize: '0.72rem' }}>Assignee: {t.assigned_to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Breakdown Modal */}
      {showAIModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content dark-card border-secondary text-light">
              <div className="modal-header dark-card-header border-secondary">
                <h5 className="modal-title fw-bold text-white">
                  <i className="bi bi-stars text-purple me-2"></i> AI Task & Epic Breakdown
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAIModal(false)}></button>
              </div>
              <form onSubmit={handleAIBreakdown}>
                <div className="modal-body p-4">
                  <p className="text-muted small mb-3">
                    Describe a high-level project goal or feature. The Supervisor PM Agent will automatically break it into actionable subtasks.
                  </p>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Goal or Requirement *</label>
                    <textarea
                      className="form-control dark-input"
                      rows="3"
                      placeholder="e.g. Implement multi-tenant authentication with OAuth2 Google login and Redis session revocation."
                      value={aiGoal}
                      onChange={(e) => setAiGoal(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAIModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-purple text-light font-bold px-4" disabled={aiLoading || !aiGoal.trim()} style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                    {aiLoading ? 'Generating Subtasks...' : 'Generate Tasks'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
