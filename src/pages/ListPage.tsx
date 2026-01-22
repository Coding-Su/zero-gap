import React, { useState } from 'react';
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
  // [추가] 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * [필터링 로직]
   * 검색어가 포함된 프로젝트 이름만 걸러냅니다. (대소문자 구분 없음)
   */
  const filteredFeatures = (features || []).filter((f) =>
    f.featureName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.wrapper}>
      {/* 상단 어두운 바 */}
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
            {/* [연동] 검색창 입력 시 searchTerm 상태 업데이트 */}
            <input 
              type="text" 
              placeholder="프로젝트 또는 정책 검색..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          {/* [변경] 전체 features가 아닌 필터링된 목록을 보여줍니다. */}
          {filteredFeatures.map((f) => (
            <div key={f.id} className={styles.card} onClick={() => onSelectProject(f.id)}>
              <button 
                className={styles.deleteBtn} 
                onClick={(e) => {
                  e.stopPropagation(); 
                  onDeleteProject(f.id); 
                }}
              >
                삭제
              </button>

              <div className={styles.cardInfo}>
                <div style={{ fontSize: '24px', marginBottom: '15px' }}>📁</div>
                <h3 className={styles.cardTitle}>{f.featureName}</h3>
                {/* [연동] 새 프로젝트 생성 시 입력한 설명(changeLog) 노출 */}
                <p className={styles.cardDescription}>
                  {f.history[0]?.changeLog}
                </p>
              </div>
              
              <div className={styles.cardFooter}>
                {/* [해결] f.currentVersionId 에러 수정 완료 */}
                <span className={styles.versionTag}>버전: {f.currentVersionId}</span>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                  최근 수정: {f.history[0]?.updatedAt}
                </p>
              </div>
            </div>
          ))}

          {/* 프로젝트가 검색되지 않을 때 보여줄 안내 (선택사항) */}
          {filteredFeatures.length === 0 && searchTerm && (
            <p style={{ gridColumn: '1/-1', color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
              검색 결과가 없습니다.
            </p>
          )}

          <div className={`${styles.card} ${styles.addCard}`} onClick={onCreateProject}>
             <span>+ 새로운 프로젝트 추가</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListPage;