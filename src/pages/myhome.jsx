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
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_KEY = '210a0d632ac32d67f71d71ef5a23dedb';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to right, #a8cbff 0%, #ffffff 80%, #ffffff 100%);
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 65%;
  margin-right: 20px;
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;


const MainContent = styled.div`
  display: flex; /* 가로로 나란히 배치 */
  justify-content: space-between; /* 양쪽 정렬 */
  align-items: flex-start; /* 상단 정렬 */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto; /* 가운데 정렬 */
  padding: 0 20px; /* 양쪽 여백 추가 */
  box-sizing: border-box;
`;


const RightPanel = styled.div`
  flex: 0 0 30%; /* 너비를 30%로 고정 */
  max-width: 30%; /* 최대 너비 제한 */
  margin-top: 125px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 120, 255, 0.2);
  padding: 20px;
  overflow-y: auto; /* 스크롤 가능 */
  height: calc(100vh - 120px);
  box-sizing: border-box;
`;

const PageTitle = styled.h2`
  display: flex;
  align-items: baseline;
  font-size: 44px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  align-self: flex-start;
  padding-left: 5px;
  font-family: Arial, sans-serif;
`;

const NewsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const NewsItem = styled.li`
  margin-bottom: 8px; /* 박스 간 간격 줄이기 */
  padding: 8px; /* 내부 여백 줄이기 */
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  display: flex;
  gap: 8px; /* 이미지와 텍스트 간 간격 줄이기 */
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  height: 90px; /* 고정 높이 설정 */
`;

const NewsImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
`;

const NewsContent = styled.div`
  flex: 1;
  text-align: right;
