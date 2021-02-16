# Facebook crawling with Python

> Demo: https://www.youtube.com/watch?v=Fx0UWOzYsig

## Features:

-   Get information of posts
-   Filter comments
-   Not required sign in
-   Use proxies to prevent from banning

## Data Fields:

```json
[
    {
        "url": "",
        "id": "",
        "utime": "",
        "text": "",
        "total_shares": "",
        "total_cmts": "",
        "reactions": ["reactions displayed below post content"],
        "crawled_cmts": [
            {
                "id": "",
                "utime": "",
                "user_url": "",
                "user_id": "",
                "user_name": "",
                "text": "",
                "replies": [
                    {
                        "id": "",
                        "utime": "",
                        "user_id": "",
                        "user_name": "",
                        "text": ""
                    }
                ]
            }
        ]
    }
]
```

## Usage:

1. Download and install [Tor Browser](https://www.torproject.org/download/)
2. Install [Helium](https://github.com/mherrmann/selenium-python-helium): `pip install helium`
3. Customize the `crawler.py` file:
    - **TOR_PATH**: specify path of `tor.exe` if using proxies, leave empty if not
    - **BROWSER_OPTIONS**: run scripts using `CHROME` / `FIREFOX`
    - **PAGE_URL**: url of Facebook page
    - **SCROLL_DOWN**: number of scroll times for loading more posts
    - **FILTER_CMTS_BY**: show comments by `MOST_RELEVANT` / `NEWEST` / `ALL_COMMENTS`
    - **VIEW_MORE_CMTS**: number of times for loading more comments
    - **VIEW_MORE_REPLIES**: number of times for loading more replies
4. Start crawling:
    - Sign out Facebook (cause some CSS Selectors will be different as sign in)
    - Run `python crawler.py`

**Note**: With some proxies, Facebook will require to sign in. In that case, just rerun the scripts

## Test Proxy Server:

```python
from browser import *

browser_options = BROWSER_OPTIONS.FIREFOX
tor_path = r"C:\Users\User Name\Tor Browser\Browser\TorBrowser\Tor\tor.exe" # path of tor.exe
url = 'http://check.torproject.org'

setup_proxy_server(browser_options, tor_path, url)
# kill_browser()
```

![](https://github.com/18520339/facebook-crawling/blob/master/test_proxy.png?raw=true)
