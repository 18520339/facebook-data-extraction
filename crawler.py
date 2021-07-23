import browser
import page
import re
import json

PAGE_URL = 'https://www.facebook.com/KTXDHQGConfessions/'
TOR_PATH = browser.TOR_PATH.NONE
BROWSER_OPTIONS = browser.BROWSER_OPTIONS.FIREFOX

USE_PROXY = True
PRIVATE = True
SPEED_UP = True
HEADLESS = False

SCROLL_DOWN = 7
FILTER_CMTS_BY = page.FILTER_CMTS.MOST_RELEVANT
VIEW_MORE_CMTS = 2
VIEW_MORE_REPLIES = 2

def get_child_attribute(element, selector, attr):
    try:
        element = element.find_element_by_css_selector(selector)
        return str(element.get_attribute(attr))
    except: return ''

def get_comment_info(comment):
    cmt_url = get_child_attribute(comment, '._3mf5', 'href')
    utime = get_child_attribute(comment, 'abbr', 'data-utime')
    text = get_child_attribute(comment, '._3l3x ', 'textContent')
    cmt_id = cmt_url.split('=')[-1]

    if cmt_id == None:
        cmt_id = comment.get_attribute('data-ft').split(':"')[-1][:-2]
        user_url = user_id = user_name = 'Acc clone'
    else:
        user_url = cmt_url.split('?')[0]
        user_id = user_url.split('https://www.facebook.com/')[-1].replace('/', '')
        user_name = get_child_attribute(comment, '._6qw4', 'innerText')
    return {
        'id': cmt_id,
        'utime': utime,
        'user_url': user_url,
        'user_id': user_id,
        'user_name': user_name,
        'text': text,
    }

while True:
    driver = browser.setup_driver(PAGE_URL, TOR_PATH, BROWSER_OPTIONS, USE_PROXY, PRIVATE, SPEED_UP, HEADLESS)
    if driver.current_url in PAGE_URL: 
        if page.load(driver, PAGE_URL, SCROLL_DOWN, FILTER_CMTS_BY, VIEW_MORE_CMTS, VIEW_MORE_REPLIES): break
    else: print(f"Redirect detected => {'Rerun' if USE_PROXY else 'Please use proxy'}\n")
    driver.close()


html_posts = driver.find_elements_by_css_selector(page.POSTS_SELECTOR)
file_name = re.findall('\.com/(.*)', PAGE_URL)[0].split('/')[0]
total = 0

print('Start crawling', len(html_posts), 'posts...')
with open(f'data/{file_name}.json', 'w', encoding='utf-8') as f:
    for post_index, post in enumerate(html_posts):
        post_url = get_child_attribute(post, '._5pcq', 'href').split('?')[0]
        post_id = re.findall('\d+', post_url)[-1]
        utime = get_child_attribute(post, 'abbr', 'data-utime')
        post_text = get_child_attribute(post, '.userContent', 'textContent')
        total_shares = get_child_attribute(post, '[data-testid="UFI2SharesCount/root"]', 'innerText')
        total_cmts = get_child_attribute(post, '._3hg-', 'innerText')

        json_cmts = []
        html_cmts = post.find_elements_by_css_selector('._7a9a>li')

        num_of_cmts = len(html_cmts)
        total += num_of_cmts

        if num_of_cmts > 0:
            print(f'{post_index}. Crawling {num_of_cmts} comments of post {post_id}')
            for comment in html_cmts:
                comment_owner = comment.find_elements_by_css_selector('._7a9b')
                comment_info = get_comment_info(comment_owner[0])

                json_replies = []
                html_replies = comment.find_elements_by_css_selector('._7a9g')

                num_of_replies = len(html_replies)
                total += num_of_replies

                if num_of_replies > 0:
                    print(f"|-- Crawling {num_of_replies} replies of {comment_info['user_name']}'s comment")
                    for reply in html_replies:
                        reply_info = get_comment_info(reply)
                        json_replies.append(reply_info)

                comment_info.update({'replies': json_replies})
                json_cmts.append(comment_info)

        json_reacts = []
        html_reacts = post.find_elements_by_css_selector('._1n9l')

        for react in html_reacts:
            react_text = react.get_attribute('aria-label')
            json_reacts.append(react_text)

        json.dump({
            'url': post_url,
            'id': post_id,
            'utime': utime,
            'text': post_text,
            'reactions': json_reacts,
            'total_shares': total_shares,
            'total_cmts': total_cmts,
            'crawled_cmts': json_cmts,
        }, f, ensure_ascii=False)

        del json_cmts
        f.write('\n')

del html_posts
print('Total comments and replies crawled:', total)
browser.close()
