import os
import requests

# Optional GitHub personal access token to increase rate limits.
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN', None)

def search_github(query, search_type):
    """Call GitHub Search API for users or repositories."""
    if search_type not in ['user', 'repo']:
        raise ValueError("Invalid search type. Must be 'user' or 'repo'.")
    endpoint = 'users' if search_type == 'user' else 'repositories'
    url = f'https://api.github.com/search/{endpoint}'
    headers = {'Accept': 'application/vnd.github.v3+json'}
    if GITHUB_TOKEN:
        headers['Authorization'] = f'token {GITHUB_TOKEN}'
    try:
        resp = requests.get(url, params={'q': query}, headers=headers, timeout=5)
    except requests.RequestException as e:
        # Network-level or connection error
        raise RuntimeError(f"Failed to connect to GitHub API: {e}")
    if resp.status_code != 200:
        # If the response is not OK, attempt to extract error message
        try:
            error_msg = resp.json().get('message', '')
        except ValueError:
            error_msg = resp.text or 'Unknown error'
        raise RuntimeError(f"GitHub API error {resp.status_code}: {error_msg}")
    data = resp.json()
    items = data.get('items', [])
    # If searching for users, fetch each user's detail to get location
    if search_type == 'user':
        for item in items:
            username = item.get('login')
            if username:
                try:
                    user_resp = requests.get(f"https://api.github.com/users/{username}", headers=headers, timeout=5)
                    if user_resp.status_code == 200:
                        user_data = user_resp.json()
                        item['location'] = user_data.get('location')
                except requests.RequestException:
                    continue
    return items
