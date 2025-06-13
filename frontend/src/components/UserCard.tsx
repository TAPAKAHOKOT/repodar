import React from 'react';
import styled from 'styled-components';

interface User {
  login: string;
  avatar_url: string;
  location?: string | null;
}

interface UserCardProps {
  user: User;
}

const CardLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  position: relative;
  width: 100%;
  min-height: 80px;
  max-height: 120px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  
  /* Минимальная оптимизация */
  backface-visibility: hidden;

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
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  }
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: border-color 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  
  ${Card}:hover & {
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const UserInfo = styled.div`
  flex: 1;
  color: #2d3748;
  min-width: 0;
  overflow: hidden;
`;

const UserName = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  color: #1a202c;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LocationText = styled.div`
  font-size: 0.9rem;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const GitHubIcon = styled.div`
  margin-left: auto;
  opacity: 0.6;
  transition: opacity 0.3s ease;
  color: #4a5568;
  
  ${Card}:hover & {
    opacity: 0.8;
  }
`;

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const profileUrl = `https://github.com/${user.login}`;
  
  return (
    <CardLink href={profileUrl} target="_blank" rel="noopener noreferrer">
      <Card>
        <Avatar src={user.avatar_url} alt={user.login} />
        <UserInfo>
          <UserName>@{user.login}</UserName>
          {user.location && (
            <LocationText>
              <span>📍</span> {user.location}
            </LocationText>
          )}
        </UserInfo>
        <GitHubIcon>
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
        </GitHubIcon>
      </Card>
    </CardLink>
  );
};

export default UserCard;
