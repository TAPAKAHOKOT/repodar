import React from 'react';
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

const ResultItem = styled.div`
  animation: fadeInUp 0.2s ease-out;
  animation-fill-mode: both;
  width: 100%;
  min-width: 0;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
  &:nth-child(6) { animation-delay: 0.6s; }
  &:nth-child(n+7) { animation-delay: 0.7s; }
  
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
`;

interface ResultsProps {
  items: any[];
  searchType: 'user' | 'repo';
}

const Results: React.FC<ResultsProps> = ({ items, searchType }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ResultsContainer>
      <Grid>
        {items.map((item, index) => (
          <ResultItem key={item.id || index}>
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
