import React, { useState } from 'react';
import styles from './LoginPage.module.css';

interface LoginPageProps {
  onLogin: (name: string, role: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && role) onLogin(name, role);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Potens.dot VMS</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>사용자 이름</label>
            <input 
              type="text" 
              placeholder="이름을 입력하세요" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>직무 선택</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className={styles.select}
            >
              <option value="">직무를 선택해주세요</option>
              <option value="기획자">기획자</option>
              <option value="디자이너">디자이너</option>
              <option value="개발자">개발자</option>
            </select>
          </div>

          <button type="submit" className={styles.loginBtn}>
            워크스페이스 입장하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;