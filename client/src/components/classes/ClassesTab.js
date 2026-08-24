'use client';

import React, { useState, useEffect } from 'react';
import { getProjectClasses, createProjectClass, deleteProjectClass } from '../../lib/api';

const AVAILABLE_ICONS = [
  'bi-diagram-3', 'bi-code-slash', 'bi-cpu', 'bi-database',
  'bi-plug', 'bi-palette', 'bi-bug', 'bi-cloud-upload',
  'bi-shield-check', 'bi-journal-code', 'bi-search', 'bi-kanban',
  'bi-phone', 'bi-robot', 'bi-credit-card', 'bi-graph-up'
];

const AVAILABLE_COLORS = [
  '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6',
  '#ec4899', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'
];

export default function ClassesTab({ project, onSelectClassFilter }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New Class Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('bi-phone');
  const [color, setColor] = useState('#06b6d4');
  const [assignedAgent, setAssignedAgent] = useState('Coding & Execution Agent (Slave-1)');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (project?.id) {
      loadClasses();
    }
  }, [project?.id]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const res = await getProjectClasses(project.id);
      setClasses(res.data);
    } catch (err) {
      console.error('Error loading project classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!name.trim() || !project?.id) return;

    try {
      const res = await createProjectClass(project.id, {
        name: name.trim(),
        description: description.trim(),
        icon,
        color,
        assigned_agent: assignedAgent,
        instructions: instructions.trim(),
      });
      setClasses((prev) => [...prev, res.data]);
      setShowModal(false);
      setName('');
      setDescription('');
      setInstructions('');
    } catch (err) {
      console.error('Error creating class:', err);
      alert('Failed to create class.');
    }
  };

  const handleDeleteClass = async (classId, className) => {
    if (!window.confirm(`Are you sure you want to delete workstream class '${className}'?`)) return;
    try {
      await deleteProjectClass(classId);
      setClasses((prev) => prev.filter((c) => c.id !== classId));
    } catch (err) {
      console.error('Error deleting class:', err);
    }
  };

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-white">Project Workstreams & Classes</h4>
          <p className="text-muted small mb-0">
            Configurable department classes & domain workstreams for project structure, permissions, and agent assignments.
          </p>
        </div>
        <button className="btn btn-cyan text-dark font-bold d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle-fill"></i> + Add Class / Workstream
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border spinner-border-sm text-cyan me-2" role="status"></div>
          <span>Loading project workstreams...</span>
        </div>
      ) : classes.length === 0 ? (
        <div className="dark-card p-5 text-center text-muted">
          <i className="bi bi-diagram-3 fs-1 text-cyan d-block mb-3"></i>
          <h5>No Workstreams Configured</h5>
          <p className="small mb-3">Add workstreams like Frontend, Backend, Database, Mobile, or Machine Learning.</p>
          <button className="btn btn-outline-cyan btn-sm" onClick={() => setShowModal(true)}>
            + Add First Class
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {classes.map((cls) => (
            <div key={cls.id} className="col-12 col-md-6 col-lg-4">
              <div className="workstream-card h-100 d-flex flex-column justify-content-between">
                <div>
                  {/* Top Bar */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-3 d-flex align-items-center justify-content-center text-white"
                        style={{ width: '42px', height: '42px', backgroundColor: cls.color }}
                      >
                        <i className={`bi ${cls.icon} fs-5`}></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold text-white">{cls.name}</h6>
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Priority: {cls.priority.toUpperCase()}
                        </small>
                      </div>
                    </div>
                    <button
                      className="btn btn-xs text-muted text-hover-danger p-1"
                      title="Delete class"
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>

                  <p className="text-muted small mb-3">{cls.description || 'No description provided.'}</p>

                  {/* Assigned Agent */}
                  <div className="p-2 rounded bg-dark border border-secondary mb-3">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>ASSIGNED AI AGENT</small>
                    <span className="badge badge-supervisor mt-1" style={{ fontSize: '0.75rem' }}>
                      <i className="bi bi-robot"></i> {cls.assigned_agent}
                    </span>
                  </div>

                  {cls.instructions && (
                    <div className="mb-3">
                      <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>CLASS INSTRUCTIONS</small>
                      <small className="text-light" style={{ fontSize: '0.78rem' }}>{cls.instructions}</small>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
                  <span className="badge bg-secondary text-light" style={{ fontSize: '0.7rem' }}>Active Workstream</span>
                  <button
                    className="btn btn-xs btn-outline-cyan px-2 py-1"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => onSelectClassFilter && onSelectClassFilter(cls)}
                  >
                    Filter Workspace <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Class Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content dark-card border-secondary text-light">
              <div className="modal-header dark-card-header border-secondary">
                <h5 className="modal-title fw-bold text-white">
                  <i className="bi bi-diagram-3 text-cyan me-2"></i> Add New Workstream / Class
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleCreateClass}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Workstream Class Name *</label>
                    <input
                      type="text"
                      className="form-control dark-input"
                      placeholder="e.g. Mobile Application, Machine Learning, Payments"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Description</label>
                    <textarea
                      className="form-control dark-input"
                      rows="2"
                      placeholder="Brief overview of responsibilities for this workstream..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">Icon</label>
                      <select className="form-select dark-input" value={icon} onChange={(e) => setIcon(e.target.value)}>
                        {AVAILABLE_ICONS.map((ic) => (
                          <option key={ic} value={ic}>{ic.replace('bi-', '')}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Theme Color</label>
                      <input
                        type="color"
                        className="form-control dark-input form-control-color w-100"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Assigned Specialist AI Agent</label>
                    <select className="form-select dark-input" value={assignedAgent} onChange={(e) => setAssignedAgent(e.target.value)}>
                      <option value="Coding & Execution Agent (Slave-1)">Coding & Execution Agent (Slave-1)</option>
                      <option value="Architecture & System Design Agent (Slave-2)">Architecture & System Design Agent (Slave-2)</option>
                      <option value="Research & Knowledge RAG Agent (Slave-3)">Research & Knowledge RAG Agent (Slave-3)</option>
                      <option value="Review & Quality Assurance Agent (Slave-4)">Review & Quality Assurance Agent (Slave-4)</option>
                      <option value="UI/UX & Frontend Specialist Agent">UI/UX & Frontend Specialist Agent</option>
                      <option value="Supervisor Orchestrator Agent">Supervisor Orchestrator Agent</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Class-Specific AI Instructions</label>
                    <textarea
                      className="form-control dark-input"
                      rows="2"
                      placeholder="Special coding standards or domain rules for this class..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-cyan text-dark font-bold px-4" disabled={!name.trim()}>
                    Create Class
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
