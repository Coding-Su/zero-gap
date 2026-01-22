import React, { useState } from 'react';

interface DashboardProps {
  featureName: string;
  data: any;
  onConfirm: (note: string) => void;
}

const MainDashboard: React.FC<DashboardProps> = ({ featureName, data, onConfirm }) => {
  const [note, setNote] = useState("");

  // TTS 재생 함수
  const playTTS = () => {
    const message = "새로운 정책이 적용된 목소리입니다. 피치와 속도를 확인해보세요.";
    const utterance = new SpeechSynthesisUtterance(message);
    
    // policyData에 있는 가변 수치를 적용 (기본값 설정)
    utterance.pitch = Number(data.policyData["피치"]) || 1.0;
    utterance.rate = Number(data.policyData["속도"]) || 1.0;
    
    // 목소리 성별 설정 시뮬레이션
    const voices = window.speechSynthesis.getVoices();
    if (data.policyData["목소리"] === "남성") {
      utterance.voice = voices.find(v => v.name.includes("Google") && v.name.includes("Male")) || voices[0];
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '8px' }}>{featureName}</h1>
          <span style={{ backgroundColor: '#6366f1', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>{data.version}</span>
        </div>
        
        {/* TTS 시뮬레이션 버튼 추가 */}
        {featureName === "TTS 엔진 설정" && (
          <button 
            onClick={playTTS}
            style={{ backgroundColor: '#10b981', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔊 현재 정책으로 듣기
          </button>
        )}
      </div>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ marginTop: 0, fontSize: '14px', color: '#64748b' }}>📊 확정된 정책 데이터</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
          {Object.entries(data.policyData).map(([key, value]) => (
            <div key={key} style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{key}</span>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{String(value)}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff1f2', padding: '24px', borderRadius: '16px', border: '1px solid #fecaca', marginBottom: '24px' }}>
        <h3 style={{ marginTop: 0, color: '#be123c', fontSize: '15px' }}>🚨 에지 케이스 (Edge Case)</h3>
        <ul style={{ color: '#9f1239', margin: 0, paddingLeft: '20px' }}>
          {data.edgeCases.map((edge: string, i: number) => <li key={i}>{edge}</li>)}
        </ul>
      </div>

      <div style={{ padding: '24px', backgroundColor: '#f1f5f9', borderRadius: '16px' }}>
        <h3 style={{ marginTop: 0, fontSize: '16px' }}>🎙️ 회의록 입력 (AI 분석)</h3>
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="회의 내용을 입력하세요 (예: 피치를 높이고 속도를 빠르게 수정)"
          style={{ width: '100%', height: '80px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '12px', boxSizing: 'border-box' }}
        />
        <button 
          onClick={() => { if(note) { onConfirm(note); setNote(""); } }}
          style={{ width: '100%', backgroundColor: '#6366f1', color: '#fff', padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          정책 확정 및 버전 생성
        </button>
      </div>
    </div>
  );
};

export default MainDashboard;