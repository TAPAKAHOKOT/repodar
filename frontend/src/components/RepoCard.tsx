import React from 'react';
import styled from 'styled-components';

interface RepoOwner {
  login: string;
  avatar_url: string;
}

interface Repo {
  id?: number;
  full_name: string;
  stargazers_count: number;
  description?: string | null;
  language?: string | null;
  owner: RepoOwner;
}

interface RepoCardProps {
  repo: Repo;
}

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.75rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const RepoName = styled.div`
  font-weight: bold;
`;

const RepoDescription = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin: 0.25rem 0;
`;

const RepoMeta = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  return (
    <Card>
      <Avatar src={repo.owner.avatar_url} alt={repo.owner.login} />
      <div>
        <RepoName>{repo.full_name}</RepoName>
        {repo.description && <RepoDescription>{repo.description}</RepoDescription>}
        <RepoMeta>
          ★ {repo.stargazers_count}
          {repo.language && ` | ${repo.language}`}
        </RepoMeta>
      </div>
    </Card>
  );
};

export default RepoCard;
