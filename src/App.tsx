import React, { useState } from "react";
import Sidebar from "./components/VersionSidebar";
import PolicyDashboard from "./components/MainDashboard";
import type { FeaturePolicy, VersionSnapshot } from "./types";

const initialData: FeaturePolicy[] = [
  {
    id: "problem-set",
    featureName: "문제 구성",
    currentVersionId: "v2.0",
    history: [
      {
        version: "v2.0",
        updatedAt: "2024-05-20",
        author: "김기획",
        changeLog: "문제 수 5개로 증합",
        problemCount: 5,
        edgeCases: ["네트워크 단절 시 임시 저장"],
        tasks: [{ id: 1, text: "신규 문제 추가", done: false }]
      }
    ]
  },
  {
    id: "tts-config",
    featureName: "TTS 음성 설정",
    currentVersionId: "v1.1",
    history: [
      {
        version: "v1.1",
        updatedAt: "2024-05-21",
        author: "박개발",
        changeLog: "피치 상향 조절",
        audioPitch: "High",
        edgeCases: ["긴 문장 읽기 시 끊김"],
        tasks: [{ id: 1, text: "피치 테스트", done: true }]
      }
    ]
  }
];

function App() {
  const [features, setFeatures] = useState<FeaturePolicy[]>(initialData);
  const [activeFeatureId, setActiveFeatureId] = useState("problem-set");
  const [activeVersionId, setActiveVersionId] = useState("v2.0");

  const currentFeature = features.find(f => f.id === activeFeatureId) || features[0];
  const currentSnapshot = currentFeature.history.find(v => v.version === activeVersionId) || currentFeature.history[0];

  const createNewVersion = (note: string) => {
    const nextVer = `v${(currentFeature.history.length + 1).toFixed(1)}`;
    const newSnap: VersionSnapshot = {
      ...currentSnapshot,
      version: nextVer,
      changeLog: note,
      updatedAt: new Date().toLocaleDateString(),
      author: "사용자"
    };

    setFeatures(features.map(f => f.id === activeFeatureId ? { ...f, history: [newSnap, ...f.history] } : f));
    setActiveVersionId(nextVer);
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f9fafb" }}>
      <Sidebar 
        features={features}
        activeFeatureId={activeFeatureId}
        activeVersionId={activeVersionId}
        onSelect={(fId, vId) => { setActiveFeatureId(fId); setActiveVersionId(vId); }}
      />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <PolicyDashboard 
          featureName={currentFeature.featureName}
          data={currentSnapshot} 
          onConfirm={createNewVersion}
        />
      </div>
    </div>
  );
}

export default App;