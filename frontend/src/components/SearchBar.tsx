import React from 'react';
import styled from 'styled-components';

const Form = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
`;

const SelectInput = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
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
    // value will be a string 'user' or 'repo'
    onTypeChange(e.target.value as 'user' | 'repo');
  };

  return (
    <Form>
      <TextInput
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={type === 'user' ? 'Search users...' : 'Search repositories...'}
      />
      <SelectInput value={type} onChange={handleTypeChange}>
        <option value="user">User</option>
        <option value="repo">Repository</option>
      </SelectInput>
    </Form>
  );
};

export default SearchBar;
