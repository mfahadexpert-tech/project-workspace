import React from 'react';

export default function AgentBadge({ senderType, agentName, reasoning }) {
  if (senderType === 'user') {
    return <span className="badge bg-secondary">Developer</span>;
  }

  let badgeClass = 'badge-supervisor';
  let icon = 'bi-cpu-fill';

  if (senderType === 'slave_coding') {
    badgeClass = 'badge-coding';
    icon = 'bi-code-slash';
  } else if (senderType === 'slave_arch') {
    badgeClass = 'badge-arch';
    icon = 'bi-diagram-3-fill';
  } else if (senderType === 'slave_doc') {
    badgeClass = 'badge-doc';
    icon = 'bi-file-earmark-text-fill';
  }

  return (
    <div className="d-inline-flex align-items-center gap-2" title={reasoning || 'Agent Execution Rationale'}>
      <span className={`agent-badge ${badgeClass}`}>
        <i className={`bi ${icon}`}></i>
        {agentName || 'Supervisor Agent'}
      </span>
      {reasoning && (
        <small className="text-muted d-none d-md-inline" style={{ fontSize: '0.7rem' }}>
          <i className="bi bi-info-circle me-1"></i>
          {reasoning}
        </small>
      )}
    </div>
  );
}
