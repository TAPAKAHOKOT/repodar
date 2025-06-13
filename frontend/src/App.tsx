import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import SearchBar from './components/SearchBar';
import Results from './components/Results';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const Message = styled.p`
  font-size: 1rem;
`;

const ErrorText = styled.p`
  color: red;
  font-weight: bold;
`;

function App() {
  const [query, setQuery] = useState<string>('');
  const [type, setType] = useState<'user' | 'repo'>('user');
  const [results, setResults] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Refs to track latest query/type for comparison in async calls
  const latestQuery = useRef<string>(query);
  const latestType = useRef<string>(type);
  // Ref to store current fetch AbortController
  const controllerRef = useRef<AbortController | null>(null);

  // Debounced search function
  const searchDebounced = useRef(
    debounce((q: string, t: string) => {
      // Abort any ongoing fetch for previous query
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      setLoading(true);
      fetch('http://localhost:8000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, type: t }),
        signal: controllerRef.current.signal
      })
        .then(response => {
          if (!response.ok) {
            // Try to get error message from response
            return response.json().then(errData => {
              const errMsg = errData.error || `Error ${response.status}`;
              throw new Error(errMsg);
            });
          }
          return response.json();
        })
        .then(data => {
          if (q === latestQuery.current && t === latestType.current) {
            setResults(data);
            setError(null);
            setLoading(false);
          }
        })
        .catch(err => {
          if (err.name === 'AbortError') {
            // Request was aborted (do nothing)
            return;
          }
          if (q === latestQuery.current && t === latestType.current) {
            setError(err.message || 'Failed to fetch results.');
            setResults([]);
            setLoading(false);
          }
        });
    }, 300)
  ).current;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      searchDebounced.cancel();
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [searchDebounced]);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    latestQuery.current = newQuery;
    setError(null);
    if (newQuery.length < 3) {
      // If query too short, cancel any pending/ongoing search
      searchDebounced.cancel();
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
      setLoading(false);
      setResults([]);
      return;
    }
    // Trigger debounced search for valid query length
    searchDebounced(newQuery, type);
  };

  const handleTypeChange = (newType: 'user' | 'repo') => {
    setType(newType);
    latestType.current = newType;
    setError(null);
    if (query.length < 3) {
      // If current query is not long enough, do nothing
      return;
    }
    // Cancel any pending search and abort ongoing request
    searchDebounced.cancel();
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    // Perform immediate search with new type
    // (Reuse the debounced function without delay by calling performSearch directly)
    // We can call the debounced function and then flush immediately, but simpler is to just call searchDebounced without delay
    controllerRef.current = new AbortController();
    setLoading(true);
    fetch('http://localhost:8000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query, type: newType }),
      signal: controllerRef.current.signal
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
            const errMsg = errData.error || `Error ${response.status}`;
            throw new Error(errMsg);
          });
        }
        return response.json();
      })
      .then(data => {
        if (query === latestQuery.current && newType === latestType.current) {
          setResults(data);
          setError(null);
        }
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          return;
        }
        if (query === latestQuery.current && newType === latestType.current) {
          setError(err.message || 'Failed to fetch results.');
          setResults([]);
        }
        setLoading(false);
      });
  };

  return (
    <Container>
      <h1>GitHub Search</h1>
      <SearchBar query={query} type={type} onQueryChange={handleQueryChange} onTypeChange={handleTypeChange} />
      {error && <ErrorText>Error: {error}</ErrorText>}
      {!error && query.length < 3 && (
        <Message>Enter at least 3 characters to search.</Message>
      )}
      {!error && query.length >= 3 && !loading && results.length === 0 && (
        <Message>No results found for "{query}".</Message>
      )}
      {loading && <Message>Loading results...</Message>}
      <Results items={results} searchType={type} />
    </Container>
  );
}

export default App;
