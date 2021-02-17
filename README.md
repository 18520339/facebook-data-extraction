# Facebook Crawling with Python

> Demo: https://www.youtube.com/watch?v=Fx0UWOzYsig

## Features:

-   Get information of posts
-   Filter comments
-   Not required sign in
-   Simplfy browser to minimize time complexity
-   Use proxies to prevent from banning with:
    -   Random proxies from [Free Proxy List](https://free-proxy-list.net/) that are just checked and updated every 10 minutes
    -   [Tor Relays](https://github.com/18520339/facebook-crawling/tree/master/tor) which used in [Tor Browser](https://www.torproject.org/), a network is comprised of thousands of volunteer-run servers

## Usage:

### I. Install library:

> pip install -r requirement.txt

-   [Helium](https://github.com/mherrmann/selenium-python-helium): a wrapper around [Selenium](https://selenium-python.readthedocs.io/) with more high-level API for web automation
-   [HTTP Request Randomizer](https://github.com/pgaref/HTTP_Request_Randomizer): used for getting proxies from [Free Proxy List](https://free-proxy-list.net/)

### II. Customize parameters in crawler.py:

1.  **Running Browser**:

    -   **PAGE_URL**: url of Facebook page
    -   **TOR_PATH**: use proxy with Tor with `WINDOWS` / `MAC` / `LINUX` / `NONE`:
    -   **BROWSER_OPTIONS**: run scripts using `CHROME` / `FIREFOX`

    -   **USE_PROXY**: run with proxy or not. If **True** &rarr; Check:
        -   IF **TOR_PATH** $\neq$ `NONE` &rarr; Use Tor's SOCKS proxy server
        -   ELSE &rarr; Get proxies from [Free Proxy List](https://free-proxy-list.net/)
    -   HEADLESS: run with header Browser or not
    -   SPEED_UP: simplify Browser for minizing loading time:

        -   With `CHROME` :

        ```python
            # Prevent Selenium detection => navigator.driver = undefined (check in dev tools)
            browser_options.add_argument("--disable-blink-features=AutomationControlled")

            # Disable loading image, CSS, ...
            browser_options.add_experimental_option('prefs', {
                "profile.managed_default_content_settings.images": 2,
                "profile.managed_default_content_settings.stylesheets": 2,
                "profile.managed_default_content_settings.cookies": 2,
                "profile.managed_default_content_settings.geolocation": 2,
                "profile.managed_default_content_settings.media_stream": 2,
                "profile.managed_default_content_settings.plugins": 1,
                "profile.default_content_setting_values.notifications": 2,
            })
        ```

        -   With `FIREFOX` :

        ```python
            # Disable loading image, CSS, Flash
            browser_options.set_preference('permissions.default.image', 2)
            browser_options.set_preference('permissions.default.stylesheet', 2)
            browser_options.set_preference('dom.ipc.plugins.enabled.libflashplayer.so', 'false')
        ```

2.  **Loading Page**:

    -   **SCROLL_DOWN**: number of scroll times for loading more posts
    -   **FILTER_CMTS_BY**: show comments by `MOST_RELEVANT` / `NEWEST` / `ALL_COMMENTS`
    -   **VIEW_MORE_CMTS**: number of times for loading more comments
    -   **VIEW_MORE_REPLIES**: number of times for loading more replies

### III. Start crawling:

> python crawler.py

-   Sign out Facebook (cause some CSS Selectors will be different as sign in)
-   Note that with some proxies:

    -   It might be quite slow
    -   Facebook will require to sign in

-   Each post will be written line by line when completed. Data Field:

    ```json
    {
        "url": "",
        "id": "",
        "utime": "",
        "text": "",
        "total_shares": "",
        "total_cmts": "",
        "reactions": [""],
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
    ```

## Test Proxy Server:

1. With [Free Proxy List](https://free-proxy-list.net/):

```python
    from browser import *
    page_url = 'http://check.torproject.org'
    request_proxy = RequestProxy()
    browser_options = BROWSER_OPTIONS.FIREFOX

    setup_free_proxy(page_url, request_proxy, browser_options)
    # kill_browser()
```

2. With [Tor Relays](https://github.com/18520339/facebook-crawling/tree/master/tor):

```python
    from browser import *
    page_url = 'http://check.torproject.org'
    tor_path = TOR_PATH.WINDOWS
    browser_options = BROWSER_OPTIONS.FIREFOX

    setup_tor_proxy(page_url, tor_path, browser_options)
    # kill_browser()
```

![](https://github.com/18520339/facebook-crawling/blob/master/test_proxy.png?raw=true)
