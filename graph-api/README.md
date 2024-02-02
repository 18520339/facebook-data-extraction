# Graph API with Full-permission Token Approach

I wrote a [simple script](./scraper.py) to get data of posts from any **Page**/**Group** by querying [Facebook Graph API](https://developers.facebook.com/docs/graph-api) with Full-permission Token. My implementation for this approach only needs *130 lines* of code (100 if not including comments) with some built-in Python functions.

👉 Demo: https://www.youtube.com/watch?v=Q4oAsz__e_M

### I. Usage

    python scraper.py

1. **COOKIE** (Most important setup):

    This [script](./scraper.py) needs your **COOKIE** to work. You can get it by following these steps:
    - Go to https://business.facebook.com/business_locations and login (It may require `2FA`).
    - Press `F12` and go to the `Network` Panel.
    - Select the first request and copy the **Cookie** value in the **Request Headers**.

    **Note**: Don't use `document.cookie` as this will only extract cookies that are accessible via JavaScript and are not marked as `HttpOnly`.

2. **LIMIT** and **MAX_POSTS**:

    For **Page**, you can only read [a maximum of 100 feed posts](https://developers.facebook.com/docs/graph-api/reference/page/feed/#limitations) with the `limit` field:
    - If you try to read more than that you will get an error message to not exceed **100**.
    - The API will return approximately **600** ranked, published posts per year.
    
    For **Group**, there is no limited number mentioned in the document. As I experimented:
    - For simple query (such as `fields=message`): I can request up to **1850** posts (`LIMIT=1850`) . 
    - For complex query (like the below `fields`): `LIMIT=300` works fine. Larger numbers sometimes work but most of the times are errors.
    - Therefore, I recommend just querying up to **300** posts at a time for Group.

    **Note**: If the data retrieved is too large, you can receive this error message: *"Please reduce the amount of data you're asking for, then retry your request"*.

3. **POST_FIELDS** and **COMMENT_FIELDS**: 

    You can customize the fields you want to get from the `Post` or even `Comment` objects of **Page** and **Group**:
    - https://developers.facebook.com/docs/graph-api/reference/page/feed
    - https://developers.facebook.com/docs/graph-api/reference/group/feed
    - https://developers.facebook.com/docs/graph-api/reference/post

    **Note**: A **User** or **Page** can only query their own reactions. Other **Users**' or **Pages**' reactions are unavailable due to privacy concerns.

4. Other settings:

    - **SLEEP**: The time (in seconds) to wait between each request to get **LIMIT** posts.
    - **PAGE_OR_GROUP_URL**: The URL of the **Page** or **Group** you want to crawl.

    **Note**: The resulting file will contain each post separated [line by line](./data/KTXDHQGConfessions.jsonl).

### II. Recommendation

I have learned a lot from this [repo](https://github.com/HoangTran0410/FBMediaDownloader). It's a NodeJs tool for auto downloading Facebook media with various features:

-   View album information (name, number of photos, link, ...)
-   Download **timeline album** of a FB page: this kind of album is hidden, containing all the photos so far in a FB page, like [this album](https://www.facebook.com/groups/j2team.community/posts/1377217242610392/).
-   Download any kind of albums: `user`'s, `group`'s, or `page`'s.
-   Download all photos/videos on the wall of an object (`user`/`group`/`page`).
-   It also provided [scripts](https://github.com/HoangTran0410/FBMediaDownloader/blob/master/scripts/bookmarks.js) to extract `album_id` / `user_id` / `group_id` / `page_id`.

The only disadvantage is that the description and instructions of this [repo](https://github.com/HoangTran0410/FBMediaDownloader) are in Vietnamese, _my language_. But I think you can use the translation feature of your browser to read, or you can watch its [instruction video](https://www.youtube.com/watch?v=g4zh9p-QfAQ) for more information. Hopefully, in the future, the author will update the description as well as the instructions in English.
