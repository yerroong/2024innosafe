import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/header';

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
  margin-top: 50px;
  flex-direction: column;
`;

const InfoBox = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 500px;
  text-align: center;
`;

const WarningText = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: red;
  color: white;
  font-size: 18px;
  border-radius: 5px;
  display: ${(props) => (props.show ? 'block' : 'none')};
  text-align: center;
`;

const StatusText = styled.div`
  font-size: 18px;
  color: ${(props) => (props.success ? 'green' : 'red')};
  font-weight: bold;
  margin-top: 10px;
`;

const SliderContainer = styled.div`
  margin-top: 30px;
`;

const SliderLabel = styled.label`
  font-size: 18px;
  margin-right: 10px;
  color: #333;
`;

const Slider = styled.input`
  width: 60px;
  height: 30px;
  -webkit-appearance: none;
  appearance: none;
  background-color: ${(props) => (props.checked ? '#4caf50' : '#ddd')};
  border-radius: 15px;
  position: relative;
  outline: none;
  transition: 0.4s;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 100%;
    background: transparent;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #4caf50;
    transition: 0.2s;
  }

  &:checked::-webkit-slider-thumb {
    background: #2196F3;
  }
`;

const ValveStatusText = styled.div`
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => (props.valveLocked ? 'green' : 'red')};
`;

const MyHome = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [flameDetected, setFlameDetected] = useState(false);
  const [gasLeakDetected, setGasLeakDetected] = useState(false);
  const [valveLocked, setValveLocked] = useState(false);
  const [iframeVisible, setIframeVisible] = useState(false);

  const fetchTemperature = async () => {
    try {
        const response = await fetch('http://172.20.10.8/temp', {
            mode: 'no-cors'
          });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const htmlText = await response.text();  // HTML을 텍스트로 받아옴
      console.log("HTML 응답:", htmlText);  // HTML 응답 내용 확인을 위해 추가
  
      const temperatureMatch = htmlText.match(/온도:\s*([\d.]+)\s*[º°]C/);  // 온도 추출
  
      if (temperatureMatch) {
        setTemperature(parseFloat(temperatureMatch[1]));
        console.log("추출된 온도 값:", temperatureMatch[1]);  // 추출된 온도 값 확인
      } else {
        console.log("온도 정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("온도를 가져오는 데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchTemperature();  // 온도 값을 불러옴
    setHumidity(60);     // 예시로 60% 설정
  }, []);

  useEffect(() => {
    fetchTemperature();  // 온도 값을 불러옴
    setHumidity(60);     // 예시로 60% 설정
  }, []);

  // 불꽃 감지 상태 예시
  useEffect(() => {
    setFlameDetected(false); // 불꽃이 감지되지 않음
    setGasLeakDetected(false); // 가스 누수 감지되지 않음
  }, []);

  // 밸브 잠금 상태 변경
  const toggleValveLock = () => {
    setValveLocked(!valveLocked);
    if (!valveLocked) {
      setIframeVisible(true);
      console.log('모터 작동');
    } else {
      setIframeVisible(false);
      console.log('모터 정지');
    }
  };

  return (
    <Container>
      <Header />
      <Wrapper>
        <InfoBox>
          <h2>우리집 상태</h2>
          <StatusText success={temperature < 30}>온도: {temperature}°C</StatusText>
          <StatusText success={humidity < 70}>습도: {humidity}%</StatusText>
        </InfoBox>

        <WarningText show={flameDetected}>
          불꽃이 감지되었습니다! 위험!
        </WarningText>
        <StatusText success={flameDetected === false}>
          불꽃이 감지되지 않았습니다.
        </StatusText>

        <WarningText show={gasLeakDetected}>
          가스 누수가 감지되었습니다! 위험!
        </WarningText>
        <StatusText success={gasLeakDetected === false}>
          가스 누수가 감지되지 않았습니다.
        </StatusText>

        <SliderContainer>
          <SliderLabel>밸브 잠금:</SliderLabel>
          <Slider
            type="checkbox"
            checked={valveLocked}
            onChange={toggleValveLock}
            style={{
              backgroundColor: valveLocked ? '#4caf50' : '#ddd',
            }}
          />
        </SliderContainer>
        <ValveStatusText valveLocked={valveLocked}>
          {valveLocked ? '밸브 잠금됨' : '밸브 해제됨'}
        </ValveStatusText>

        {iframeVisible && (
          <iframe
            src="http://172.20.10.8/servo1"
            style={{
              display: 'none',
              width: '0',
              height: '0',
              border: 'none',
            }}
            title="Servo Control"
          ></iframe>
        )}
      </Wrapper>
    </Container>
  );
};

export default MyHome;
