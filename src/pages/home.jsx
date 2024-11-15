import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import phoneImage from '../img/phone.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to right, #a8cbff 0%, #ffffff 50%, #ffffff 100%);
  width: 100%;
  height: 100vh;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  max-width: 1200px;
  margin-top: 100px;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;
  margin-top: 10px;
  margin-left: 60px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 15px;
  line-height: 1.3;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: #a0a0a0;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 16px 32px;
  font-size: 1.2rem;
  color: #ffffff;
  background-color: #658ff9;
  border: 3.5px solid #ffffff;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 30px;

  &:hover {
    background-color: #6d8dd5;
  }
`;

const ImageSection = styled.div`
  width: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 70px;
  margin-top: 40px;
`;

const Image = styled.img`
  width: 80%;
  max-width: 280px;
`;

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('access_token')); // 로그인 상태 확인

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate('/myhome'); // 로그인 상태에서 '우리집 보기'로 이동
    } else {
      navigate('/login'); // 비로그인 상태에서 로그인 페이지로 이동
    }
  };

  return (
    <Container>
      <Header />
      <Content>
        <TextSection>
          <Title>우리집 안전 지키미,<br />간편하게 확인해보세요!</Title>
          <Subtitle>
            화재 감지와 연동된 가스 밸브 자동 제어 및 집안 상황 확인 기능으로 더 안전한 집을 제공합니다!
          </Subtitle>
          <Button onClick={handleButtonClick}>
            {isLoggedIn ? '우리집 보기' : '로그인 하기'}
          </Button>
        </TextSection>
        <ImageSection>
          <Image src={phoneImage} alt="폰 이미지" />
        </ImageSection>
      </Content>
    </Container>
  );
};

export default Home;
