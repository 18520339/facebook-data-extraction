import requests
import json
import time
import re


''' For Cookie
1. Go to https://business.facebook.com/business_locations and login (It may require 2FA)
2. Press F12 and go to the Network Panel 
3. Select the first request and copy the Cookie value in the Request Headers
*Note: Don't use document.cookie as this will only extract cookies that are accessible via JavaScript and are not marked as `HttpOnly`
'''
COOKIE = ""

'''Maximum Posts 
- For Page, you can only read a maximum of 100 feed posts with the limit field:
    - If you try to read more than that you will get an error message to not exceed 100.
    - The API will return approximately 600 ranked, published posts per year # https://developers.facebook.com/docs/graph-api/reference/page/feed/#limitations
- For Group, there is no limited number mentioned in the document. As I experimented:
    - For simple query (such as `fields=message`): I can request up to 1850 posts (`LIMIT=1850`) . 
    - For complex query (like the below `fields`): `LIMIT=300` works fine. Larger numbers sometimes work but most of the times are errors.
    - Therefore, I recommend just querying up to 300 posts at a time for Group.
*Note: If the data retrieved is too large, you can receive this error message: "Please reduce the amount of data you're asking for, then retry your request"
'''
LIMIT = 100
MAX_POSTS = 375 # Maximum posts to crawl
   
''' Endpoint for posts in Page and Group
- https://developers.facebook.com/docs/graph-api/reference/page/feed
- https://developers.facebook.com/docs/graph-api/reference/group/feed
- https://developers.facebook.com/docs/graph-api/reference/post
*Note: A User or Page can only query their own reactions. Other Users' or Pages' reactions are unavailable due to privacy concerns.
'''
POST_FIELDS = 'id,parent_id,created_time,permalink_url,full_picture,shares,reactions.summary(total_count),attachments{subattachments.limit(20)},message' 
COMMENT_FIELDS = 'comments.order(chronological).summary(total_count){id,created_time,reactions.summary(total_count),message,comment_count,comments}'

SLEEP = 2 # Waiting time between each request to get {LIMIT} posts
PAGE_OR_GROUP_URL = 'https://www.facebook.com/groups/devoiminhdidauthe'
SESSION = requests.Session()


def get_node_id():
    node_type, node_name = PAGE_OR_GROUP_URL.split('/')[-2:]
    if node_type != 'groups': 
        return node_name # Page doesn't need to have an id as number
    
    id_in_url = re.search('(?<=\/groups\/)(.\d+?)($|(?=\/)|(?=&))', PAGE_OR_GROUP_URL)
    if id_in_url and id_in_url.group(1): 
        return id_in_url.group(1)
    
    print('Getting Group ID ...')
    response = SESSION.get(PAGE_OR_GROUP_URL)
    search_group_id = re.search('(?<=\/group\/\?id=)(.\d+)', response.text)
    
    if search_group_id and search_group_id.group(1): 
        group_id = search_group_id.group(1)
        print(f'Group ID for {node_name} is {group_id} !!')
        return group_id
        
    print('Cannot find any Node ID for', PAGE_OR_GROUP_URL)
    return None
    
    
def get_access_token():
    print('Getting access token ...')
    response = SESSION.get('https://business.facebook.com/business_locations', headers={'cookie': COOKIE})
    
    if response.status_code == 200:
        search_token = re.search('(EAAG\w+)', response.text)
        if search_token and search_token.group(1): 
            return search_token.group(1)
        
    print('Cannot find access token. Maybe your cookie invalid !!')
    return None


def init_params():
    node_id = get_node_id()
    access_token = get_access_token()
    fields = POST_FIELDS + ',' + COMMENT_FIELDS
    endpoint = f'https://graph.facebook.com/v18.0/{node_id}/feed?limit={LIMIT}&fields={fields}&access_token={access_token}'
    return endpoint, access_token


def get_data_and_next_endpoint(endpoint, access_token):
    if access_token is None: return {}, None
    response = SESSION.get(endpoint, headers={'cookie': COOKIE})
    response = json.loads(response.text)

    try: data = response['data']
    except: 
        print('\n', response['error']['message'])
        data = []

    try: 
        next_endpoint = response['paging']['next']
        time.sleep(SLEEP)
    except: 
        print('\n', 'Cannot find next endpoint')
        next_endpoint = None
        
    if not next_endpoint.split('/feed?')[-1].startswith(f'limit={LIMIT}&'): # Group paging doesn't contain limit field
        next_endpoint = next_endpoint.replace('/feed?', f'/feed?limit={LIMIT}&')
    return data, next_endpoint


def remove_paging(obj): # Remove all paging keys to make it concise and safe as the access token is in them
    if isinstance(obj, dict):
        return {k: remove_paging(v) for k, v in obj.items() if k != 'paging'}
    elif isinstance(obj, list):
        return [remove_paging(item) for item in obj]
    return obj


endpoint, access_token = init_params()
file_name, count = PAGE_OR_GROUP_URL.split('/')[-1], 0
print(f'Fetching {MAX_POSTS} posts sorted by RECENT_ACTIVITY from {PAGE_OR_GROUP_URL} ...')

with open(f'{file_name}.jsonl', 'w', encoding='utf-8') as file:
    while endpoint is not None and access_token is not None and count < MAX_POSTS:
        print(f'=> Number of posts now: {count} ...', end='\r', flush=True)
        data, endpoint = get_data_and_next_endpoint(endpoint, access_token)
        posts = [json.dumps(remove_paging(post), ensure_ascii=False) for post in data]
        count += len(posts)
        
        if LIMIT > MAX_POSTS - count: # If the remaining posts are less than LIMIT, then change LIMIT to the remaining number
            endpoint = endpoint.replace(f'/feed?limit={LIMIT}&', f'/feed?limit={MAX_POSTS - count}&')
        file.write('\n'.join(posts) + '\n')
        
    print(f'\n=> Finish fetching {count} posts into {file_name}.jsonl !!')
    SESSION.close()