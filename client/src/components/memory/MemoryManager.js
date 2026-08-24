import React, { useState, useEffect } from 'react';
import { getMemories, createMemory, deleteMemory, updateProject } from '../../lib/api';

export default function MemoryManager({ project, onProjectUpdated }) {
  const [memories, setMemories] = useState([]);
  const [sysInstructions, setSysInstructions] = useState(project?.system_instructions || '');
  const [devRules, setDevRules] = useState(project?.developer_rules || '');
  const [savingRules, setSavingRules] = useState(false);

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCat, setNewCat] = useState('fact');

  useEffect(() => {
    if (project?.id) {
      setSysInstructions(project.system_instructions || '');
      setDevRules(project.developer_rules || '');
      loadMemories();
    }
  }, [project?.id]);

  const loadMemories = async () => {
    try {
      const res = await getMemories(project.id);
      setMemories(res.data);
    } catch (err) {
      console.error('Error loading memories:', err);
    }
  };

  const handleSaveRules = async () => {
    setSavingRules(true);
    try {
      await updateProject(project.id, {
        system_instructions: sysInstructions,
        developer_rules: devRules,
      });
      if (onProjectUpdated) onProjectUpdated();
    } catch (err) {
      console.error('Error saving rules:', err);
    } finally {
      setSavingRules(false);
    }
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    try {
      await createMemory(project.id, {
        memory_key: newKey,
        memory_value: newValue,
        category: newCat,
        importance: 4,
      });
      setNewKey('');
      setNewValue('');
      await loadMemories();
    } catch (err) {
      console.error('Error creating memory:', err);
    }
  };

  const handleDeleteMemory = async (memId) => {
    try {
      await deleteMemory(memId);
      await loadMemories();
    } catch (err) {
      console.error('Error deleting memory:', err);
    }
  };

  return (
    <div className="row g-4">
      {/* Column 1: System Instructions & Rules */}
      <div className="col-md-6">
        <div className="dark-card p-4">
          <h5 className="text-white mb-3 fw-bold">
            <i className="bi bi-gear-wide-connected text-cyan me-2"></i>
            Project Instructions & Dynamic Context Rules
          </h5>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            System instructions define the AI's role and rules. Applied automatically to every project conversation.
          </p>

          <div className="mb-3">
            <label className="form-label text-cyan fw-bold">System Role & Instructions</label>
            <textarea
              className="form-control dark-input"
              rows="4"
              value={sysInstructions}
              onChange={(e) => setSysInstructions(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-purple fw-bold" style={{ color: '#c084fc' }}>
              Developer Rules & Architectural Constraints
            </label>
            <textarea
              className="form-control dark-input"
              rows="4"
              value={devRules}
              onChange={(e) => setDevRules(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100 fw-bold" onClick={handleSaveRules} disabled={savingRules}>
            <i className="bi bi-check-circle-fill me-2"></i>
            {savingRules ? 'Updating Project Instructions...' : 'Save Instructions & Rules'}
          </button>
        </div>
      </div>

      {/* Column 2: Persistent Project Memory */}
      <div className="col-md-6">
        <div className="dark-card p-4">
          <h5 className="text-white mb-3 fw-bold">
            <i className="bi bi-cpu text-emerald me-2"></i>
            Persistent Project Memory Store
          </h5>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            Automatically extracted facts, technology stack choices, and architectural constraints. Isolated per project.
          </p>

          {/* Add Memory Form */}
          <form onSubmit={handleAddMemory} className="mb-4 bg-dark p-3 rounded border border-secondary">
            <h6 className="text-white mb-2" style={{ fontSize: '0.9rem' }}>Add Persistent Memory Item</h6>
            <div className="row g-2">
              <div className="col-6">
                <input
                  type="text"
                  className="form-control dark-input form-control-sm"
                  placeholder="Key (e.g. Target Database)"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
              </div>
              <div className="col-6">
                <select
                  className="form-select dark-input form-select-sm"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                >
                  <option value="stack">Tech Stack</option>
                  <option value="decision">Architecture Decision</option>
                  <option value="constraint">Rule / Constraint</option>
                  <option value="fact">Project Fact</option>
                </select>
              </div>
              <div className="col-12 mt-2">
                <input
                  type="text"
                  className="form-control dark-input form-control-sm"
                  placeholder="Memory Content (e.g. Must use PostgreSQL with UUID keys)"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
              </div>
              <div className="col-12 mt-2">
                <button type="submit" className="btn btn-sm btn-emerald w-100 text-dark fw-bold bg-success">
                  + Add to Project Memory
                </button>
              </div>
            </div>
          </form>

          {/* Memory List */}
          <div className="memory-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {memories.length === 0 ? (
              <div className="text-center py-4 text-muted">No persistent memories recorded yet.</div>
            ) : (
              memories.map((mem) => (
                <div key={mem.id} className="p-3 mb-2 bg-dark rounded border border-secondary d-flex justify-content-between align-items-center">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-emerald text-dark fw-bold" style={{ backgroundColor: '#10b981' }}>
                        {mem.category.toUpperCase()}
                      </span>
                      <span className="fw-bold text-white" style={{ fontSize: '0.9rem' }}>{mem.memory_key}</span>
                    </div>
                    <small className="text-light d-block" style={{ fontSize: '0.85rem' }}>{mem.memory_value}</small>
                  </div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteMemory(mem.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
