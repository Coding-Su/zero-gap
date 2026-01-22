import React, { useState } from 'react';
import styles from './DetailPage.module.css';
import type { FeaturePolicy, HistoryItem } from '../types.ts';

interface DetailPageProps {
  project: FeaturePolicy;
  onBack: () => void;
  onSaveVersion: (projectId: string, newVersion: any) => void;
  currentUserName: string;
}

const DetailPage: React.FC<DetailPageProps> = ({ project, onBack, onSaveVersion, currentUserName }) => {
  // [상태 관리] 현재 활성화된 버전 정의
  const [activeVersion, setActiveVersion] = useState(project.history[0]);
  const [editData, setEditData] = useState({ ...activeVersion.policyData });
  const [changeLog, setChangeLog] = useState(activeVersion.changeLog || "");
  const [edgeCases, setEdgeCases] = useState<string[]>([...activeVersion.edgeCases]);
  
  // [수정] 체크리스트 상태: '진행중'과 '완료'만 사용
  const [checklist, setChecklist] = useState<any[]>(
    activeVersion.checklist && activeVersion.checklist.length > 0 
    ? [...activeVersion.checklist] 
    : [
        { task: "변경 정책 보안 검토", status: "진행중" },
        { task: "개발 환경 적용 테스트", status: "진행중" }
      ]
  );

  const [meetingMinutes, setMeetingMinutes] = useState("");
  const [diffSummary, setDiffSummary] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // [핵심 수정] 체크리스트 상태 전환 (진행중 <-> 완료 이진 전환)
  const handleToggleChecklist = (index: number) => {
    const updatedList = checklist.map((item, i) => {
      if (i === index) {
        // '진행중'이면 '완료'로, 그 외(완료)면 다시 '진행중'으로 변경
        const nextStatus = item.status === "진행중" ? "완료" : "진행중";
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setChecklist(updatedList);
  };

  // [로직] 버전 클릭 시 데이터 복구
  const handleVersionClick = (selectedVersion: HistoryItem) => {
    setActiveVersion(selectedVersion);
    setEditData({ ...selectedVersion.policyData });
    setChangeLog(selectedVersion.changeLog || "");
    setEdgeCases([...selectedVersion.edgeCases]);
    setChecklist(selectedVersion.checklist && selectedVersion.checklist.length > 0 
      ? [...selectedVersion.checklist] 
      : []);
    setDiffSummary([]);
    setMeetingMinutes("");
  };

  // [로직] Potens.dot AI 분석 (한글 레이블 반영)
  const handleAIAnalysis = () => {
    if (!meetingMinutes.trim()) { alert("분석할 회의록을 입력해 주세요."); return; }
    setIsAnalyzing(true);
    setTimeout(() => {
      const mockResult = {
        changeLog: "야간 배차 정책 상향 조정 및 운영 효율화 결정.",
        diff: ["할증률: 10% → 15%", "기본요금: 3,000원 → 3,500원"],
        edgeCases: ["기상 악화 시 할증 탄력 적용", "장거리 미칭 찬스 도입"],
        checklist: [
          { task: "결제 모듈 업데이트 확인", status: "진행중" },
          { task: "유관 부서 정책 공유", status: "진행중" }
        ]
      };
      setChangeLog(mockResult.changeLog);
      setDiffSummary(mockResult.diff);
      setEdgeCases(mockResult.edgeCases);
      setChecklist(mockResult.checklist);
      setIsAnalyzing(false);
    }, 1000);
  };

  // [로직] 변경 사항 저장
  const handleSave = () => {
    if (!changeLog.trim()) { alert("변경 사유를 작성해 주세요!"); return; }
    const now = new Date();
    const timeStr = `${now.toLocaleDateString()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newVersion = {
      version: `v1.${project.history.length}`,
      updatedAt: timeStr,
      author: currentUserName, // 김용수님 성함 반영
      changeLog: changeLog,
      policyData: editData,
      edgeCases: edgeCases,
      checklist: checklist
    };
    onSaveVersion(project.id, newVersion);
    alert("한글 상태가 적용된 새 버전이 저장되었습니다.");
  };

  return (
    <div className={styles.wrapper}>
      {/* 1. 좌측 사이드바: 버전 히스토리 */}
      <aside className={styles.sidebar}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
        <h3 className={styles.sidebarTitle}>Version History</h3>
        <div className={styles.historyList}>
          {project.history.map((h, i) => (
            <div key={i} className={`${styles.historyItem} ${activeVersion.version === h.version ? styles.activeItem : ''}`}
              onClick={() => handleVersionClick(h)}>
              <div className={styles.historyHeader}><strong>{h.version}</strong><span className={styles.historyDate}>{h.updatedAt}</span></div>
              <p className={styles.historyLog}>{h.changeLog || "초기 설정"}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. 중앙 콘텐츠: AI 분석 및 컨텍스트 */}
      <main className={styles.mainContent}>
        <header className={styles.headerCard}>
          <div className={styles.activeBadge}>Active Policy</div>
          <h1 className={styles.featureTitle}>{project.featureName}</h1>
          <p className={styles.lastEdit}>Last edited by {activeVersion.author}</p>
        </header>

        <section className={styles.aiInputSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>AI Meeting Analysis</h2>
            <button className={styles.aiBtn} onClick={handleAIAnalysis} disabled={isAnalyzing}>
              {isAnalyzing ? "분석 중..." : "AI 분석"}
            </button>
          </div>
          <textarea className={styles.minutesTextarea} value={meetingMinutes} onChange={(e) => setMeetingMinutes(e.target.value)} />
        </section>

        <section className={styles.contextSectionBox}>
          <h2 className={styles.sectionTitle}>Change Context (Why)</h2>
          <div className={styles.diffContainer}>
            {diffSummary.map((diff, idx) => <span key={idx} className={styles.diffBadge}>{diff}</span>)}
          </div>
          <textarea className={styles.textarea} value={changeLog} onChange={(e) => setChangeLog(e.target.value)} />
        </section>
      </main>

      {/* 3. 우측 바: 수정된 한글 체크리스트 */}
      <aside className={styles.contextBar}>
        <h3 className={styles.sidebarTitle}>Edge Cases</h3>
        <div className={styles.edgeList}>
          {edgeCases.map((ec, i) => <div key={i} className={styles.edgeCard}>{ec}</div>)}
        </div>
        
        <h3 className={`${styles.sidebarTitle} ${styles.mt30}`}>Checklist</h3>
        <div className={styles.checkList}>
          {checklist.map((item, i) => (
            <div 
              key={i} 
              className={`${styles.checkItem} ${item.status === '완료' ? styles.doneItem : ''}`} 
              onClick={() => handleToggleChecklist(i)}
            >
              {/* 상태 텍스트에 따라 CSS 클래스 매핑 */}
              <span className={`${styles.statusBadge} ${item.status === '진행중' ? styles.inprogress : styles.done}`}>
                {item.status}
              </span>
              <p className={item.status === '완료' ? styles.strikethrough : ''}>{item.task}</p>
            </div>
          ))}
        </div>
        <button className={styles.saveBtnFixed} onClick={handleSave}>새 버전으로 저장</button>
      </aside>
    </div>
  );
};

export default DetailPage;