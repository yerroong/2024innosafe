import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const API_KEY = '6df649f3a5864991a290a934c04e8206'; // 제공된 API 키

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between; /* 버튼과 제목 양쪽 정렬 */
  align-items: center;
  width: 100%; /* 부모 너비에 맞춤 */
  max-width: 100%; /* 잘림 방지 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
`;

const Title = styled.h1`
  font-size: 18px; /* 글자 크기 축소 */
  color: #333;
  white-space: nowrap; /* 한 줄로 제한 */
  overflow: hidden; /* 넘치는 텍스트 숨김 */
  text-overflow: ellipsis; /* ... 처리 */
`;


const ButtonsContainer = styled.div`
  display: flex;
  gap: 5px; /* 버튼 간 간격 */
  flex-shrink: 0; /* 버튼 크기 유지 */
`;

const Button = styled.button`
  background-color: ${(props) => (props.active ? '#0073e6' : '#f0f0f0')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  padding: 6px 12px; /* 버튼 크기 작게 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px; /* 텍스트 크기 작게 */

  &:hover {
    background-color: ${(props) => (props.active ? '#005bb5' : '#e0e0e0')};
  }
`;

const NewsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%; /* 부모 박스에 맞춤 */
`;

const NewsItem = styled.li`
  margin-bottom: 15px; /* 항목 간 간격 조정 */
  padding: 10px; /* 내부 패딩 조정 */
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  display: flex;
  gap: 10px; /* 이미지와 내용 간 간격 축소 */
  width: 90%; /* 부모 너비에 맞게 축소 */
  align-items: center;
`;

const NewsImage = styled.img`
  width: 80px; /* 기존보다 작게 조정 */
  height: 80px; /* 정사각형 유지 */
  object-fit: cover;
  border-radius: 5px;
`;

const NewsContent = styled.div`
  flex: 1;
`;

const NewsTitle = styled.a`
  font-size: 14px; /* 글자 크기 축소 */
  font-weight: bold;
  color: #0073e6;
  text-decoration: none;
  white-space: nowrap; /* 한 줄로 제한 */
  overflow: hidden; /* 넘치는 텍스트 숨김 */
  text-overflow: ellipsis; /* ... 처리 */
  max-width: 200px; /* 제목 길이 제한 */
`;


const NewsDescription = styled.p`
  font-size: 12px; /* 설명 글자 크기 축소 */
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 두 줄까지만 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* 설명 길이 제한 */
`;

const NewsDate = styled.p`
  font-size: 12px;
  color: #888;
`;

function News() {
  const [articles, setArticles] = useState([]); // 뉴스 기사를 저장할 상태
  const [error, setError] = useState(null); // 오류 상태
  const [sortBy, setSortBy] = useState('popularity'); // 정렬 기준 (기본값: 인기순)

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=보일러 화재+OR+아파트화재+OR+주택화재+OR+화재&language=ko&sortBy=${sortBy}&pageSize=5&apiKey=${API_KEY}`
      );

      setArticles(response.data.articles);
      setError(null);
    } catch (err) {
      console.error('뉴스 데이터를 가져오는 중 오류가 발생했습니다:', err);
      setError('뉴스 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchNews();
  }, [sortBy]); // 정렬 기준이 변경될 때마다 호출

  return (
    <Container>
      <Header>
        <Title>화재 관련 뉴스</Title>
        <ButtonsContainer>
          <Button active={sortBy === 'publishedAt'} onClick={() => setSortBy('publishedAt')}>
            최신순
          </Button>
          <Button active={sortBy === 'popularity'} onClick={() => setSortBy('popularity')}>
            인기순
          </Button>
        </ButtonsContainer>
      </Header>
      {error ? (
        <p>{error}</p>
      ) : (
        <NewsList>
          {articles.map((article, index) => (
            <NewsItem key={index}>
              <NewsImage
                src={article.urlToImage || 'https://via.placeholder.com/100'} // 기본 이미지 설정
                alt={article.title}
              />
              <NewsContent>
                <NewsTitle href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </NewsTitle>
                <NewsDescription>{article.description || '요약된 내용이 없습니다.'}</NewsDescription>
                <NewsDate>{new Date(article.publishedAt).toLocaleString()}</NewsDate>
              </NewsContent>
            </NewsItem>
          ))}
        </NewsList>
      )}
    </Container>
  );
}

export default News;
