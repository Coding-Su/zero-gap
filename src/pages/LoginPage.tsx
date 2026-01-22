import React, { useState } from 'react';
import styles from './LoginPage.module.css'; // 파일명 대소문자 확인!

interface LoginPageProps {
  onLogin: (name: string, role: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const roles = [
    { id: 'pm', label: '기획자' },
    { id: 'dev', label: '개발자' },
    { id: 'design', label: '디자이너' }
  ];

  const handleEnter = () => {
    if (name && role) onLogin(name, role);
    else alert("이름과 직무를 입력해주세요.");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Potens.dot VMS</h1>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>사용자 이름</label>
          <input 
            className={styles.input}
            placeholder="성함을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>직무 선택</label>
          <div className={styles.roleGrid}>
            {roles.map((r) => (
              <div 
                key={r.id}
                className={`${styles.roleItem} ${role === r.id ? styles.roleItemActive : ''}`}
                onClick={() => setRole(r.id)}
              >
                <span style={{ fontWeight: 700 }}>{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button className={styles.submitBtn} onClick={handleEnter}>
          워크스페이스 입장하기
        </button>
      </div>
    </div>
  );
};

export default LoginPage;