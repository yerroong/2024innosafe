import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import Header from '../components/header';
import cameraIcon from '../img/Camera.png';
import onIcon from '../img/on.png';
import offIcon from '../img/off.png';
import fireIcon from '../img/fire.png';
import nofireIcon from '../img/nofire.png';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_KEY = '210a0d632ac32d67f71d71ef5a23dedb';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to right, #a8cbff 0%, #ffffff 50%, #ffffff 100%);
  width: 100%;
  min-height: 100vh;
  padding-top: 50px;
  overflow-y: auto;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  padding: 0 100px;
  margin-top: 60px;
  width: 100%;
`;

const PageTitle = styled.h2`
  display: flex;
  align-items: baseline;
  font-size: 44px;
  font-weight: bold;
  color: #333;
  margin-bottom: 40px;
  align-self: flex-start;
  padding-left: 20%;
  font-family: Arial, sans-serif;
`;

const UserText = styled.span`
  font-size: 40px;
  font-weight: bold;
  color: #1a2e61;
`;

const HouseText = styled.span`
  font-size: 30px;
  font-weight: normal;
  color: #1a2e61;
`;

const WarningOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const WarningBox = styled.div`
  background-color: #ffffff;
  color: #333;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-weight: bold;
  position: relative;
`;

const WarningTitle = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #310000;
  margin-bottom: 20px;
`;

const WarningText = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
`;

const ConfirmButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #cc0000;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 25px;
  width: 100%;
  margin-bottom: 25px;
  justify-content: center;
`;

const Box = styled.div`
  background-color: #ffffff;
  border-radius: 50px;
  box-shadow: 0 6px 12px rgba(0, 120, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  color: #333;
  text-align: center;
  padding: 20px;
  position: relative;
`;

const WideBox = styled(Box)`
  width: 720px;
  height: 120px;
`;

const BoxTitle = styled.div`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
`;

const InfoContent = styled.div`
  display: flex;
  align-items: center;
`;

const InfoItem = styled.span`
  font-size: 36px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  &:last-child {
    margin-right: 0;
  }
`;

const WeatherIcon = styled.img`
  width: 60px;
  height: 60px;
  margin-left: 10px;
`;

const RefreshButton = styled.button`
  position: absolute;
  margin-top: 15px;
  top: 10px;
  right: 15px;
  background-color: transparent;
  border: none;
  color: #909090;
  font-size: 16px;
  cursor: pointer;
`;

const SmallBox = styled(Box)`
  width: 200px;
  height: 120px;
`;

const MediumBox = styled(Box)`
  width: 450px;
  height: 120px;
`;

const CameraBox = styled(SmallBox)`
  background-image: url(${cameraIcon});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 45%;
`;

const FireBox = styled(SmallBox)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FireIcon = styled.img`
  width: 63px;
`;

const FireTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

const FireStatus = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-top: 8px;
  color: ${(props) => (props.isFire ? 'red' : 'green')};
`;

const ValveLabel = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
`;

const ValveStatusText = styled.div`
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.valveLocked ? 'green' : 'red')};
  text-align: center;
`;

const ValveButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const gasUsageData = {
  labels: ['23.10', '23.11', '23.12', '24.01', '24.02', '24.03', '24.04', '24.05', '24.06', '24.07', '24.08', '24.09', '24.10'],
  datasets: [
    {
      label: '가스요금 (만원)',
      data: [5.5, 6.2, 5.3, 8.1, 10, 7.0, 6.5, 3, 2, 1, 5.2, 8.0, 7.0],
      borderColor: 'rgba(0, 120, 255, 0.8)',
      backgroundColor: 'rgba(0, 120, 255, 0.2)',
      fill: true,
    },
  ],
};

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Popup = styled.div`
  background: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const PopupMessage = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const PopupButton = styled.button`
  background-color: #658ff9;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #507de1;
  }
