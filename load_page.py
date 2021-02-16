from helium import *
from selenium.webdriver import FirefoxOptions
import json
import os

POSTS_SELECTOR = '[class="_427x"] .userContentWrapper'
COMMENTABLE_SELECTOR = POSTS_SELECTOR + ' .commentable_item'
FILTER_CMTS = type('Enum', (), {
    'MOST_RELEVANT': 'RANKED_THREADED',
    'NEWEST': 'RECENT_ACTIVITY',
    'ALL_COMMENTS': 'RANKED_UNFILTERED'
})

def load_more_posts():
    js_script = 'window.scrollTo(0, document.body.scrollHeight)'
    driver.execute_script(js_script)
    while find_all(S('.async_saving [role="progressbar"]')) != []: pass

def click_multiple_button(selector):
    js_script = "document.querySelectorAll('" + selector + "').forEach(btn => btn.click())"
    driver.execute_script(js_script)
    while find_all(S(COMMENTABLE_SELECTOR + ' [role="progressbar"]')) != []: pass

def filter_comments(by):
    if by == FILTER_CMTS.MOST_RELEVANT: return
    click_multiple_button('[data-ordering="RANKED_THREADED"]')
    click_multiple_button('[data-ordering="' + by + '"]')

def start(
	tor_path='',
	url = '',
	scroll_down = 0,
	filter_cmts_by = FILTER_CMTS.MOST_RELEVANT,
	view_more_cmts = 0,
	view_more_replies = 0
):
    global driver
    options = FirefoxOptions()

    if os.path.isfile(tor_path):
        print("Use Tor's SOCKS proxy server with Firefox")
        torBrowser = os.popen(tor_path)
        options.add_argument('--proxy-server=socks5://localhost:9050')

    print('Go to page', url)
    driver = start_firefox(url, headless=False, options=options)

    print('Load more posts and check for Not Now button')
    load_more_posts()

    btnNotNow = find_all(S('#expanding_cta_close_button'))
    if btnNotNow != []:
        print('Click Not Now button')
        click(btnNotNow[0].web_element.text)

    for i in range(scroll_down - 1):
        print('Load more posts times', i + 2, '/', scroll_down)
        load_more_posts()

    print('Filter comments by', filter_cmts_by)
    filter_comments(filter_cmts_by)

    for i in range(view_more_cmts):
        print('Click View more comments buttons times', i + 1, '/', view_more_cmts)
        click_multiple_button(COMMENTABLE_SELECTOR + ' ._7a94 ._4sxc')

    for i in range(view_more_replies):
        print('Click Replies buttons times', i + 1, '/', view_more_replies)
        click_multiple_button(COMMENTABLE_SELECTOR + ' ._7a9h ._4sxc')

    print('Click See more buttons of comments')
    click_multiple_button(COMMENTABLE_SELECTOR + ' .fss')

def stop_and_save(fileName, listPosts):
    print('Save crawled data...')
    with open(fileName, 'w', encoding='utf-8') as file:
        json.dump(listPosts, file, ensure_ascii=False, indent=4)
    kill_browser()
	
