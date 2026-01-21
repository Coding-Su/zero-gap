import React from 'react';

interface SidebarProps {
  features: any[];
  activeFeatureId: string;
  activeVersionId: string;
  onSelect: (fId: string, vId: string) => void;
}

const VersionSidebar: React.FC<SidebarProps> = ({ features, activeFeatureId, activeVersionId, onSelect }) => {
  return (
    <div style={{ width: '280px', background: '#fff', borderRight: '1px solid #e2e8f0', padding: '20px', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '20px' }}>📌 기능별 버전 관리</h3>
      {features.map((feature) => (
        <div key={feature.id} style={{ marginBottom: '25px' }}>
          <h4 style={{ fontSize: '14px', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase' }}>{feature.featureName}</h4>
          {feature.history.map((rev: any) => (
            <div
              key={rev.version}
              onClick={() => onSelect(feature.id, rev.version)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '5px',
                fontSize: '14px',
                backgroundColor: activeFeatureId === feature.id && activeVersionId === rev.version ? '#eef2ff' : 'transparent',
                color: activeFeatureId === feature.id && activeVersionId === rev.version ? '#6366f1' : '#475569',
                fontWeight: activeFeatureId === feature.id && activeVersionId === rev.version ? 'bold' : 'normal'
              }}
            >
              {rev.version} {activeFeatureId === feature.id && activeVersionId === rev.version && '●'}
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{rev.updatedAt}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VersionSidebar;