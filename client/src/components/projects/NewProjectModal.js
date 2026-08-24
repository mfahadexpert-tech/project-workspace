import React, { useState } from 'react';
import { createProject } from '../../lib/api';

export default function NewProjectModal({ show, onClose, onProjectCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ownerName, setOwnerName] = useState('Developer Lead');
  const [instructions, setInstructions] = useState('You are an expert AI software architect and senior full-stack developer assistant.');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await createProject({
        name,
        description,
        owner_name: ownerName,
        system_instructions: instructions,
      });
      setName('');
      setDescription('');
      if (onProjectCreated) onProjectCreated(res.data);
      onClose();
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content dark-card border-secondary">
          <div className="modal-header border-secondary">
            <h5 className="modal-title text-white fw-bold">
              <i className="bi bi-folder-plus text-cyan me-2"></i>
              Create New Developer AI Project Workspace
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-white">Project Name</label>
                <input
                  type="text"
                  className="form-control dark-input"
                  placeholder="e.g. AI-Powered Healthcare Dashboard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white">Project Description</label>
                <textarea
                  className="form-control dark-input"
                  rows="2"
                  placeholder="Brief summary of technology stack, scope, and objectives..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white">Lead Owner Name</label>
                <input
                  type="text"
                  className="form-control dark-input"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-cyan">System Instructions & Behavior Rules</label>
                <textarea
                  className="form-control dark-input"
                  rows="3"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-cyan w-100 fw-bold bg-info text-dark" disabled={loading}>
                {loading ? 'Initializing Workspace...' : 'Create Project Workspace'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
