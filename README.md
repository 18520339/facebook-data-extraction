<div id="top"></div>

---
# Summary of Facebook data extraction methods
---

### I. General Comparison 

| Method                                                       | Sign-in required | Risk when sign-in                          | Risk when not sign-in   | Difficulty | Speed            |
| ------------------------------------------------------------ | :--------------: | :----------------------------------------: | :---------------------: | :--------: | :--------------: |
| 1️⃣ &nbsp;[Personal account Access Token + Graph API](#1)    | ✅               | Access Token leaked, Checkpoint but rarely | Not working             | Easy       | Fast             | 
| 2️⃣ &nbsp;[Automation tools + IP hiding techniques](#2)      | Depend **(\*)**  | Checkpoint but less *loading more* failure | Safest                  | Hard       | Slow **(\**)**   |
| 3️⃣ &nbsp;[Run JS code directly at the DevTools Console](#3) | Depend **(\*)**  | Checkpoint but less *loading more* failure | Can be banned if abused | Medium     | Slow **(\**)**   |
| 4️⃣ &nbsp;[Mbasic Facebook + IP hiding techniques](#4)       | Depend **(\*)**  | -                                          | -                       | -          | -                |

**(\*)** Depend on the tasks that you need to sign in to perform. Example: Tasks that need to access private groups or private posts, ... 
  
**(\**)** Depend on how much data you want to extract, the more the number, the more times for scrolling down to load the contents.

### II. My general conclusion after many tries with different methods

- When run at **not sign-in** state, Facebook usually redirects to the login page or prevent you from loading more comments / replies.
- No matter which method you use, any fast or irregular activity continuously in **sign-in** state for a long time can be likely to get checkpoint at any time. 
- If you want to use at **sign-in** state, for safety, I recommend create a fake account and use it for the extraction.
- With the **sign-in** state, there's also another technique to limit the Checkpoint is to sign in with different **Cookies**.

### III. DISCLAIMER

All information provided in this repo and related articles are for educational purposes only. So use at your own risk, I will not guarantee & not be responsible for any situations including:
- Whether your Facebook account may get Checkpoint due to repeatedly or rapid actions. 
- Problems that may occur or for any abuse of the information or the code provided.
- Problems about your privacy while using [IP hiding techniques](#ii-ip-hiding-techniques) or any malicious scripts.

<div id="1"></div>

# 1️⃣ &nbsp;[Personal account Access Token + Graph API](#top)
    
Use your own Token with **almost full permission** for fetching data. In my opinion, this is the **MOST EFFECTIVE** method.

> Demo: Updating...

## Knowledge

The knowledge of this method I refer from this [Vietnamese blog](https://ahachat.com/help/blog/cach-lay-token-facebook).

### I. Facebook Token types

There are 2 types of Facebook Tokens: Token by App and by Personal Account. The Facebook Token by App is the safest one, as it will have a limited lifetime and only has some basic permissions to manipulate on pages and groups. So our main focus will on the Facebook Token by Personal Account.

### II. Facebook Token by Personal Account

Updating...

## Implement data extraction with Graph API

Updating...

<div id="2"></div>

# 2️⃣ &nbsp;[Automation tools + IP hiding techniques](#top)

In this method, I will write example scripts to extract id, user info, content, date, comments, and replies of posts.

**Note**: These scripts just working for **a Facebook page when not sign-in**, not group or any other object.

> Demo: https://www.youtube.com/watch?v=Fx0UWOzYsig

## Knowledge

### I. Automation tools

Updating...

### II. IP hiding techniques

| Method       | Speed rating | Cost         | Common risk                             | General Evaluation |
| ------------ | :----------: | ------------ | --------------------------------------- | ------------------ |
| VPN service  | `2`          | Usually paid | Some free providers might not be secure | Best way           |
| Tor browser  | `4`          | Free         | Can be tracked by some rogue nodes      | Slowest choice     |
| Proxy server | `3`          | Usually free | Data routing not private as VPNs        | Riskiest method    |
| Public WiFi  | `1`          | Free         | Some might not be safe                  | Long distance way  |

➔ Learn more about general information of above methods from this [site](https://whatismyipaddress.com/hide-ip).

**IMPORTANT**: Nothing above is absolutely safe and secure. *Carefulness is never excessive*. You will need to do further research about them if you want more secure to your data & privacy.

## Overview the scripts

### I. Features

1.  Getting information of posts.
2.  Filtering comments.
3.  Checking redirect.
4.  Can be run with Incognito window.
5.  Simplifying browser to minimize time complexity.
6.  Delay with random intervals every *loading more* times to simulate human behavior.
7.  Not required sign-in to **prevent Checkpoint**.
8.  Hiding IP address to **prevent from banning** by:
    -   Collecting proxies and filtering the slowest ones from:
        -   http://proxyfor.eu/geo.php
        -   http://free-proxy-list.net
        -   http://rebro.weebly.com/proxy-list.html
        -   http://www.samair.ru/proxy/time-01.htm
        -   https://www.sslproxies.org
    -   [Tor Relays](https://github.com/18520339/facebook-crawling/tree/master/tor) which used in [Tor Browser](https://www.torproject.org/), a network is comprised of thousands of volunteer-run servers.

### II. Weaknesses

-   Unable to detect some failed responses. Example: **Rate limit exceeded** (Facebook prevents from loading more).
     
    ![](https://github.com/18520339/facebook-crawling/blob/master/img/rate_limit_exceeded.png?raw=true)

    ➔ Have to run with `HEADLESS = False` to detect manually.

-   Quite slow when running with a large number of _loading more_ or when using [IP hiding techniques](#ii-ip-hiding-techniques).

### III. Result

-   Each post will be separated [line by line](https://raw.githubusercontent.com/18520339/facebook-crawling/master/data/KTXDHQGConfessions-inline.json).
-   Most of my successful tests were on **Firefox** with [HTTP Request Randomizer](https://github.com/pgaref/HTTP_Request_Randomizer) proxy server.
-   My latest run on **Firefox** with **Incognito** windows using [HTTP Request Randomizer](https://github.com/pgaref/HTTP_Request_Randomizer):

    ![](https://github.com/18520339/facebook-crawling/blob/master/img/result.png?raw=true)

<details>
    <summary>
        <b>Example data fields for a post</b>
    </summary><br/>
    
```json
{
    "url": "https://www.facebook.com/KTXDHQGConfessions/videos/352525915858361/",
    "id": "352525915858361",
    "utime": "1603770573",
    "text": "Diễn tập PCCC tại KTX khu B tòa E1. ----------- #ktx_cfs Nguồn : Trường Vũ",
    "reactions": ["308 Like", "119 Haha", "28 Wow"],
    "total_shares": "26 Shares",
    "total_cmts": "169 Comments",
    "crawled_cmts": [
        {
            "id": "Y29tbWVudDozNDM0NDI0OTk5OTcxMDgyXzM0MzQ0MzIyMTY2MzcwMjc%3D",
            "utime": "1603770714",
            "user_url": "https://www.facebook.com/KTXDHQGConfessions/",
            "user_id": "KTXDHQGConfessions",
            "user_name": "KTX ĐHQG Confessions",
            "text": "Toà t á bây :) #Lép",
            "replies": [
                {
                    "id": "Y29tbWVudDozNDM0NDI0OTk5OTcxMDgyXzM0MzQ0OTc5MDk5NjM3OTE%3D",
                    "utime": "1603772990",
                    "user_url": "https://www.facebook.com/KTXDHQGConfessions/",
                    "user_id": "KTXDHQGConfessions",
                    "user_name": "KTX ĐHQG Confessions",
                    "text": "Nguyễn Hoàng Đạt thật đáng tự hào :) #Lép"
                }
            ]
        }
    ]
}
```
</details>

## Usage

### I. Install libraries

    pip install -r requirements.txt

-   [Helium](https://github.com/mherrmann/selenium-python-helium): a wrapper around [Selenium](https://selenium-python.readthedocs.io/) with more high-level API for web automation.
-   [HTTP Request Randomizer](https://github.com/pgaref/HTTP_Request_Randomizer): used for collecting free proxies.

### II. Customize parameters in [crawler.py](https://github.com/18520339/facebook-crawling/blob/master/crawler.py)

1.  **Running browser**:

    -   **PAGE_URL**: url of Facebook page.
    -   **TOR_PATH**: use proxy with Tor for `WINDOWS` / `MAC` / `LINUX` / `NONE`:
    -   **BROWSER_OPTIONS**: run scripts using `CHROME` / `FIREFOX`.
    -   **PRIVATE**: run with private mode or not:
        -   Prevent from **Selenium** detection ➔ **navigator.driver** must be _undefined_ (check in Dev Tools).
        -   Start browser with **Incognito** / **Private Window**.
    -   **USE_PROXY**: run with proxy or not. If **True** ➔ check:
        -   IF **TOR_PATH** &ne; `NONE` ➔ Use **Tor's SOCKS** proxy server.
        -   ELSE ➔ Randomize proxies with [HTTP Request Randomizer](https://github.com/pgaref/HTTP_Request_Randomizer).
    -   **HEADLESS**: run with headless browser or not.
    -   **SPEED_UP**: simplify browser for minimizing loading time or not. If **True** ➔ use following settings:

        -   With **Chrome** :

        ```python
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

        -   With **Firefox** :

        ```python
        # Disable loading image, CSS, Flash
        browser_options.set_preference('permissions.default.image', 2)
        browser_options.set_preference('permissions.default.stylesheet', 2)
        browser_options.set_preference('dom.ipc.plugins.enabled.libflashplayer.so', 'false')
        ```

2.  **Loading page**:

    -   **SCROLL_DOWN**: number of times to scroll for **view more posts**.
    -   **FILTER_CMTS_BY**: filter comments by `MOST_RELEVANT` / `NEWEST` / `ALL_COMMENTS`.
        ![](https://github.com/18520339/facebook-crawling/blob/master/img/filter.png?raw=true)
    -   **VIEW_MORE_CMTS**: number of times to click **view more comments**.
    -   **VIEW_MORE_REPLIES**: number of times to click **view more replies**.

### III. Start running

    python crawler.py

-   Run at sign out state, cause some CSS Selectors will be different as sign in.
-   With some proxies, it might be quite slow or required to sign in (redirected).
-   **To achieve higher speed**:
    -   If this is first time using these scripts, you can **run without tor & proxies** until Facebook requires to sign in.
    -   Use some popular **VPN services** (also **run without tor & proxies**): [Touch VPN](https://touchvpn.net/platform) (free), [Hotspot Shield VPN](https://www.hotspotshield.com/vpn) (free, Premium available), ...

## Test proxy server

1. With [HTTP Request Randomizer](https://github.com/pgaref/HTTP_Request_Randomizer):

```python
from browser import *
page_url = 'http://check.torproject.org'
proxy_server = random.choice(proxies).get_address()
browser_options = BROWSER_OPTIONS.FIREFOX

setup_free_proxy(page_url, proxy_server, browser_options)
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

![](https://github.com/18520339/facebook-crawling/blob/master/img/proxy.png?raw=true)

<div id="3"></div>

# 3️⃣ &nbsp;[Run JS code directly at the DevTools Console](#top)

Simply to say, this method is just another automation one, the same as the [2nd method](#2) but without using any IP hiding techniques. You just directly write & run JS code in the [DevTools Console](https://developer.chrome.com/docs/devtools/open) of your browser, so it's quite convenient, not required to setup anything.

- You can take a look at this [extremely useful project](https://github.com/jayremnt/facebook-scripts-dom-manipulation) which includes many automation scripts (not just about data extraction) with no Access Token needed for Facebook users by directly manipulating the DOM.
  
- Here's my example script to collect comments on **a Facebook page when not sign-in**:
   
```js
// Go to the page you want to collect, wait until it finishes loading.
// Open the DevTools Console on the Browser and run the following code
let csvContents = [['UserId', 'Name', 'Comment']];
let cmtsSelector = '.userContentWrapper .commentable_item';

// 1. Click see more comments
// If you want more, just wait until the loading finishes and run this again
moreCmts = document.querySelectorAll(cmtsSelector + ' ._4sxc._42ft');
moreCmts.forEach(btnMore => btnMore.click());

// 2. Collect all comments
comments = document.querySelectorAll(cmtsSelector + ' ._72vr');
comments.forEach(cmt => {
    let info = cmt.querySelector('._6qw4');
    let userId = info.getAttribute('href')?.substring(1);
    let content = cmt.querySelector('._3l3x>span')?.innerText;
    csvContents.push([userId, info.innerText, content]);
});
csvContents.map(cmt => cmt.join('\t')).join('\n');
```

<details>
    <summary>
        <b>Example result for the script above</b>
    </summary><br/>

| UserId          | Name           | Comment                            |
| --------------  | -------------- | ---------------------------------- |
| freedomabcxyz   | Freedom        | Sau khi dùng                       |
| baodendepzai123 | Bảo Huy Nguyễn | nhưng mà thua                      |
| tukieu.2001     | Tú Kiều        | đang xem hài ai rãnh xem quãng cáo |
| ABCDE2k4        | Maa Vănn Kenn  | Lê Minh Nhất                       |
| buikhanhtoanpro | Bùi Khánh Toàn | Haha                               |

</details>

<div id="4"></div>

# 4️⃣ &nbsp;[Mbasic Facebook + IP hiding techniques](#top) 

There is also another way quite similar to the [2nd method](#2) is to use the [Mbasic Facebook](https://mbasic.facebook.com):
- This version of Facebook is made for mobile browsers on slow internet connections. You can access it without a modern smartphone.
- With modern devices, it will improves the page loading time & the contents will be rendered with raw HTML, not JS ➔ You can leverage the power of many web scraping tools ([scrapy](https://scrapy.org), [bs4](https://pypi.org/project/beautifulsoup4), ...) not just automation tools like the [2nd method](#2) and it will become even more powerful when used with [IP hiding techniques](#ii-ip-hiding-techniques). 
- You can get each part of the contents through different URLs, not only through page scrolling like the [2nd method](#2) ➔ You can do something like using proxy for each request or [AutoThrottle](https://doc.scrapy.org/en/latest/topics/autothrottle.html) (a built-in [scrapy](https://scrapy.org) extension), ...

**Note**: I haven't tried the extraction with this method yet, so I won't go into details about it.