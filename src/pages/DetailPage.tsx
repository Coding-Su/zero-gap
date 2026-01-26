import React, { useState, useEffect } from 'react';
import styles from './DetailPage.module.css';
import type { FeaturePolicy, HistoryItem } from '../types.ts';
import { analyzeMeetingNotes } from '../services/aiService';

interface DetailPageProps {
  project: FeaturePolicy;
  onBack: () => void;
  onSaveVersion: (projectId: string, newVersion: any) => void;
  currentUserName: string;
}

const DetailPage: React.FC<DetailPageProps> = ({ project, onBack, onSaveVersion, currentUserName }) => {
  // [1] 상태 초기화: 가장 최신 버전에서 데이터를 가져옵니다.
  const [activeVersion, setActiveVersion] = useState(project.history[project.history.length - 1]);
  const [editData, setEditData] = useState({ ...activeVersion.policyData });
  const [changeLog, setChangeLog] = useState(activeVersion.changeLog || "");
  const [edgeCases, setEdgeCases] = useState<string[]>([...activeVersion.edgeCases]);
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

  // [2] v1.0 자동 분석 로직: 내용이 있는데 에지 케이스가 없을 때만 실행
  useEffect(() => {
    if (activeVersion.version === "v1.0" && edgeCases.length === 0 && activeVersion.changeLog) {
      handleAIAnalysis(activeVersion.changeLog, true);
    }
  }, []);

  // [3] 체크리스트 상태 전환
  const handleToggleChecklist = (index: number) => {
    setChecklist(prev => prev.map((item, i) => 
      i === index ? { ...item, status: item.status === "진행중" ? "완료" : "진행중" } : item
    ));
  };

  // [4] 버전 전환 시 데이터 동기화
  const handleVersionClick = (selectedVersion: HistoryItem) => {
    setActiveVersion(selectedVersion);
    setEditData({ ...selectedVersion.policyData });
    setChangeLog(selectedVersion.changeLog || "");
    setEdgeCases([...selectedVersion.edgeCases]);
    setChecklist([...selectedVersion.checklist]);
    setDiffSummary([]);
    setMeetingMinutes("");
  };

  /**
   * [5] AI 분석 실행 (기존 맥락 전달 및 누적)
   * @param inputText 분석할 텍스트
   * @param isInitial 최초 분석 여부
   */
  const handleAIAnalysis = async (inputText?: string, isInitial: boolean = false) => {
    const targetText = inputText || meetingMinutes;
    if (!targetText.trim()) { alert("분석할 내용을 입력해 주세요."); return; }
    
    setIsAnalyzing(true);
    try {
      // AI에게 지금까지의 진행 상황을 '맥락'으로 전달합니다.
      const contextPrompt = isInitial 
        ? targetText 
        : `[현재 기획 상태]\n${changeLog}\n\n[기존 에지 케이스]\n${edgeCases.join(', ')}\n\n[새로운 피드백]\n${targetText}\n\n위 피드백을 반영해서 기존 기획을 업데이트하고 새로운 에지 케이스를 추가해줘.`;

      const result = await analyzeMeetingNotes(contextPrompt); 
      
      if (result.extractedPolicies) {
        setDiffSummary(prev => Array.from(new Set([...prev, ...result.extractedPolicies.map(p => `${p.category}: 업데이트`)])));
        const newSummary = result.extractedPolicies.map(p => `- [${p.category}] ${p.content}`).join("\n");
        
        // 초기 분석이면 덮어쓰고, 피드백이면 기존 로그에 덧붙입니다.
        setChangeLog(prev => isInitial ? newSummary : `${prev}\n\n[피드백 반영]\n${newSummary}`);
      }
      
      if (result.potentialEdgeCases) {
        // 기존 에지 케이스를 유지하면서 새로운 결과만 중복 없이 추가합니다.
        setEdgeCases(prev => Array.from(new Set([...prev, ...result.potentialEdgeCases])));
      }
    } catch (error) {
      console.error(error);
      alert("분석 실패. API 설정을 확인해주세요.");
    } finally {
      setIsAnalyzing(false);
      if (!isInitial) setMeetingMinutes(""); // 피드백 입력 후 창 비우기
    }
  };

  // [6] 새 버전 저장 (누적된 모든 데이터를 담아 저장)
  const handleSave = () => {
    if (!changeLog.trim()) { alert("변경 내용을 입력해 주세요."); return; }
    const now = new Date();
    const timeStr = `${now.toLocaleDateString()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newVersion = {
      version: `v1.${project.history.length}`,
      updatedAt: timeStr,
      author: currentUserName,
      changeLog: changeLog,
      policyData: editData,
      edgeCases: [...edgeCases], // 누적된 에지 케이스 보존
      checklist: [...checklist]  // 현재 체크리스트 상태 보존
    };
    
    onSaveVersion(project.id, newVersion);
    alert(`${newVersion.version} 버전으로 기획 자산이 업데이트되었습니다.`);
  };

  return (
    <div className={styles.wrapper}>
      {/* 1. 좌측 사이드바: 버전 히스토리 */}
      <aside className={styles.sidebar}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
        <h3 className={styles.sidebarTitle}>Version History</h3>
        <div className={styles.historyScrollArea}>
          <div className={styles.historyList}>
            {project.history.map((h, i) => (
              <div key={i} className={`${styles.historyItem} ${activeVersion.version === h.version ? styles.activeItem : ''}`}
                onClick={() => handleVersionClick(h)}>
                <div className={styles.historyHeader}><strong>{h.version}</strong><span className={styles.historyDate}>{h.updatedAt}</span></div>
                <p className={styles.historyLog}>{h.changeLog || "초기 설정"}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. 중앙 콘텐츠: 분석 및 변경 맥락 */}
      <main className={styles.mainContent}>
        <header className={styles.headerCard}>
          <div className={styles.activeBadge}>Active Policy</div>
          <h1 className={styles.featureTitle}>{project.featureName}</h1>
          <p className={styles.lastEdit}>Last edited by {activeVersion.author}</p>
        </header>

        <section className={styles.aiInputSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>AI Feedback Analysis</h2>
            <button className={styles.aiBtn} onClick={() => handleAIAnalysis()} disabled={isAnalyzing}>
              {isAnalyzing ? "분석 중..." : "피드백 반영"}
            </button>
          </div>
          <textarea 
            className={styles.minutesTextarea} 
            value={meetingMinutes} 
            onChange={(e) => setMeetingMinutes(e.target.value)} 
            placeholder="수정 사항이나 피드백을 입력하면 기존 기획에 누적 반영됩니다." 
          />
        </section>

        <section className={styles.contextSectionBox}>
          <h2 className={styles.sectionTitle}>Change Context (Why)</h2>
          <div className={styles.diffContainer}>
            {diffSummary.map((diff, idx) => <span key={idx} className={styles.diffBadge}>{diff}</span>)}
          </div>
          <textarea className={styles.textarea} value={changeLog} onChange={(e) => setChangeLog(e.target.value)} />
        </section>
      </main>

      {/* 3. 우측 사이드바: 에지 케이스 및 체크리스트 (고정 버튼 구조) */}
      <aside className={styles.contextBar}>
        <div className={styles.contextScrollArea}>
          <div className={styles.sidebarHeaderRow}>
            <h3 className={styles.sidebarTitle}>Edge Cases</h3>
            <button className={styles.clearBtn} onClick={() => { if(confirm("초기화하시겠습니까?")) setEdgeCases([]) }}>Clear</button>
          </div>
          <div className={styles.edgeList}>
            {edgeCases.map((ec, i) => <div key={i} className={styles.edgeCard}>{ec}</div>)}
          </div>
          
          <h3 className={`${styles.sidebarTitle} ${styles.mt30}`}>Checklist</h3>
          <div className={styles.checkList}>
            {checklist.map((item, i) => (
              <div key={i} className={`${styles.checkItem} ${item.status === '완료' ? styles.doneItem : ''}`} onClick={() => handleToggleChecklist(i)}>
                <span className={`${styles.statusBadge} ${item.status === '진행중' ? styles.inprogress : styles.done}`}>
                  {item.status}
                </span>
                <p className={item.status === '완료' ? styles.strikethrough : ''}>{item.task}</p>
              </div>
            ))}
          </div>
        </div>
        <button className={styles.saveBtnFixed} onClick={handleSave}>새 버전으로 저장</button>
      </aside>
    </div>
  );
};

export default DetailPage;