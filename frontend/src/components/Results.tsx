import React, { useMemo } from 'react';
import styled from 'styled-components';
import UserCard from './UserCard';
import RepoCard from './RepoCard';

const ResultsContainer = styled.div`
  margin-top: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ResultItem = styled.div<{ delay: number }>`
  animation: fadeInUp 0.3s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => Math.min(props.delay * 0.05, 0.5)}s;
  width: 100%;
  min-width: 0;
  opacity: 0;
  transform: translateY(30px);
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Минимальные оптимизации без блокировки фона */
  will-change: opacity, transform;
`;

interface ResultsProps {
  items: any[];
  searchType: 'user' | 'repo';
}

const Results: React.FC<ResultsProps> = ({ items, searchType }) => {
  // Мемоизируем результаты для предотвращения ненужных перерендеров
  const memoizedItems = useMemo(() => items, [items]);

  if (!memoizedItems || memoizedItems.length === 0) {
    return null;
  }

  // Функция для генерации уникального ключа в зависимости от типа поиска
  const generateKey = (item: any, index: number) => {
    if (searchType === 'user') {
      return `user-${item.id || item.login || index}`;
    } else {
      return `repo-${item.id || item.full_name || index}`;
    }
  };

  return (
    <ResultsContainer>
      <Grid>
        {memoizedItems.map((item, index) => (
          <ResultItem key={generateKey(item, index)} delay={index}>
            {searchType === 'user' ? (
              <UserCard user={item} />
            ) : (
              <RepoCard repo={item} />
            )}
          </ResultItem>
        ))}
      </Grid>
    </ResultsContainer>
  );
};

export default Results;
