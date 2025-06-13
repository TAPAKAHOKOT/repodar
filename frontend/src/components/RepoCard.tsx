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

const CardLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  position: relative;
  min-height: 120px;
  max-height: 200px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%);
    pointer-events: none;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: border-color 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  
  ${Card}:hover & {
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const RepoInfo = styled.div`
  flex: 1;
  color: #2d3748;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  overflow: hidden;
`;

const RepoName = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: #1a202c;
  line-height: 1.2;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RepoDescription = styled.div`
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.4;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-word;
`;

const RepoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: #4a5568;
  margin-top: auto;
`;

const StarCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-weight: 600;
  color: #2d3748;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Language = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-weight: 600;
  color: #2d3748;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const GitHubIcon = styled.div`
  margin-left: auto;
  opacity: 0.6;
  transition: opacity 0.3s ease;
  align-self: flex-start;
  color: #4a5568;
  
  ${Card}:hover & {
    opacity: 0.8;
  }
`;

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const repoUrl = `https://github.com/${repo.full_name}`;
  
  return (
    <CardLink href={repoUrl} target="_blank" rel="noopener noreferrer">
      <Card>
        <Avatar src={repo.owner.avatar_url} alt={repo.owner.login} />
        <RepoInfo>
          <RepoName>{repo.full_name}</RepoName>
          {repo.description && (
            <RepoDescription>{repo.description}</RepoDescription>
          )}
          <RepoMeta>
            <StarCount>
              <span>⭐</span>
              {repo.stargazers_count.toLocaleString()}
            </StarCount>
            {repo.language && (
              <Language>
                <span>💻</span>
                {repo.language}
              </Language>
            )}
          </RepoMeta>
        </RepoInfo>
        <GitHubIcon>
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
        </GitHubIcon>
      </Card>
    </CardLink>
  );
};

export default RepoCard;
