import React, { useState } from 'react';
import styles from './ProjectModal.module.css';

interface ProjectModalProps {
  onClose: () => void;
  onSave: (name: string, desc: string) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ onClose, onSave }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!projectName.trim()) {
      alert("프로젝트 이름을 입력해주세요.");
      return;
    }
    onSave(projectName, description);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>새 프로젝트 생성</h2>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>프로젝트 이름</label>
          <input 
            className={styles.input}
            placeholder="예: 배차 요금 정책 최적화"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>프로젝트 설명 (선택)</label>
          <textarea 
            className={styles.textarea}
            placeholder="이 프로젝트의 목적이나 주요 맥락을 적어주세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>취소</button>
          <button className={styles.submitBtn} onClick={handleSubmit}>프로젝트 생성</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;