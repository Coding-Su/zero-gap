import React from 'react';
import styles from './ListPage.module.css';
import type { FeaturePolicy } from '../types';

interface ListPageProps {
  userName: string;
  userRole: string;
  features: FeaturePolicy[];
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onDeleteProject: (id: string) => void;
  onLogout: () => void;
}

const ListPage: React.FC<ListPageProps> = ({
  userName,
  userRole,
  features,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onLogout,
}) => {
  return (
    <div className={styles.container}>
      {/* 1. 상단 네비게이션 바 */}
      <nav className={styles.navbar}>
        <div className={styles.logoGroup}>
          <div className={styles.logoIcon}>P</div>
          <span className={styles.logoText}>Potens.dot VMS</span>
        </div>
        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName}</span>
            <span className={styles.userRole}>{userRole || 'Admin'}</span>
          </div>
          <button className={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <main className={styles.mainContent}>
        {/* 2. 대시보드 헤더 */}
        <header className={styles.pageHeader}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Feature Dashboard</h1>
            <p className={styles.subtitle}>
              관리하세요!
            </p>
          </div>
          <button className={styles.createBtn} onClick={onCreateProject}>
            + New Feature
          </button>
        </header>

        {/* 3. 기능(Feature) 리스트 그리드 */}
        {features.length > 0 ? (
          <div className={styles.grid}>
            {features.map((feature) => {
              // 최신 버전 정보 추출
              const latest = feature.history[0];
              const isUpdated = feature.history.length > 1;

              return (
                <div key={feature.id} className={styles.card} onClick={() => onSelectProject(feature.id)}>
                  <div className={styles.cardHeader}>
                    <div className={styles.badges}>
                      {/* 상태 뱃지 자동 부여 로직 */}
                      {isUpdated ? (
                        <span className={`${styles.badge} ${styles.badgeUpdated}`}>Updated</span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeNew}`}>New</span>
                      )}
                      <span className={styles.versionBadge}>{latest.version}</span>
                    </div>
                    <button 
                      className={styles.deleteIcon}
                      onClick={(e) => {
                        e.stopPropagation(); // 카드 클릭 방지
                        onDeleteProject(feature.id);
                      }}
                    >
                      &times;
                    </button>
                  </div>

                  <h3 className={styles.featureName}>{feature.featureName}</h3>
                  
                  <div className={styles.cardBody}>
                    <p className={styles.changeLog}>
                      {latest.changeLog.length > 40 
                        ? latest.changeLog.substring(0, 40) + '...' 
                        : latest.changeLog}
                    </p>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.dateLabel}>Last updated</span>
                    <span className={styles.dateValue}>{latest.updatedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 데이터가 없을 때 표시 */
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📂</div>
            <h3>등록된 기능이 없습니다.</h3>
            <p>우측 상단의 버튼을 눌러 첫 번째 기능을 등록해보세요.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListPage;