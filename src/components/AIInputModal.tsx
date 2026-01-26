import React, { useState } from 'react';
import styles from './AIInputModal.module.css';
import { analyzeMeetingNotes } from '../services/aiService';

interface Props {
  onClose: () => void;
  onAnalysisComplete: (result: any) => void;
}

const AIInputModal: React.FC<Props> = ({ onClose, onAnalysisComplete }) => {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const handleStartAnalysis = async () => {
    if (!content) return alert("회의록을 입력해 주세요.");

    setIsAnalyzing(true);
    setLoadingStep("회의 맥락을 파악하고 있습니다...");
    
    // 로딩 문구 시뮬레이션
    setTimeout(() => setLoadingStep("에지 케이스를 시뮬레이션 중입니다..."), 1000);

    const result = await analyzeMeetingNotes(content);
    onAnalysisComplete(result);
    setIsAnalyzing(false);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button> {/* [X] 버튼 */}
        
        <h2 className={styles.title}>새로운 회의 맥락 추가하기</h2>
        <p className={styles.description}>
          회의록을 입력해 주세요. AI가 정책 키워드와 예상되는 에지 케이스를 자동으로 추출합니다.
        </p>

        <textarea 
          className={styles.textarea}
          placeholder="오늘 논의된 정책 변경 사항이나 회의 요약본을 입력해 주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isAnalyzing}
        />

        <div className={styles.footer}>
          {isAnalyzing ? (
            <div className={styles.loadingStatus}>{loadingStep}</div>
          ) : (
            <>
              <button className={styles.cancelBtn} onClick={onClose}>나중에 하기</button>
              <button className={styles.analyzeBtn} onClick={handleStartAnalysis}>분석 시작하기</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInputModal;