from browser import *


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
 

def load_more_posts(driver):
    js_script = 'window.scrollTo(0, document.body.scrollHeight)'
    driver.execute_script(js_script)
    while find_all(S('.async_saving [role="progressbar"]')) != []: pass


def click_multiple_buttons(driver, selector):
    js_script = "document.querySelectorAll('" + selector + "').forEach(btn => btn.click())"
    driver.execute_script(js_script)
    while find_all(S(COMMENTABLE_SELECTOR + ' [role="progressbar"]')) != []: pass


def filter_comments(driver, by):
    if by == FILTER_CMTS.MOST_RELEVANT: return
    click_multiple_buttons(driver, '[data-ordering="RANKED_THREADED"]')
    click_multiple_buttons(driver, '[data-ordering="' + by + '"]')


def load(
    driver,
    scroll_down = 0,
    filter_cmts_by = FILTER_CMTS.MOST_RELEVANT,
    view_more_cmts = 0,
    view_more_replies = 0
):
    click_popup('[title="Accept All"]', 'Click Accept Cookies button')
    for i in range(scroll_down):
        print('Load more posts times', i + 1, '/', scroll_down)
        load_more_posts(driver)
        click_popup('#expanding_cta_close_button', 'Click Not Now button')

    print('Filter comments by', filter_cmts_by)
    filter_comments(driver, filter_cmts_by)

    for i in range(view_more_cmts):
        print('Click View more comments buttons times', i + 1, '/', view_more_cmts)
        click_multiple_buttons(driver, COMMENTABLE_SELECTOR + ' ._7a94 ._4sxc')

    for i in range(view_more_replies):
        print('Click Replies buttons times', i + 1, '/', view_more_replies)
        click_multiple_buttons(driver, COMMENTABLE_SELECTOR + ' ._7a9h ._4sxc')

    print('Click See more buttons of comments')
    click_multiple_buttons(driver, COMMENTABLE_SELECTOR + ' .fss')
