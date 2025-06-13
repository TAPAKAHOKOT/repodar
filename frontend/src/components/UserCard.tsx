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

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const UserName = styled.div`
  font-weight: bold;
`;

const LocationText = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Card>
      <Avatar src={user.avatar_url} alt={user.login} />
      <div>
        <UserName>{user.login}</UserName>
        {user.location && <LocationText>📍 {user.location}</LocationText>}
      </div>
    </Card>
  );
};

export default UserCard;
