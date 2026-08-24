'use client';

import React, { useState, useEffect } from 'react';
import { getProjects, getConversations, createConversation, getCurrentUser } from '../lib/api';

import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import PersonalAssistantDrawer from '../components/layout/PersonalAssistantDrawer';

import ProjectOverviewTab from '../components/overview/ProjectOverviewTab';
import ClassesTab from '../components/classes/ClassesTab';
import ChatWindow from '../components/chat/ChatWindow';
import TaskBoard from '../components/tasks/TaskBoard';
import ArtifactViewer from '../components/artifacts/ArtifactViewer';
import KnowledgeBase from '../components/knowledge/KnowledgeBase';
import MemoryManager from '../components/memory/MemoryManager';

import MemberModal from '../components/members/MemberModal';
import NewProjectModal from '../components/projects/NewProjectModal';
import GlobalSearchModal from '../components/search/GlobalSearchModal';

export default function WorkspaceHome() {
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  // Active Navigation Tab: 'overview' | 'classes' | 'chats' | 'tasks' | 'artifacts' | 'knowledge' | 'memory'
  const [activeTab, setActiveTab] = useState('overview');

  // Drawer & Modals State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    loadUser();
    loadProjects();
  }, []);

  useEffect(() => {
    if (activeProject?.id) {
      loadConversations(activeProject.id);
    }
  }, [activeProject?.id]);

  // Global Keyboard listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadUser = async () => {
    try {
      const res = await getCurrentUser();
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Error loading current user:', err);
    }
  };

  const loadProjects = async (selectNewId = null) => {
    try {
      const res = await getProjects();
      setProjects(res.data);
      if (res.data.length > 0) {
        if (selectNewId) {
          const found = res.data.find((p) => p.id === selectNewId);
          setActiveProject(found || res.data[0]);
        } else if (!activeProject) {
          setActiveProject(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  };

  const loadConversations = async (projectId) => {
    try {
      const res = await getConversations(projectId);
      setConversations(res.data);
      if (res.data.length > 0) {
        setActiveConversation(res.data[0]);
      } else {
        setActiveConversation(null);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  const handleNewConversation = async () => {
    if (!activeProject?.id) return;
    const title = prompt('Enter Conversation Title:', 'Feature Implementation & Code');
    if (!title) return;

    try {
      const res = await createConversation({
        project_id: activeProject.id,
        title,
        category: 'Coding',
      });
      setConversations((prev) => [res.data, ...prev]);
      setActiveConversation(res.data);
      setActiveTab('chats');
    } catch (err) {
      console.error('Error creating conversation:', err);
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar
        activeProject={activeProject}
        currentUser={currentUser}
        onOpenMembersModal={() => setShowMemberModal(true)}
        onOpenNewProject={() => setShowNewProjectModal(true)}
        onOpenSearch={() => setShowSearchModal(true)}
      />

      <div className="container-fluid flex-grow-1 px-0">
        <div className="row g-0 h-100">
          {/* Left Sidebar */}
          <div className="col-12 col-md-3 col-lg-2">
            <Sidebar
              projects={projects}
              activeProject={activeProject}
              onSelectProject={(p) => setActiveProject(p)}
              activeTab={activeTab}
              onSelectTab={(tab) => setActiveTab(tab)}
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={(c) => setActiveConversation(c)}
              onNewConversation={handleNewConversation}
              onOpenNewProject={() => setShowNewProjectModal(true)}
            />
          </div>

          {/* Main Content Workspace Area */}
          <div className="col-12 col-md-9 col-lg-10 p-3 p-lg-4" style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
            {activeProject ? (
              <>
                {activeTab === 'overview' && (
                  <ProjectOverviewTab
                    project={activeProject}
                    classesCount={activeProject.classes?.length || 12}
                    tasksCount={3}
                    artifactsCount={1}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'classes' && (
                  <ClassesTab
                    project={activeProject}
                    onSelectClassFilter={() => setActiveTab('chats')}
                  />
                )}

                {activeTab === 'chats' && (
                  activeConversation ? (
                    <ChatWindow conversation={activeConversation} project={activeProject} />
                  ) : (
                    <div className="dark-card p-5 text-center text-muted">
                      <i className="bi bi-chat-dots fs-1 text-cyan d-block mb-3"></i>
                      <h5>No Conversation Selected</h5>
                      <button className="btn btn-cyan text-dark font-bold mt-2" onClick={handleNewConversation}>
                        + Start New Conversation
                      </button>
                    </div>
                  )
                )}

                {activeTab === 'tasks' && (
                  <TaskBoard project={activeProject} />
                )}

                {activeTab === 'artifacts' && (
                  <ArtifactViewer project={activeProject} />
                )}

                {activeTab === 'knowledge' && (
                  <KnowledgeBase project={activeProject} />
                )}

                {activeTab === 'memory' && (
                  <MemoryManager
                    project={activeProject}
                    onProjectUpdated={() => loadProjects(activeProject.id)}
                  />
                )}
              </>
            ) : (
              <div className="dark-card p-5 text-center text-muted">
                <h5>No Active Project Workspace</h5>
                <button className="btn btn-cyan text-dark font-bold mt-3" onClick={() => setShowNewProjectModal(true)}>
                  + Create Your First Developer Project Workspace
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Persistent Floating Personal Assistant FAB Button */}
      <button className="assistant-fab" onClick={() => setIsAssistantOpen(true)}>
        <i className="bi bi-stars fs-5"></i>
        <span>Personal Assistant</span>
      </button>

      {/* Slide-Over Private Personal Assistant Drawer */}
      <PersonalAssistantDrawer
        project={activeProject}
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Global Search Modal Overlay */}
      <GlobalSearchModal
        show={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        project={activeProject}
        onSelectItem={(item) => {
          if (item.entity_type === 'class') setActiveTab('classes');
          else if (item.entity_type === 'task') setActiveTab('tasks');
          else if (item.entity_type === 'artifact') setActiveTab('artifacts');
          else if (item.entity_type === 'message' || item.entity_type === 'conversation') setActiveTab('chats');
        }}
      />

      {/* Modals */}
      <MemberModal
        project={activeProject}
        show={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        onMemberAdded={() => loadProjects(activeProject?.id)}
      />

      <NewProjectModal
        show={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onProjectCreated={(newProj) => loadProjects(newProj.id)}
      />
    </div>
  );
}
