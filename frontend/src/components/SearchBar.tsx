import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 28px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
    pointer-events: none;
  }
`;

const Form = styled.div`
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  color: #2d3748;
  font-weight: 500;
  
  &::placeholder {
    color: #4a5568;
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const SelectInput = styled.select`
  padding: 1rem 2rem 1rem 1.5rem;
  font-size: 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  color: #2d3748;
  cursor: pointer;
  appearance: none;
  min-width: 140px;
  font-weight: 500;
  width: 100%;
  
  @media (max-width: 768px) {
    min-width: 160px;
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SelectIcon = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  z-index: 2;
`;

interface SearchBarProps {
  query: string;
  type: 'user' | 'repo';
  onQueryChange: (query: string) => void;
  onTypeChange: (type: 'user' | 'repo') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, type, onQueryChange, onTypeChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(e.target.value as 'user' | 'repo');
  };

  return (
    <Container>
      <Form>
        <InputWrapper>
          <SearchIcon>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </SearchIcon>
          <TextInput
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={type === 'user' ? 'Поиск пользователей GitHub...' : 'Поиск репозиториев GitHub...'}
            style={{ paddingLeft: '3rem' }}
          />
        </InputWrapper>
        <SelectWrapper>
          <SelectInput value={type} onChange={handleTypeChange}>
            <option value="user">Пользователи</option>
            <option value="repo">Репозитории</option>
          </SelectInput>
          <SelectIcon>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </SelectIcon>
        </SelectWrapper>
      </Form>
    </Container>
  );
};

export default SearchBar;
