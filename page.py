from browser import *
import time

POSTS_SELECTOR = '[class="_427x"] .userContentWrapper'
COMMENTABLE_SELECTOR = f'{POSTS_SELECTOR} .commentable_item'
FILTER_CMTS = type('Enum', (), {
    'MOST_RELEVANT': 'RANKED_THREADED',
    'NEWEST': 'RECENT_ACTIVITY',
    'ALL_COMMENTS': 'RANKED_UNFILTERED'
})

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        func(*args, **kwargs)
        end = time.time()
        print('=> Loading time:', end - start)
    return wrapper

def click_popup(selector):
    btn = find_all(S(selector))
    if btn != []: click(btn[0])

def failed_to_load(driver, page_url):
    if driver.current_url not in page_url:
        print('Redirect detected => Rerun\n')
        return True
    elif find_all(S('#main-frame-error')) != []:
        print('Cannot load page => Rerun\n')
        return True
    return False

@timer
def load_more_posts(driver):
    driver.execute_script('window.scrollTo(0, document.body.scrollHeight)')
    while find_all(S('.async_saving [role="progressbar"]')) != []: pass
    time.sleep(random.randint(3, 7))

@timer
def click_multiple_buttons(driver, selector):
    for button in driver.find_elements_by_css_selector(selector):
        driver.execute_script('arguments[0].click()', button)
        while find_all(S(f'{COMMENTABLE_SELECTOR} [role="progressbar"]')) != []: pass
        time.sleep(random.randint(3, 7))

def filter_comments(driver, by):
    if by == FILTER_CMTS.MOST_RELEVANT: return
    click_multiple_buttons(driver, '[data-ordering="RANKED_THREADED"]')
    click_multiple_buttons(driver, f'[data-ordering="{by}"]')

def load(driver, page_url, scroll_down=0, filter_cmts_by=FILTER_CMTS.MOST_RELEVANT, view_more_cmts=0, view_more_replies=0):
    print('Click Accept Cookies button')
    click_popup('[title="Accept All"]')

    for i in range(min(scroll_down, 3)):
        print(f'Load more posts times {i + 1}/{scroll_down}')
        load_more_posts(driver)
        if failed_to_load(driver, page_url): return False

    print('Click Not Now button')
    click_popup('#expanding_cta_close_button')

    for i in range(scroll_down - 3):
        print(f'Load more posts times {i + 4}/{scroll_down}')
        load_more_posts(driver)
        if failed_to_load(driver, page_url): return False

    print('Filter comments by', filter_cmts_by)
    filter_comments(driver, filter_cmts_by)

    for i in range(view_more_cmts):
        print(f'Click View more comments buttons times {i + 1}/{view_more_cmts}')
        click_multiple_buttons(driver, f'{COMMENTABLE_SELECTOR} ._7a94 ._4sxc')
        if failed_to_load(driver, page_url): return False

    for i in range(view_more_replies):
        print(f'Click Replies buttons times {i + 1}/{view_more_replies}')
        click_multiple_buttons(driver, f'{COMMENTABLE_SELECTOR} ._7a9h ._4sxc')
        if failed_to_load(driver, page_url): return False

    print('Click See more buttons of comments')
    click_multiple_buttons(driver, f'{COMMENTABLE_SELECTOR} .fss')
    if failed_to_load(driver, page_url): return False
    return True
