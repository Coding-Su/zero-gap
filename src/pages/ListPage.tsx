import React from 'react';
import styles from './ListPage.module.css';
import type { FeaturePolicy } from '../types.ts';

interface ListPageProps {
  userName: string;
  userRole: string;
  features: FeaturePolicy[];
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onLogout: () => void;
  onDeleteProject: (id: string) => void;
}

const ListPage: React.FC<ListPageProps> = ({ 
  userName, userRole, features, onSelectProject, onCreateProject, onLogout, onDeleteProject 
}) => {
  return (
    <div className={styles.wrapper}>
      {/* 상단 어두운 바 (이름/직무/로그아웃 유지) */}
      <header className={styles.topNav}>
        <div className={styles.topNavContent}>
          <div className={styles.brand}>
            <span className={styles.logoText}>Potens.dot VMS</span>
          </div>
          
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>{userRole}</span>
            </div>
            <button className={styles.logoutBtn} onClick={onLogout}>로그아웃</button>
          </div>
        </div>
        
        <div className={styles.heroSection}>
          <h1 className={styles.welcomeTitle}>워크스페이스 대시보드</h1>
          <div className={styles.searchWrapper}>
            <input type="text" placeholder="프로젝트 또는 정책 검색..." className={styles.searchInput} />
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.mainContent}>
        <div className={styles.actionBar}>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>전체 프로젝트 목록</h2>
          <button className={styles.mainCreateBtn} onClick={onCreateProject}>
            + 새 프로젝트 생성
          </button>
        </div>

        <div className={styles.grid}>
          {features.map((f) => (
            <div key={f.id} className={styles.card} onClick={() => onSelectProject(f.id)}>
              {/* [중요] 여기에 빨간색 삭제 버튼이 들어갑니다 */}
              <button 
                className={styles.deleteBtn} 
                onClick={(e) => {
                  e.stopPropagation(); // 카드 클릭 전파 방지
                  onDeleteProject(f.id); 
                }}
              >
                삭제
              </button>

              <div className={styles.cardInfo}>
                <div style={{ fontSize: '24px', marginBottom: '15px' }}>📁</div>
                <h3 className={styles.cardTitle}>{f.featureName}</h3>
              </div>
              <div className={styles.cardFooter}>
                {/* [해결] f.currentVersionId를 정상적으로 호출합니다 */}
                <span className={styles.versionTag}>버전: {f.currentVersionId}</span>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                  최근 수정: {f.history[0]?.updatedAt}
                </p>
              </div>
            </div>
          ))}

          {/* 추가 유도 카드 */}
          <div className={`${styles.card} ${styles.addCard}`} onClick={onCreateProject}>
             <span>+ 새로운 프로젝트 추가</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListPage;