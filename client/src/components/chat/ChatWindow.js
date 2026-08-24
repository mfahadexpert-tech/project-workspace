'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage, convertMessageToTask } from '../../lib/api';
import AgentBadge from './AgentBadge';

export default function ChatWindow({ conversation, project }) {
  const [messages, setMessages] = useState([]);
  const [inputContent, setInputContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [convertingId, setConvertingId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation?.id) {
      loadMessages();
    }
  }, [conversation?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const loadMessages = async () => {
    try {
      const res = await getMessages(conversation.id);
      setMessages(res.data);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputContent.trim() || loading) return;

    const userText = inputContent;
    setInputContent('');

    // Optimistic user message shown immediately
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      sender_type: 'user',
      sender_name: project?.owner_name || 'Developer',
      content: userText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      // Send message — backend saves user msg + runs AI + returns AI msg
      const res = await sendMessage(conversation.id, userText, project?.owner_name || 'Developer');

      // Replace temp with confirmed user msg + append AI response
      const aiMsg = res.data;
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempUserMsg.id);
        return [
          ...withoutTemp,
          { ...tempUserMsg, id: 'user-' + Date.now() }, // permanent user bubble
          aiMsg,                                          // AI response bubble
        ];
      });
    } catch (err) {
      console.error('Error sending message:', err);
      // Show error bubble instead of silently failing
      const errMsg = {
        id: 'err-' + Date.now(),
        sender_type: 'supervisor',
        sender_name: 'System',
        content: '⚠️ Could not reach the backend. Make sure the server is running on http://localhost:8000 and try again.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), tempUserMsg, errMsg]);
    } finally {
      setLoading(false);
    }
  };


  const handleConvertToTask = async (msgId) => {
    setConvertingId(msgId);
    try {
      await convertMessageToTask(msgId);
      alert('Message successfully converted into a project task!');
    } catch (err) {
      console.error('Error converting message to task:', err);
      alert('Failed to convert message to task.');
    } finally {
      setConvertingId(null);
    }
  };

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  const renderContentWithFormatting = (content) => {
    if (!content) return null;

    // Split on any fenced code block ```lang ... ```
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Text before the code block
      if (match.index > lastIndex) {
        const textBefore = content.slice(lastIndex, match.index);
        parts.push({ type: 'text', content: textBefore });
      }

      const lang = match[1] || 'code';
      const code = match[2] || '';

      if (lang === 'mermaid') {
        parts.push({ type: 'mermaid', content: code });
      } else {
        parts.push({ type: 'code', lang, content: code });
      }

      lastIndex = match.index + match[0].length;
    }

    // Remaining text after last block
    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.slice(lastIndex) });
    }

    // If no code blocks found just render as text
    if (parts.length === 0) {
      return <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>{content}</div>;
    }

    return (
      <div>
        {parts.map((part, idx) => {
          if (part.type === 'text') {
            return (
              <div key={idx} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', marginBottom: '0.5rem' }}>
                {part.content}
              </div>
            );
          }

          if (part.type === 'mermaid') {
            return (
              <div key={idx} style={{ background: '#1a1a2e', border: '1px solid #8b5cf6', borderRadius: '8px', padding: '1rem', margin: '0.5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#c084fc', fontSize: '0.75rem', fontWeight: 'bold' }}>⬡ MERMAID DIAGRAM</span>
                  <button className="btn btn-sm btn-outline-secondary py-0 px-2" style={{ fontSize: '0.7rem' }} onClick={() => copyCode(part.content)}>
                    Copy
                  </button>
                </div>
                <pre style={{ color: '#c084fc', margin: 0, fontSize: '0.82rem', fontFamily: 'monospace' }}>{part.content}</pre>
              </div>
            );
          }

          // code block
          return (
            <div key={idx} style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', margin: '0.5rem 0', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0.75rem', background: '#161b22', borderBottom: '1px solid #30363d' }}>
                <span style={{ color: '#58a6ff', fontSize: '0.72rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{part.lang}</span>
                <button className="btn btn-sm btn-outline-secondary py-0 px-2" style={{ fontSize: '0.7rem' }} onClick={() => copyCode(part.content)}>
                  📋 Copy
                </button>
              </div>
              <pre style={{ margin: 0, padding: '0.75rem', color: '#e6edf3', fontSize: '0.83rem', fontFamily: 'monospace', overflowX: 'auto', lineHeight: '1.6' }}>
                {part.content}
              </pre>
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div className="d-flex flex-column h-100 dark-card">
      {/* Header */}
      <div className="dark-card-header d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0 fw-bold text-white d-flex align-items-center gap-2">
            <i className="bi bi-chat-left-dots-fill text-cyan"></i>
            {conversation?.title || 'Active Conversation'}
          </h6>
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            Category: {conversation?.category || 'General'} | Multi-Agent Supervisor Enabled
          </small>
        </div>
        <button className="btn btn-sm btn-outline-secondary" onClick={loadMessages}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-grow-1 p-3 overflow-auto" style={{ maxHeight: 'calc(100vh - 280px)', minHeight: '350px' }}>
        {messages.length === 0 && !loading && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-robot fs-1 d-block mb-2 text-cyan"></i>
            <h6 className="text-white">Multi-Agent AI Workspace Ready</h6>
            <p style={{ fontSize: '0.85rem' }}>
              Ask any coding, architecture design, or document query. Supervisor Agent will answer directly or delegate to specialized agents!
            </p>
            <div className="d-flex justify-content-center gap-2 flex-wrap mt-3">
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => setInputContent('Write a FastAPI OAuth2 JWT authentication router')}
              >
                💻 Generate FastAPI Auth Code
              </button>
              <button
                className="btn btn-sm btn-outline-purple"
                style={{ color: '#c084fc', borderColor: '#8b5cf6' }}
                onClick={() => setInputContent('Design high-level microservices database schema with Mermaid diagram')}
              >
                🏗️ Design System Architecture
              </button>
              <button
                className="btn btn-sm btn-outline-warning"
                onClick={() => setInputContent('Summarize project rules and persistent memories')}
              >
                📄 Summarize RAG & Memories
              </button>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-msg-card ${msg.sender_type === 'user' ? 'chat-msg-user' : 'chat-msg-agent'}`}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <AgentBadge
                senderType={msg.sender_type}
                agentName={msg.agent_name || msg.sender_name}
                reasoning={msg.agent_reasoning}
              />
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}
                </small>
                <button
                  className="btn btn-xs text-muted text-hover-white p-0"
                  title="Convert to Task"
                  onClick={() => handleConvertToTask(msg.id)}
                  disabled={convertingId === msg.id}
                >
                  <i className="bi bi-plus-square"></i>
                </button>
              </div>
            </div>

            <div className="text-light">{renderContentWithFormatting(msg.content)}</div>

            {/* Citations block */}
            {msg.citations && Array.isArray(msg.citations) && msg.citations.length > 0 && (
              <div className="mt-3 p-2 bg-dark rounded border border-warning">
                <small className="text-warning fw-bold d-block mb-1">
                  <i className="bi bi-journal-bookmark-fill me-1"></i> RAG Source Citations:
                </small>
                {msg.citations.map((cit, idx) => (
                  <small key={idx} className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                    • {cit}
                  </small>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="chat-msg-card chat-msg-agent">
            <div className="d-flex align-items-center gap-3 text-cyan">
              <div className="spinner-border spinner-border-sm" role="status"></div>
              <span>Supervisor Agent evaluating request & delegating to specialized agent...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 border-top border-secondary">
        <form onSubmit={handleSend} className="d-flex gap-2">
          <textarea
            className="form-control dark-input"
            rows="2"
            placeholder="Type developer request, ask for architecture design, or code generation..."
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2" disabled={loading}>
            <i className="bi bi-send-fill"></i>
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
