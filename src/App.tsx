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
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState<string | null>(null);

  const [features, setFeatures] = useState<FeaturePolicy[]>(() => {
    const saved = localStorage.getItem("potens-dot-vms");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("potens-dot-vms", JSON.stringify(features));
  }, [features]);

  const handleLogin = (name: string, role: string) => { setUserInfo({ name, role }); setView('list'); };
  const handleLogout = () => { setView('login'); setUserInfo({ name: "", role: "" }); };

  // [해결] image_643beb.png 에러: checklist 필드를 초기값으로 추가해야 합니다.
  const handleSaveProject = (name: string, desc: string) => {
    const newProject: FeaturePolicy = {
      id: `p-${Date.now()}`,
      featureName: name,
      currentVersionId: "v1.0",
      history: [{
        version: "v1.0",
        updatedAt: new Date().toLocaleDateString(),
        author: userInfo.name,
        changeLog: desc || "최초 생성",
        policyData: { "기본요금": "3000", "할증률": "10%" },
        edgeCases: [],
        checklist: [] // [해결] types.ts와 규격 일치
      }]
    };
    setFeatures([newProject, ...features]);
    setIsCreateModalOpen(false);
  };

  const handleSaveVersion = (projectId: string, newVersion: any) => {
    setFeatures(prev => prev.map(f => {
      if (f.id === projectId) {
        return { ...f, currentVersionId: newVersion.version, history: [newVersion, ...f.history] };
      }
      return f;
    }));
  };

  const openDeleteConfirm = (id: string) => { setTargetProjectId(id); setIsDeleteModalOpen(true); };
  const handleDeleteProject = () => {
    if (targetProjectId) {
      setFeatures(features.filter(f => f.id !== targetProjectId));
      setIsDeleteModalOpen(false);
      setTargetProjectId(null);
    }
  };

  // [해결] image_65206e.png 41번 줄 에러: setSelectedProjectId(함수)가 아닌 activeFeatureId(값)를 사용합니다.
  const selectedProject = features.find((f) => f.id === activeFeatureId);
  const targetProjectName = features.find(f => f.id === targetProjectId)?.featureName || "";

  return (
    <div style={{ width: '100vw', minHeight: '100vh', display: 'block' }}>
      {view === 'login' && <LoginPage onLogin={handleLogin} />}

      {view === 'list' && (
        <>
          <ListPage 
            userName={userInfo.name}
            userRole={userInfo.role}
            features={features} // [해결] image_63ca95.png: ListPage가 기대하는 이름 'features'로 전달
            onSelectProject={(id) => { setActiveFeatureId(id); setView('detail'); }}
            onCreateProject={() => setIsCreateModalOpen(true)}
            onDeleteProject={openDeleteConfirm}
            onLogout={handleLogout}
          />
          {isCreateModalOpen && <ProjectModal onClose={() => setIsCreateModalOpen(false)} onSave={handleSaveProject} />}
          <DeleteModal 
            isOpen={isDeleteModalOpen} 
            onClose={() => setIsDeleteModalOpen(false)} 
            onConfirm={handleDeleteProject} 
            projectName={targetProjectName} 
          />
        </>
      )}

      {view === 'detail' && activeFeatureId && selectedProject && (
        <DetailPage 
          project={selectedProject} 
          onBack={() => setView('list')}
          onSaveVersion={handleSaveVersion}
          currentUserName={userInfo.name}
        />
      )}
    </div>
  )
}

export default App;