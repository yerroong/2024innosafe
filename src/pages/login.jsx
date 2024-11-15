import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/header';
import LoginLogo from '../img/LoginLogo.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to right, #a8cbff 0%, #ffffff 50%, #ffffff 100%);
  width: 100%;
  height: 100vh;
  padding-top: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  padding: 0 100px;
  margin-top: 200px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Logo = styled.img`
  width: 500px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 20px;
  margin-left: 60px;
`;

const InfoText = styled.p`
  color: #c9c9c9;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

const Input = styled.input`
  width: 300px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
  border: 1px solid #c9c9c9;
  background-color: #f4f4f4;
  outline: none;
  font-size: 16px;
  color: #939393;
  text-align: center;

  &::placeholder {
    color: #939393;
  }
`;

const Button = styled.button`
  width: 300px;
  padding: 12px;
  margin-top: 15px;
  background-color: #8eabf3;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #ffffff;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;

  &:hover {
    background-color: #7ea3e8;
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      localStorage.setItem('access_token', 'your-token'); // 예시로 토큰 저장
      localStorage.setItem('username', username); // 사용자 아이디 저장
      alert('로그인 되었습니다!');
      navigate('/myhome'); // 로그인 후 /myhome 페이지로 이동
    } else {
      alert('아이디와 비밀번호를 입력해주세요!');
    }
  };

  return (
    <Container>
      <Header />
      <Wrapper>
        <LogoContainer>
          <Logo src={LoginLogo} alt="INOSAFE Logo" />
        </LogoContainer>
        <LoginContainer>
          <InfoText>아이디 및 이메일로 로그인할 수 있어요.</InfoText>
          <Input
            type="text"
            placeholder="아이디 또는 이메일"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin}>로그인</Button>
        </LoginContainer>
      </Wrapper>
    </Container>
  );
};

export default LoginPage;
