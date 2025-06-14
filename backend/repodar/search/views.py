from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SearchRequestSerializer
from .utils import search_github
from drf_yasg.utils import swagger_auto_schema

class SearchView(APIView):
    """Search GitHub users or repositories (with caching and pagination)."""
    @swagger_auto_schema(request_body=SearchRequestSerializer, responses={200: 'Success'})
    def post(self, request):
        serializer = SearchRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        query = serializer.validated_data['query']
        search_type = serializer.validated_data['type']
        page = serializer.validated_data.get('page', 1)
        
        # Включаем page в ключ кэша для раздельного кэширования страниц
        cache_key = f"search:{search_type}:{query}:page:{page}"
        cached = cache.get(cache_key)
        if cached is not None:
            # Return cached results
            return Response(cached, status=status.HTTP_200_OK)
        
        # Not in cache, perform GitHub API search
        try:
            results = search_github(query, search_type, page=page)
        except Exception as e:
            # Return error message from GitHub or networking
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        
        # Cache the results for 2 hours
        cache.set(cache_key, results, timeout=7200)
        return Response(results, status=status.HTTP_200_OK)

class ClearCacheView(APIView):
    """Clear the search results cache."""
    @swagger_auto_schema(request_body=None, responses={200: 'Cache cleared'})
    def post(self, request):
        cache.clear()
        return Response({"message": "Cache cleared."}, status=status.HTTP_200_OK)
