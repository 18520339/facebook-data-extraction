# Summary of Facebook data extraction approaches

> I'm editing everything to match the latest big changes

##  Overview

| Approach                                                                                            | Sign-in required |                                             Risk when sign-in                                              |  Risk when not sign-in  | Difficulty |      Speed      |
| --------------------------------------------------------------------------------------------------- | :--------------: | :--------------------------------------------------------------------------------------------------------: | :---------------------: | :--------: | :-------------: |
| 1️⃣ &nbsp;[Graph API + Full-permission Token](#approach-1-graph-api-with-full-permission-token)  |        ✅        | Access Token leaked, [Rate Limits](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/) |       Not working       |    Easy    |      Fast       |
| 2️⃣ &nbsp;[CSR - Client-side Rendering](#approach-2-csr---client-side-rendering)                    | Depends **(\*)**  |                                 Checkpoint but less _loading more_ failure                                 |         Safest          |    Hard    | Slow **(\*\*)** |
| 3️⃣ &nbsp;[SSR - Server-side Rendering](#approach-3-ssr---server-side-rendering)                    | Depends **(\*)**  |                                                     -                                                      |            -            |    Hard    |        -        |
| 4️⃣ &nbsp;[DevTools Console](#approach-4-devtools-console)                                          | Depends **(\*)**  |                                 Checkpoint but less _loading more_ failure                                 | Can be banned if abused |   Medium   | Slow **(\*\*)** |

**(\*)** Depends, some tasks you need to be signed in to perform. Example: Tasks that need to access private groups or private posts, ...

**(\*\*)** Depends on how much data you want to extract, the bigger the number, the more time it will take to load the contents.

### I. My general conclusion after testing all the different approaches

-   When run at the **not sign-in** state, Facebook usually redirects to the login page or prevents you from loading more comments / replies.
-   No matter which approach you choose, any fast or irregular activity continuously in the **sign-in** state for a long period of time is likely to get blocked after some time.
-   If you want to use the tool at the **sign-in** state, for safety, I recommend creating a **fake account** (you can use a [Temporary Email Address](https://temp-mail.org/en/) to create one) and use it for the extraction.
-   With the **sign-in** state, there's also another technique to limit the Checkpoint, you can sign in with different **Cookies**.

### II. DISCLAIMER

All information provided in this repo and related articles is for educational purposes only. So use the tool at your own risk, I will not guarantee & not be responsible for any situations including:

-   Whether your Facebook account may get Checkpoint beacuse of repeated or rapid actions.
-   Problems that may occur with or for any abuse of the information or the code provided.
-   Problems with your privacy while using [IP hiding techniques](#i-ip-hiding-techniques) or any malicious scripts.

## Data Extraction Approaches

### APPROACH 1. Graph API with Full-permission Token

👉 Check out my implementation with [Python](./graph-api/).

You need to query [Facebook Graph API](https://developers.facebook.com/docs/graph-api) using your own Token with **full permission** for fetching data. This is the **MOST EFFECTIVE** approach.

> The description of and the method to get the **Access Token** below are translated from these 2 Vietnamese blogs:
>
> -   https://ahachat.com/help/blog/cach-lay-token-facebook
> -   https://alotoi.com/get-token-full-quyen

**I. What is a Facebook Token?**

A Facebook **Access Token** is a randomly generated code that contains data linked to a Facebook account. It contains the permissions to perform an action on the library (API) provided by Facebook. Each Facebook account will have different **Access Tokens**, and there can be ≥ 1 Tokens on the same account.

Depending on the limitations of each Token's permissions, which are generated for use with corresponding features, either many or few, they can be used for various purposes, but the main goal is to automate all manual operations. Some common applications include:

- Increasing likes and subscriptions on Facebook.
- Automatizing posting on Facebook.
- Automatizing commenting and sharing posts.
- Automatizing interactions in groups and Pages.
- ...

There are 2 types of Facebook Tokens: an **App-based Token** and a **Personal Account-based Token**. The Facebook **Token by App** is the safest one, as it has a limited lifetime and only has some basic permissions to interact with `Pages` and `Groups`. Our main focus will on the Facebook **Personal Account-based Token**.

**II. Personal Account-based Access Token**

This is a **full permissions** Token represented by a string of characters starting with `EAA...`. The purpose of this Token is to act on behalf of your Facebook account to perform actions you can do on Facebook, such as sending messages, liking pages, and posting in groups through `API`. 

Compared to an **App-based Token**, this type of Token has a longer lifespan and more permissions. Simply put, whatever an **App-based Token** can do, a **Personal Account-based Token** can do as well, but not vice versa.

An example of using this Facebook Token is when you want to simultaneously post to many `Groups` and `Pages`. To do this, you cannot simply log into each `Group` or `Page` to post, which is very time-consuming. Instead, you just need to fill in a list of `Group` and `Page` IDs, and then call an `API` to post to all in this list. Or, as you can often see on the Internet, there are tools to increase fake likes and comments also using this technique.

Note that using Facebook Token can save you time, but you should not reveal this Token to others as they can misuse it for malicious purposes:

- Do not download extensions to get Tokens or login with your phone number and password on websites that support Token retrieval, as your information will be compromised.
- And if you suspect your Token has been compromised, immediately change your Facebook password and delete the extensions installed in the browser. 
- If you wanna be more careful, you can turn on **two-factor authentication** (2FA).

👉 To ensure safety when using the Facebook Token for personal purposes and saving time as mentioned above, you should obtain the Token directly from Facebook following the steps below.

**III. Get Access Token with full permissions**

Before, obtaining Facebook Tokens was very simple, but now many Facebook services are developing and getting Facebook Tokens has become more difficult. Facebook also limits Full permission Tokens to prevent Spam and excessive abuse regarding user behavior. 

It's possible to obtain a Token, but it might be limited by basic permissions that we do not use. This is not a big issue compared to sometimes having accounts locked (identity verification) on Facebook.

Currently, this is the most used method, but it may require you to authenticate with 2FA (via app or SMS Code). With these following steps, you can get an **almost full permission** Token:

-   Go to https://business.facebook.com/business_locations.
-   Press `Ctrl + U`, then `Ctrl + F` to find the code that contains `EAAG`. Copy the highlighted text, that's the Token you want to obtain.

    ![](https://alotoi.com/wp-content/uploads/2020/08/token-business.png)

-   You can go to this [facebook link](https://developers.facebook.com/tools/debug/accesstoken) to check the permissions of the above Token.
    ![](https://lh4.googleusercontent.com/0S64t2sjFXjkX8HUjo2GeEW8hyKL88G4lMXkpNF7RgtFCRm0oVPRT--vnoM1rkMyhrRvvHufW9J0ZeP8tPxfo4j5vYityQFM0m06NTI2hq4zk1JMp59W9voHXHYtOjE7zqDGMlhh)

**Note**: I only share how to get **Access Token** from Facebook itself. Revealing Tokens can seriously affect your Facebook account. Please don't get Tokens from unknown sources!

### APPROACH 2. CSR - Client-side Rendering

👉 Check out my implementation with [Selenium](./stealth-csr-selenium/) (Deprecated) and [Puppeteer](./stealth-csr-puppeteer/) (Implementing).

Updating...

### APPROACH 3. SSR - Server-side Rendering

👉 Check out my implementation with [Scrapy](./stealth-ssr-scrapy/) (Implementing) and [Puppeteer](./stealth-ssr-puppeteer/) (Implementing).

Another way is to use the [Mbasic Facebook](https://mbasic.facebook.com):
- This version of Facebook is made for mobile browsers on slow internet connections. You can access it without a modern smartphone.
- With modern devices, it will improves the page loading time & the contents will be rendered with raw HTML, not JS ➔ You can leverage the power of many web scraping tools ([scrapy](https://scrapy.org), [bs4](https://pypi.org/project/beautifulsoup4), ...) not just automation tools and it will become even more powerful when used with [IP hiding techniques](). 
- You can get each part of the contents through different URLs, not only through the page scrolling ➔ You can do something like using proxy for each request or [AutoThrottle]() (a built-in [scrapy](https://scrapy.org) extension), ...

**Note**: I haven't tried the extraction with this approach yet, so I won't go into details about it.

### APPROACH 4. DevTools Console

This is the most simple way, which is to directly write & run JS code in the [DevTools Console](https://developer.chrome.com/docs/devtools/open) of your browser, so it's quite convenient, not required to setup anything.

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
        <b>
            <a href="https://github.com/18520339/facebook-data-extraction/blob/master/devtool-data.xlsx">Example</a> result for the script above
        </b>
    </summary><br/>

| UserId          | Name           | Comment                            |
| --------------  | -------------- | ---------------------------------- |
| freedomabcxyz   | Freedom        | Sau khi dùng                       |
| baodendepzai123 | Bảo Huy Nguyễn | nhưng mà thua                      |
| tukieu.2001     | Tú Kiều        | đang xem hài ai rãnh xem quãng cáo |
| ABCDE2k4        | Maa Vănn Kenn  | Lê Minh Nhất                       |
| buikhanhtoanpro | Bùi Khánh Toàn | Haha                               |

</details>

## Bypass Bot Detection

👉 Highly recommend: https://github.com/niespodd/browser-fingerprinting

Updating...

### I. IP Hiding Techniques

| Method       | Speed rating | Cost         | Common risk                             | General Evaluation |
| ------------ | :----------: | ------------ | --------------------------------------- | ------------------ |
| VPN service  |     `2`      | Usually paid | Some free providers might not be secure | Best way           |
| Tor browser  |     `4`      | Free         | Can be tracked by some rogue nodes      | Slowest choice     |
| Proxy server |     `3`      | Usually free | Data routing not private as VPNs        | Riskiest method    |
| Public WiFi  |     `1`      | Free         | Some might not be safe                  | Long distance way  |

➔ Learn more about general information of above methods from this [site](https://whatismyipaddress.com/hide-ip).

**IMPORTANT**: Nothing above is absolutely safe and secure. _Carefulness is never excessive_. You will need to do further research about them if you want more secure to your data & privacy.

### II. Browser Settings & Plugins

Updating...

## References

Updating...
