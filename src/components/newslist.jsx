import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NewsItem from './newsitem.jsx';
import axios from 'axios';

const NewsListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 768px;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const NewsList = () => {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // async 함수 선언
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://newsapi.org/v2/top-headlines?country=kr&apiKey=발급한_API_키'
        );
        setArticles(response.data.articles);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // 로딩 중일 때
  if (loading) {
    return <NewsListBlock>대기중...</NewsListBlock>;
  }

  // 데이터가 아직 없을 때
  if (!articles) {
    return null;
  }

  // 데이터를 렌더링
  return (
    <NewsListBlock>
      {articles.map((article) => (
        <NewsItem key={article.url} article={article} />
      ))}
    </NewsListBlock>
  );
};

export default NewsList;
