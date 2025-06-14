import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import debounce from 'lodash/debounce';
import SearchBar from './components/SearchBar';
import Results from './components/Results';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #000000;
    min-height: 100vh;
    color: #333;
    overflow-x: hidden;
    
    /* Оптимизации для прокрутки без блокировки Vanta.js */
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
  
  #root {
    min-height: 100vh;
    /* Убираем containment чтобы не блокировать Vanta.js */
  }
  
  /* Оптимизации только для изображений */
  img {
    max-width: 100%;
    height: auto;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
`;

const AppWrapper = styled.div`
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  overflow-y: auto;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MessageCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 2rem;
  text-align: center;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  margin: 2rem 0;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #2d3748;
  line-height: 1.6;
  font-weight: 500;
`;

const ErrorCard = styled(MessageCard)`
  background: rgba(255, 107, 107, 0.15);
  border: 1px solid rgba(255, 107, 107, 0.3);
  
  &:hover {
    background: rgba(255, 107, 107, 0.2);
  }
`;

const ErrorText = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #c53030;
`;

const LoadingCard = styled(MessageCard)`
  background: rgba(78, 205, 196, 0.15);
  border: 1px solid rgba(78, 205, 196, 0.3);
  
  &:hover {
    background: rgba(78, 205, 196, 0.2);
  }
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadMoreCard = styled(LoadingCard)`
  margin-top: 1rem;
  padding: 1rem;
`;

const LoadMoreText = styled(LoadingText)`
  font-size: 1rem;
`;

function App() {
  // API URL from environment variables
  const API_URL = ((window as any).ENV?.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000') + '/api';
  const [query, setQuery] = useState<string>('');
  const [type, setType] = useState<'user' | 'repo'>('user');
  const [results, setResults] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // Refs to track latest query/type for comparison in async calls
  const latestQuery = useRef<string>(query);
  const latestType = useRef<string>(type);
  // Ref to store current fetch AbortController
  const controllerRef = useRef<AbortController | null>(null);
  // Отдельный AbortController для загрузки следующих страниц
  const loadMoreControllerRef = useRef<AbortController | null>(null);
  
  // Ref for Vanta.js background element
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  
  // Initialize Vanta.js effect
  useEffect(() => {
    if (vantaRef.current && window.VANTA) {
      vantaEffect.current = window.VANTA.FOG({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: window.innerHeight,
        minWidth: window.innerWidth,
        highlightColor: 0xffc300,
        midtoneColor: 0xff1f00,
        lowlightColor: 0x2d00ff,
        baseColor: 0xffebeb,
        blurFactor: 0.6,
        speed: 1,
        zoom: 0.7
      });
    }
    
    // Handle window resize only
    const handleResize = () => {
      if (vantaEffect.current && vantaEffect.current.resize) {
        vantaEffect.current.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Infinite scroll handler с оптимизированными зависимостями
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore || query.length < 3) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Загружаем следующую страницу когда пользователь прокрутил до 80% от конца
      if (scrollTop + windowHeight >= documentHeight * 0.8) {
        loadNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, query.length]); // Убираем page и type из зависимостей

  // Function to load next page с улучшенным управлением состоянием
  const loadNextPage = () => {
    if (loadingMore || !hasMore) return;
    
    // Отменяем предыдущий запрос загрузки дополнительных страниц если он еще выполняется
    if (loadMoreControllerRef.current) {
      loadMoreControllerRef.current.abort();
    }
    
    setLoadingMore(true);
    const nextPage = page + 1;
    
    loadMoreControllerRef.current = new AbortController();
    fetch(`${API_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query, type: type, page: nextPage }),
      signal: loadMoreControllerRef.current.signal
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
        // Проверяем что запрос еще актуален
        if (query === latestQuery.current && type === latestType.current) {
          setResults(prevResults => [...prevResults, ...data.items]);
          setPage(nextPage);
          setHasMore(data.has_more);
          setError(null);
        }
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          return;
        }
        // Только устанавливаем ошибку если запрос еще актуален
        if (query === latestQuery.current && type === latestType.current) {
          setError(err.message || 'Failed to load more results.');
        }
      })
      .finally(() => {
        // Всегда сбрасываем состояние загрузки
        setLoadingMore(false);
        loadMoreControllerRef.current = null;
      });
  };

  // Debounced search function
  const searchDebounced = useRef(
    debounce((q: string, t: string) => {
      // Abort any ongoing fetch for previous query
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      setLoading(true);
      setPage(1); // Reset to first page for new search
      fetch(`${API_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, type: t, page: 1 }),
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
            setResults(data.items);
            setPage(data.page);
            setHasMore(data.has_more);
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
            setPage(1);
            setHasMore(false);
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
      if (loadMoreControllerRef.current) {
        loadMoreControllerRef.current.abort();
      }
    };
  }, [searchDebounced]);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    latestQuery.current = newQuery;
    setError(null);
    setPage(1);
    setHasMore(false);
    if (newQuery.length < 3) {
      // If query too short, cancel any pending/ongoing search
      searchDebounced.cancel();
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
      // Также отменяем загрузку дополнительных страниц
      if (loadMoreControllerRef.current) {
        loadMoreControllerRef.current.abort();
        loadMoreControllerRef.current = null;
      }
      setLoading(false);
      setLoadingMore(false);
      setResults([]);
      return;
    }
    // Отменяем загрузку дополнительных страниц при новом поиске
    if (loadMoreControllerRef.current) {
      loadMoreControllerRef.current.abort();
      loadMoreControllerRef.current = null;
    }
    setLoadingMore(false);
    // Trigger debounced search for valid query length
    searchDebounced(newQuery, type);
  };

  const handleTypeChange = (newType: 'user' | 'repo') => {
    setType(newType);
    latestType.current = newType;
    setError(null);
    setPage(1);
    setHasMore(false);
    // Clear results when switching type with short query
    setResults([]);
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
    // Также отменяем загрузку дополнительных страниц
    if (loadMoreControllerRef.current) {
      loadMoreControllerRef.current.abort();
      loadMoreControllerRef.current = null;
    }
    setLoadingMore(false);
    // Perform immediate search with new type
    controllerRef.current = new AbortController();
    setLoading(true);
    fetch(`${API_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query, type: newType, page: 1 }),
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
          setResults(data.items);
          setPage(data.page);
          setHasMore(data.has_more);
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
          setPage(1);
          setHasMore(false);
        }
        setLoading(false);
      });
  };

  return (
    <>
      <AppWrapper ref={vantaRef} />
      <ContentWrapper>
        <GlobalStyle />
        <Container>
          <Header>
            <Title>GitHub Search</Title>
            <Subtitle>Найдите пользователей и репозитории GitHub</Subtitle>
          </Header>
          
          <SearchBar 
            query={query} 
            type={type} 
            onQueryChange={handleQueryChange} 
            onTypeChange={handleTypeChange} 
          />
          
          {error && (
            <ErrorCard>
              <ErrorText>Ошибка: {error}</ErrorText>
            </ErrorCard>
          )}
          
          {!error && query.length < 3 && (
            <MessageCard>
              <Message>Введите минимум 3 символа для поиска</Message>
            </MessageCard>
          )}
          
          {!error && query.length >= 3 && !loading && results.length === 0 && (
            <MessageCard>
              <Message>Результаты не найдены для "{query}"</Message>
            </MessageCard>
          )}
          
          {loading && (
            <LoadingCard>
              <LoadingText>
                <LoadingSpinner />
                Загрузка результатов...
              </LoadingText>
            </LoadingCard>
          )}
          
          <Results items={results} searchType={type} />
          
          {loadingMore && (
            <LoadMoreCard>
              <LoadMoreText>
                <LoadingSpinner />
                Загрузка дополнительных результатов...
              </LoadMoreText>
            </LoadMoreCard>
          )}
        </Container>
      </ContentWrapper>
    </>
  );
}

export default App;