`;

const MyHome = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [weather, setWeather] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [error, setError] = useState(null);
  const [valveLocked, setValveLocked] = useState(false);
  const [iframeVisible, setIframeVisible] = useState(false);
  const [isFire, setIsFire] = useState(false); 
  const [showWarning, setShowWarning] = useState(false);
  const [username, setUsername] = useState('사용자'); // 초기값 설정
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태 추가
  const navigate = useNavigate();

  const latitude = 37.450354677762;
  const longitude = 126.65915614333;

  const getWeather = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`)
      .then((response) => response.json())
      .then((data) => {
        setTemperature(data.main.temp);
        setHumidity(data.main.humidity);
        setWeather(data.weather[0].description);
        setIconUrl(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
      })
      .catch(() => {
        setError('날씨 정보를 불러오지 못했습니다.');
      });
  };

  const handleFireAlert = () => {
    setTimeout(() => {
      setShowWarning(true); 
    }, 200);
  };

  const handlePopupConfirm = () => {
    setShowPopup(false);
    navigate('/login'); // 로그인 페이지로 이동
  };

  
  const closeWarning = () => {
    setShowWarning(false);
  };

  const confirmWarning = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    getWeather(latitude, longitude);

    if (isFire) {
      handleFireAlert();
    }
  }, [isFire]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername); // 상태 업데이트
    }
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('access_token');
    const storedUsername = localStorage.getItem('username');

    if (!isLoggedIn) {
      setShowPopup(true); // 로그인이 안 되어 있으면 팝업 표시
      setUsername('사용자'); // 사용자 이름 복구
    } else if (storedUsername) {
      setUsername(storedUsername); // 사용자 이름 설정
    }
  }, []);

  const refreshWeather = () => {
    window.location.reload();
  };

  const toggleValveLock = () => {
    setValveLocked(!valveLocked);
    setIframeVisible(!valveLocked);
  };

  return (
    <Container>
      <Header />
      {showPopup && (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '40px 50px', // 패딩 키움
          width: '400px',       // 팝업 너비 키움
          borderRadius: '15px', // 모서리 더 둥글게
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)', // 그림자 키움
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '22px', // 텍스트 크기 키움
            fontWeight: 'bold',
            marginBottom: '25px',
            color: '#333',
          }}
        >
          로그인을 해주세요.
        </div>
        <button
        onClick={handlePopupConfirm}
        style={{
          backgroundColor: '#658ff9',
          color: '#fff',
          padding: '8px 16px', // 버튼 크기 축소
          border: 'none',
          borderRadius: '5px', // 모서리 약간 둥글게
          cursor: 'pointer',
          fontSize: '14px', // 버튼 텍스트 크기 축소
        }}
      >
        확인
      </button>
      </div>
    </div>
  )}
      <Wrapper>
        <PageTitle>
          <UserText>{username}</UserText>
          <HouseText>의 집</HouseText>
        </PageTitle>

        {showWarning && (
          <WarningOverlay>
            <WarningBox>
              <CloseButton onClick={closeWarning}>✖</CloseButton>
              <WarningTitle>⚠️위험⚠️</WarningTitle>
              <WarningText>화재가 감지되었습니다. 즉시, 집 상태를 확인하세요.</WarningText>
              <ConfirmButton onClick={confirmWarning}>확인</ConfirmButton>
            </WarningBox>
          </WarningOverlay>
        )}

        <Row>
          <WideBox>
            <BoxTitle>용현동 날씨</BoxTitle>
            <RefreshButton onClick={refreshWeather}>🔄 새로고침</RefreshButton>
            {error ? (
              <div>{error}</div>
            ) : (
              <InfoContent>
                <InfoItem>💧 {humidity !== null ? `${humidity}%` : '-'}</InfoItem>
                <InfoItem>🌡️{temperature !== null ? `${temperature}°C` : '-'}</InfoItem>
                <InfoItem>
                  {iconUrl && <WeatherIcon src={iconUrl} alt="날씨 아이콘" />}
                  {weather || '-'}
                </InfoItem>
              </InfoContent>
            )}
          </WideBox>
        </Row>

        <Row>
          <SmallBox>
            <BoxTitle>우리집 날씨</BoxTitle>
            {humidity}% / {temperature}°C
          </SmallBox>
          <SmallBox>
            <ValveButton onClick={toggleValveLock}>
              <ValveLabel>밸브</ValveLabel>
              <img src={valveLocked ? onIcon : offIcon} alt={valveLocked ? 'On' : 'Off'} style={{ width: '110px', height: 'auto' }} />
              <ValveStatusText valveLocked={valveLocked}>{valveLocked ? '밸브 잠금' : '밸브 해제'}</ValveStatusText>
            </ValveButton>
          </SmallBox>
          <FireBox>
            <FireTitle>불꽃 감지</FireTitle>
            <FireIcon src={isFire ? fireIcon : nofireIcon} alt="불꽃 상태 아이콘" />
            <FireStatus isFire={isFire}>
              {isFire ? '화재가 감지되었습니다' : '화재가 감지되지 않았습니다'}
            </FireStatus>
          </FireBox>
        </Row>

        <Row>
          <MediumBox>
            <BoxTitle>우리집 가스요금</BoxTitle>
            <Line data={gasUsageData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </MediumBox>
          <CameraBox />
        </Row>

        {iframeVisible && (
          <iframe src="http://172.20.10.8/servo1" style={{ display: 'none', width: '0', height: '0', border: 'none' }} title="Servo Control"></iframe>
        )}
      </Wrapper>
    </Container>
  );
};

export default MyHome;
