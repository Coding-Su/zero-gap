import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import ListPage from './pages/ListPage'
import ProjectModal from './pages/ProjectModal'
import DeleteModal from './pages/DeleteModal'
import DetailPage from './pages/DetailPage'
import type { FeaturePolicy } from './types.ts'

function App() {
  const [view, setView] = useState<'login' | 'list' | 'detail'>('login');
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);
  
  // 모달 상태 관리
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState<string | null>(null);

  // 로컬 스토리지 연동
  const [features, setFeatures] = useState<FeaturePolicy[]>(() => {
    const saved = localStorage.getItem("potens-dot-vms");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("potens-dot-vms", JSON.stringify(features));
  }, [features]);

  // 로그인/로그아웃
  const handleLogin = (name: string, role: string) => { 
    setUserInfo({ name, role }); 
    setView('list'); 
  };
  const handleLogout = () => { 
    setView('login'); 
    setUserInfo({ name: "", role: "" }); 
  };

  // App.tsx 내 프로젝트 저장 로직
  const handleSaveProject = (name: string, desc: string) => {
    const newProject: FeaturePolicy = {
      id: `p-${Date.now()}`,
      featureName: name, // '프로젝트 이름' 칸의 입력값
      currentVersionId: "v1.0",
      history: [{
        version: "v1.0",
        updatedAt: new Date().toLocaleDateString(),
        author: userInfo.name,
        // [핵심] '프로젝트 설명' 칸의 입력값(desc)을 여기에 저장합니다.
        changeLog: desc || "최초 생성된 프로젝트입니다.", 
        policyData: { "기본요금": "3000", "할증률": "10%" },
        edgeCases: [],
        checklist: []
      }]
    };
    setFeatures([newProject, ...features]);
    setIsCreateModalOpen(false);
  };

  const handleSaveVersion = (projectId: string, newVersion: any) => {
    setFeatures(prev => prev.map(f => {
      if (f.id === projectId) {
        return {
          ...f,
          currentVersionId: newVersion.version,
          history: [newVersion, ...f.history]
        };
      }
      return f;
    }));
  };

  // 삭제 프로세스
  const openDeleteConfirm = (id: string) => {
    setTargetProjectId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProject = () => {
    if (targetProjectId) {
      setFeatures(features.filter(f => f.id !== targetProjectId));
      setIsDeleteModalOpen(false);
      setTargetProjectId(null);
    }
  };

  const targetProjectName = features.find(f => f.id === targetProjectId)?.featureName || "";

  return (
    <div style={{ width: '100vw', minHeight: '100vh', display: 'block' }}>
      {view === 'login' && <LoginPage onLogin={handleLogin} />}

      {view === 'list' && (
        <>
          <ListPage 
            userName={userInfo.name}
            userRole={userInfo.role}
            features={features}
            onSelectProject={(id) => { setActiveFeatureId(id); setView('detail'); }}
            onCreateProject={() => setIsCreateModalOpen(true)}
            onDeleteProject={openDeleteConfirm}
            onLogout={handleLogout}
          />
          
          {isCreateModalOpen && (
            <ProjectModal onClose={() => setIsCreateModalOpen(false)} onSave={handleSaveProject} />
          )}

          <DeleteModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteProject}
            projectName={targetProjectName}
          />
        </>
      )}

      {view === 'detail' && activeFeatureId && (
        <DetailPage 
          project={features.find(f => f.id === activeFeatureId)!} 
          onBack={() => setView('list')}
          onSaveVersion={handleSaveVersion}
          currentUserName={userInfo.name}
        />
      )}
    </div>
  )
}

export default App;