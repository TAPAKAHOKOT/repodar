from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APITestCase
from unittest.mock import patch

@override_settings(CACHES={'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}})
class SearchAPITest(APITestCase):
    def setUp(self):
        # Ensure cache is clear before each test
        cache.clear()

    def test_search_caching(self):
        dummy_results = [{"login": "testuser", "id": 1, "avatar_url": "http://example.com/avatar.png"}]
        with patch('ghsearch.search.utils.search_github', return_value=dummy_results) as mock_search:
            # First call - should call search_github and return results
            response = self.client.post('/api/search', {"query": "testquery", "type": "user"}, format='json')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json(), dummy_results)
            mock_search.assert_called_once()
            # Second call with same parameters - should use cache (no new calls)
            response2 = self.client.post('/api/search', {"query": "testquery", "type": "user"}, format='json')
            self.assertEqual(response2.status_code, 200)
            self.assertEqual(response2.json(), dummy_results)
            self.assertEqual(mock_search.call_count, 1)

    def test_clear_cache(self):
        dummy_results = [{"login": "abc", "id": 2, "avatar_url": "http://example.com/avatar2.png"}]
        with patch('ghsearch.search.utils.search_github', return_value=dummy_results) as mock_search:
            # Initial search to populate cache
            response1 = self.client.post('/api/search', {"query": "abc", "type": "user"}, format='json')
            self.assertEqual(response1.status_code, 200)
            self.assertEqual(mock_search.call_count, 1)
            # Clear the cache
            response_clear = self.client.post('/api/clear-cache', format='json')
            self.assertEqual(response_clear.status_code, 200)
            # Search again after clearing cache - should call search_github again
            response2 = self.client.post('/api/search', {"query": "abc", "type": "user"}, format='json')
            self.assertEqual(response2.status_code, 200)
            self.assertEqual(mock_search.call_count, 2)

    def test_query_too_short(self):
        with patch('ghsearch.search.utils.search_github') as mock_search:
            response = self.client.post('/api/search', {"query": "ab", "type": "user"}, format='json')
            # Expect a 400 Bad Request for too short query
            self.assertEqual(response.status_code, 400)
            mock_search.assert_not_called()
