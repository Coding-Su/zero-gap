import React, { useState } from 'react';

interface DashboardProps {
  featureName: string;
  data: any;
  onConfirm: (note: string) => void;
}

const MainDashboard: React.FC<DashboardProps> = ({ featureName, data, onConfirm }) => {
  const [note, setNote] = useState("");

  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>{featureName} <span style={{ color: '#6366f1' }}>{data.version}</span></h1>
        <span style={{ fontSize: '14px', color: '#94a3b8' }}>수정자: {data.author} | {data.updatedAt}</span>
      </div>

      {/* 정책 데이터 섹션 */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', color: '#64748b' }}>📊 정책 데이터 및 사유</h3>
        <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <strong>수정 사유:</strong> {data.changeLog}
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
            {data.problemCount && <div style={{ flex: 1, padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>문제 개수: <strong>{data.problemCount}개</strong></div>}
            {data.audioPitch && <div style={{ flex: 1, padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>음성 피치: <strong>{data.audioPitch}</strong></div>}
        </div>
      </div>

      {/* 에지케이스 섹션 */}
      <div style={{ background: '#fff1f2', padding: '24px', borderRadius: '16px', border: '1px solid #fecaca', marginBottom: '24px' }}>
        <h3 style={{ marginTop: 0, color: '#be123c', fontSize: '16px' }}>🚨 결정적 데이터 (Edge Case 대응)</h3>
        <ul style={{ color: '#9f1239', margin: 0 }}>
          {data.edgeCases.map((edge: string, i: number) => <li key={i}>{edge}</li>)}
        </ul>
      </div>

      {/* 회의록 입력 섹션 */}
      <div style={{ padding: '24px', backgroundColor: '#f1f5f9', borderRadius: '16px' }}>
        <h3 style={{ marginTop: 0, fontSize: '16px' }}>🎙️ 회의록 입력 (AI 분석)</h3>
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="회의 내용을 입력하면 AI가 사유를 추출하여 신규 버전을 생성합니다..."
          style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '12px', boxSizing: 'border-box' }}
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