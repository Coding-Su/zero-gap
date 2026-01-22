import React from 'react';
import styles from './DeleteModal.module.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, projectName }) => {
  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconArea}>⚠️</div>
        <h2 className={styles.title}>프로젝트 삭제</h2>
        <p className={styles.message}>
          <strong>[{projectName}]</strong> 프로젝트를 정말로 삭제하시겠습니까?<br/>
          삭제된 데이터는 절대 복구할 수 없습니다.
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.cancelBtn} onClick={onClose}>아니오, 유지할게요</button>
          <button className={styles.confirmBtn} onClick={onConfirm}>예, 삭제합니다</button>
        </div>
      </div>
    </div>
  );
};

// [중요] 이 부분이 빠지면 App.tsx에서 에러가 납니다!
export default DeleteModal;