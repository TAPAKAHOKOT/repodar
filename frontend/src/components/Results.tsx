import React from 'react';
import styled from 'styled-components';
import UserCard from './UserCard';
import RepoCard from './RepoCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

interface ResultsProps {
  items: any[];
  searchType: 'user' | 'repo';
}

const Results: React.FC<ResultsProps> = ({ items, searchType }) => {
  return (
    <Grid>
      {items && items.map((item) =>
        searchType === 'user' ? (
          <UserCard key={item.id} user={item} />
        ) : (
          <RepoCard key={item.id} repo={item} />
        )
      )}
    </Grid>
  );
};

export default Results;
