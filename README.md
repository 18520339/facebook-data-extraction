# Facebook crawling with Python

> Demo: https://www.youtube.com/watch?v=Fx0UWOzYsig

### Features:

-   Get information of posts
-   Filter comments
-   Not required sign in

### Usage:

1. Install Helium: `pip install helium`
2. Customize the `crawler.py` file:
    - PAGE_URL: url of the Facebook page
    - SCROLL_DOWN: number of scroll times for loading more posts
    - FILTER_CMTS_BY: show comments by `MOST_RELEVANT` / `NEWEST` / `ALL_COMMENTS`
    - VIEW_MORE_CMTS: number of times for loading more comments
    - VIEW_MORE_REPLIES: number of times for loading more replies
3. Start crawling: `python crawler.py`

**Reference:** https://github.com/mherrmann/selenium-python-helium