`;

const NewsTitle = styled.a`
  font-size: 14px;
  font-weight: bold;
  color: #00376e;
  text-decoration: none;
  display: -webkit-box; /* 블록으로 설정 */
  -webkit-line-clamp: 1; /* 한 줄로 제한 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
`;

const NewsDescription = styled.p`
  font-size: 10px;
  color: #555;
  display: -webkit-box; /* 블록으로 설정 */
  -webkit-line-clamp: 1; /* 한 줄로 제한 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  width: 100%;
  line-height: 1.2;
`;

const NewsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
`;

const NewsTitleHeader = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const NewsDate = styled.p`
  font-size: 10px;
  color: #888;
  text-align: right;
  margin-top: 5px;
  margin-bottom: 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  margin-bottom: 15px;
  margin-top: 5px;
`;

const Button = styled.button`
  background-color: ${(props) => (props.active ? '#0073e6' : '#f0f0f0')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  padding: 4px 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: ${(props) => (props.active ? '#0050a1' : '#e0e0e0')};
  }
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
  border-radius: 30px;
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
  flex-shrink: 0;
`;

const MediumBox = styled(Box)`
  width: 450px;
  height: 120px;
  flex-shrink: 0;
`;

const WideBox = styled(Box)`
  width: 720px;
  height: 120px;
  flex-shrink: 0;
`;

const CameraBox = styled.div`
  width: 250px;
  height: 165px;
  background-image: url(${cameraIcon});
  background-repeat: no-repeat;
  background-position: center 45px;
  background-size: 40%;
  background-color: #ffffff;
  border-radius: 35px;
  box-shadow: 0 6px 12px rgba(0, 120, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
`;


const CameraBoxText = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: bold;
  color: #333;
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

const CameraPopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const CameraPopup = styled.div`
  position: relative;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  width: 80%;
  max-width: 800px;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StreamIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 10px;
`;

const MyHome = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [outdoorTemp, setOutdoorTemp] = useState(null); // 용현동 온도
  const [outdoorHumidity, setOutdoorHumidity] = useState(null); // 용현동 습도
  const [weather, setWeather] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [error, setError] = useState(null);
  const [valveLocked, setValveLocked] = useState(false);
  const [iframeVisible, setIframeVisible] = useState(false);
  const [isFire, setIsFire] = useState(null); 
  const [showWarning, setShowWarning] = useState(false);
  const [username, setUsername] = useState('사용자'); // 초기값 설정
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태 추가
  const [showCameraPopup, setShowCameraPopup] = useState(false); // 카메라 팝업 상태
  const [newsArticles, setNewsArticles] = useState([]);
  const [newsError, setNewsError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity'); // 정렬 기준
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

  const fetchIndoorData = async () => {
    try {
      // 우리집 온도 가져오기
      const tempResponse = await axios.get('http://172.20.10.8/temp', { responseType: 'text' });
      const tempMatch = tempResponse.data.match(/온도:\s*([\d.]+)\s*ºC/);
      if (tempMatch) {
        setTemperature(tempMatch[1]);
      }

      // 우리집 습도 가져오기
      const humiResponse = await axios.get('http://172.20.10.8/humi', { responseType: 'text' });
      const humiMatch = humiResponse.data.match(/습도:\s*([\d.]+)%/);
      if (humiMatch) {
        setHumidity(humiMatch[1]);
      }
    } catch (err) {
      console.error('우리집 데이터를 가져오는 중 오류가 발생했습니다:', err);
    }
  };

  //외부 날씨 불러오기
  const fetchOutdoorData = async () => {
    try {
      const latitude = 37.450354677762;
      const longitude = 126.65915614333;

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
      );

      setOutdoorTemp(response.data.main.temp);
      setOutdoorHumidity(response.data.main.humidity);
      setWeather(response.data.weather[0].description);
      setIconUrl(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    } catch (err) {
      console.error('용현동 날씨 데이터를 가져오는 중 오류가 발생했습니다:', err);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=보일러 화재+OR+아파트화재+OR+주택화재+OR+화재&language=ko&sortBy=${sortBy}&pageSize=6&apiKey=6df649f3a5864991a290a934c04e8206`
      );
      setNewsArticles(response.data.articles);
      setNewsError(null);
    } catch (error) {
      console.error('뉴스 데이터를 가져오는 중 오류가 발생했습니다:', error);
      setNewsError('뉴스 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchNews();
  }, [sortBy]); // 정렬 기준이 변경될 때마다 호출

  const handleFireAlert = () => {
    setTimeout(() => {
      setShowWarning(true); 
    }, 200);
  };

  const handlePopupConfirm = () => {
    setShowPopup(false);
    navigate('/login');
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

  useEffect(() => {
    // 1초마다 데이터 갱신
    const interval = setInterval(() => {
      fetchIndoorData();
      fetchOutdoorData();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const refreshWeather = () => {
    window.location.reload();
  };

  const toggleValveLock = () => {
    setValveLocked(!valveLocked);
    setIframeVisible(!valveLocked);
  };

  const toggleCameraPopup = () => {
    setShowCameraPopup(!showCameraPopup);
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
          padding: '40px 50px',
          width: '400px',
          borderRadius: '15px',
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '22px',
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
          padding: '8px 16px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        확인
      </button>
      </div>
    </div>
  )}
    <MainContent>
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
                <InfoItem>💧 {outdoorHumidity !== null ? `${outdoorHumidity}%` : '-'}</InfoItem>
                <InfoItem>🌡️ {outdoorTemp !== null ? `${outdoorTemp}°C` : '-'}</InfoItem>
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
            {humidity !== null && temperature !== null
              ? `${humidity}% / ${temperature}°C`
              : '데이터 로딩 중...'}
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
          <CameraBox onClick={toggleCameraPopup}>
            <CameraBoxText>집 상황 보기</CameraBoxText>
          </CameraBox>
        </Row>

        {iframeVisible && (
          <iframe src="http://172.20.10.8/servo1" style={{ display: 'none', width: '0', height: '0', border: 'none' }} title="Servo Control"></iframe>
        )}

        {/* 카메라 팝업 */}
        {showCameraPopup && (
          <CameraPopupOverlay>
            <CameraPopup>
              <CloseButton onClick={toggleCameraPopup}>✖</CloseButton>
              <StreamIframe
                src="http://172.20.10.10/stream"
                title="Camera Stream"
                allowFullScreen
              />
            </CameraPopup>
          </CameraPopupOverlay>
        )}
        </Wrapper>
        <RightPanel>
          <NewsHeader>
            <NewsTitleHeader>화재 관련 뉴스</NewsTitleHeader>
            <ButtonsContainer>
              <Button active={sortBy === 'publishedAt'} onClick={() => setSortBy('publishedAt')}>
                최신순
              </Button>
              <Button active={sortBy === 'popularity'} onClick={() => setSortBy('popularity')}>
                인기순
              </Button>
            </ButtonsContainer>
          </NewsHeader>
          {newsError ? (
            <p>{newsError}</p>
          ) : (
            <NewsList>
              {newsArticles.map((article, index) => (
                <NewsItem key={index}>
                  <NewsImage
                    src={article.urlToImage || 'https://via.placeholder.com/80'} // 기본 이미지 설정
                    alt={article.title}
                  />
                  <NewsContent>
                    <NewsTitle href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </NewsTitle>
                    <NewsDescription>
                      {article.description || '요약된 내용이 없습니다.'}
                    </NewsDescription>
                    <NewsDate>{new Date(article.publishedAt).toLocaleString()}</NewsDate>
                  </NewsContent>
                </NewsItem>
              ))}
            </NewsList>
          )}
        </RightPanel>
      </MainContent>
    </Container>
  );
};

export default MyHome;