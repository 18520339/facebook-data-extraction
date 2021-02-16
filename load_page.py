from proxies import *
import psutil
import shutil
import json

POSTS_SELECTOR = '[class="_427x"] .userContentWrapper'
COMMENTABLE_SELECTOR = POSTS_SELECTOR + ' .commentable_item'
FILTER_CMTS = type('Enum', (), {
    'MOST_RELEVANT': 'RANKED_THREADED',
    'NEWEST': 'RECENT_ACTIVITY',
    'ALL_COMMENTS': 'RANKED_UNFILTERED'
})

def click_popup(selector, title):
    btn = find_all(S(selector))
    if btn != []:
        print(title)
        click(btn[0].web_element.text)

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

def setup_driver(tor_path, browser_options, url):
    if not os.path.isfile(tor_path):
        print('Go to page', url)
        if type(browser_options) == ChromeOptions: return start_chrome(url)
        elif type(browser_options) == FirefoxOptions: return  start_firefox(url)
    return setup_proxy_server(browser_options, tor_path, url)

def start(
    tor_path = '',
    browser_options = BROWSER_OPTIONS.FIREFOX,
    page_url = '',
    scroll_down = 0,
    filter_cmts_by = FILTER_CMTS.MOST_RELEVANT,
    view_more_cmts = 0,
    view_more_replies = 0
):
    global driver
    driver = setup_driver(tor_path, browser_options, page_url)

    click_popup('[title="Accept All"]', 'Click Accept Cookies button')
    print('Load more posts')
    load_more_posts()

    click_popup('#expanding_cta_close_button', 'Click Not Now button')
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
    
    if os.path.exists('__pycache__'): shutil.rmtree('__pycache__')
    for proc in psutil.process_iter():
        if proc.name() == 'tor.exe': proc.kill()
