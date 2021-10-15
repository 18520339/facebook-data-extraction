# Mbasic Facebook + IP hiding techniques

There is also another way quite similar to the [2nd method](#2) is to use the [Mbasic Facebook](https://mbasic.facebook.com):
- This version of Facebook is made for mobile browsers on slow internet connections. You can access it without a modern smartphone.
- With modern devices, it will improves the page loading time & the contents will be rendered with raw HTML, not JS ➔ You can leverage the power of many web scraping tools ([scrapy](https://scrapy.org), [bs4](https://pypi.org/project/beautifulsoup4), ...) not just automation tools like the [2nd method](#2) and it will become even more powerful when used with [IP hiding techniques](#ii-ip-hiding-techniques). 
- You can get each part of the contents through different URLs, not only through the page scrolling like the [2nd method](#2) ➔ You can do something like using proxy for each request or [AutoThrottle](https://doc.scrapy.org/en/latest/topics/autothrottle.html) (a built-in [scrapy](https://scrapy.org) extension), ...

**Note**: I haven't tried the extraction with this method yet, so I won't go into details about it.