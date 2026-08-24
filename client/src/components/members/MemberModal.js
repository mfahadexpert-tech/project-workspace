import React, { useState } from 'react';
import { addProjectMember } from '../../lib/api';

export default function MemberModal({ project, show, onClose, onMemberAdded }) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    setLoading(true);
    try {
      await addProjectMember(project.id, {
        user_name: userName,
        user_email: userEmail,
        role: role,
      });
      setUserName('');
      setUserEmail('');
      if (onMemberAdded) onMemberAdded();
      onClose();
    } catch (err) {
      console.error('Error adding member:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content dark-card border-secondary">
          <div className="modal-header border-secondary">
            <h5 className="modal-title text-white fw-bold">
              <i className="bi bi-people-fill text-cyan me-2"></i>
              Project Collaboration & Team Members
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Existing Members */}
            <h6 className="text-cyan mb-2" style={{ fontSize: '0.85rem' }}>Current Team Members</h6>
            <div className="mb-3 bg-dark p-2 rounded border border-secondary">
              {project?.members?.map((m) => (
                <div key={m.id} className="d-flex justify-content-between align-items-center p-2 border-bottom border-secondary last-border-0">
                  <div>
                    <strong className="text-white d-block">{m.user_name}</strong>
                    <small className="text-muted">{m.user_email}</small>
                  </div>
                  <span className={`badge ${m.role === 'owner' ? 'bg-primary' : 'bg-secondary'}`}>
                    {m.role.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            {/* Invite Form */}
            <form onSubmit={handleSubmit}>
              <h6 className="text-white mb-2" style={{ fontSize: '0.85rem' }}>Invite New Team Member</h6>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control dark-input form-control-sm"
                  placeholder="Full Name (e.g. John Architect)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <input
                  type="email"
                  className="form-control dark-input form-control-sm"
                  placeholder="Email Address"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <select
                  className="form-select dark-input form-select-sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="editor">Editor (Can Chat & Upload Files)</option>
                  <option value="viewer">Viewer (Read Only)</option>
                  <option value="owner">Co-Owner</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-sm w-100 fw-bold" disabled={loading}>
                {loading ? 'Adding Member...' : 'Add Team Member'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
