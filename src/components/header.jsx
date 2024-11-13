import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import LogoImage from "../img/logo.png";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  background-color: var(--preset--color--base);
  z-index: 1000;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 50px;
    margin-left: 120px;
    margin-top: 20px;
    margin-bottom: 10px;
    cursor: pointer;
  }
`;

const Navigation = styled.nav`
  font-family: 'Notosans';
  font-weight: 100%;
  margin-right: 120px;
  margin-top: 20px;

  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    color: #a0a0a0;
  }

  li {
    width: 80px;
    text-align: center;
    border-right: 1px solid var(--preset--color--contrast);
    font-size: 16px;

    &:last-child {
      border-right: unset;
    }
  }

  a {
    text-decoration: none;
    color: var(--preset--color--contrast);
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      color: #343434;
    }
  }
`;

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('access_token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    navigate('/'); // 로그아웃 후 홈 페이지로 이동
  };

  return (
    <HeaderContainer className={path || "main"}>
      <Logo>
        <Link to="/">
          <img src={LogoImage} alt="Logo" />
        </Link>
      </Logo>
      <Navigation>
        <ul>
          <li>
            <Link to="/" className={path === "/" ? "active" : ""}>
              홈
            </Link>
          </li>
          |
          <li style={{ paddingRight: '10px' }}>
            {token ? (
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                로그아웃
              </button>
            ) : (
              <Link to="/login" className={location.pathname.startsWith('/login') ? "active" : ""}>
                로그인
              </Link>
            )}
          </li>
          |
          <li style={{ paddingLeft: '15px' }}>
            <Link to="/myhome" className={location.pathname.startsWith('/myhome') ? "active" : ""}>
              우리집보기
            </Link>
          </li>
        </ul>
      </Navigation>
    </HeaderContainer>
  );
};

export default Header;
