from helium import *
import json
import re

PAGE_URL = 'https://facebook.com/theanh28.page'
SCROLL_DOWN	= 1
VIEW_MORE_CMTS = 0
VIEW_MORE_REPLIES = 1

POSTS_SELECTOR = '[class="_427x"] .userContentWrapper'
COMMENTABLE_SELECTOR = POSTS_SELECTOR + ' .commentable_item'
CMTS = type('Enum', (), {
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

def filter_comments(by=CMTS.MOST_RELEVANT):
	if by == CMTS.MOST_RELEVANT: return
	click_multiple_button('[data-ordering="RANKED_THREADED"]')
	click_multiple_button('[data-ordering="'+ by + '"]')

def get_attribute(element, selector, attr):
	try: 
		element = element.find_element_by_css_selector(selector)
		return str(element.get_attribute(attr))
	except: return ''
	
def get_comment_info(comment):
	cmt_url = get_attribute(comment, '._3mf5', 'href')
	cmt_id = cmt_url.split('=')[-1]

	user_url = cmt_url.split('?')[0]
	user_id = user_url.split('https://www.facebook.com/')[-1].replace('/', '')
	user_name = get_attribute(comment, '._6qw4', 'innerText')

	utime = get_attribute(comment, 'abbr', 'data-utime')
	text = get_attribute(comment, '._3l3x ', 'textContent')

	return {
		'id': cmt_id,
		'utime': utime,
		'user_url': user_url,
		'user_id': user_id,
		'user_name': user_name,
        'text': text,
	}

############################################################
print('Go to page', PAGE_URL)
driver = start_chrome(PAGE_URL, headless=True)

############################################################
print('Load more posts and check for Not Now button')
load_more_posts()

btnNotNow = find_all(S('expanding_cta_close_button'))
if btnNotNow != []:
	print('Click Not Now button')
	click(btnNotNow[0].web_element.text)

############################################################
for i in range(SCROLL_DOWN - 1):
	print('Load more posts times', i + 2, '/', SCROLL_DOWN)
	load_more_posts()

############################################################
print('Filter comments by', CMTS.ALL_COMMENTS)
filter_comments(CMTS.ALL_COMMENTS)

for i in range(VIEW_MORE_CMTS):
	print('Click View more comments buttons times', i + 1, '/', VIEW_MORE_CMTS)
	click_multiple_button(COMMENTABLE_SELECTOR + ' ._7a94 ._4sxc')

for i in range(VIEW_MORE_REPLIES):
	print('Click Replies buttons times', i + 1, '/', VIEW_MORE_REPLIES)
	click_multiple_button(COMMENTABLE_SELECTOR + ' ._7a9h ._4sxc')

print('Click See more buttons of comments')
click_multiple_button(COMMENTABLE_SELECTOR + ' .fss')

############################################################
total = 0
listJsonPosts = []
listHtmlPosts = driver.find_elements_by_css_selector(POSTS_SELECTOR)
print('Start crawling', len(listHtmlPosts), 'posts...')

for post in listHtmlPosts:
	post_url = get_attribute(post, '._5pcq', 'href').split('?')[0]
	post_id = re.findall('\d+', post_url)[-1]
	utime = get_attribute(post, 'abbr', 'data-utime')
	post_text = get_attribute(post, '.userContent', 'textContent')
	total_shares = get_attribute(post, '[data-testid="UFI2SharesCount/root"]', 'innerText')
	total_cmts = get_attribute(post, '._3hg-', 'innerText')

	listJsonReacts = []
	listHtmlReacts = post.find_elements_by_css_selector('._1n9l')

	for react in listHtmlReacts:
		react_text = react.get_attribute('aria-label')
		listJsonReacts.append(react_text)

	listJsonCmts = []
	listHtmlCmts = post.find_elements_by_css_selector('._7a9a>li>div>._4eek')
	print('Crawling', len(listHtmlCmts), 'comments of post', post_id)

	total += len(listHtmlCmts)
	for comment in listHtmlCmts:
		listJsonReplies = []
		listHtmlReplies = post.find_elements_by_css_selector('._7a9h>ul>li>div>._4eek')

		total += len(listHtmlReplies)
		for reply in listHtmlReplies:
			reply_info = get_comment_info(reply)
			listJsonReplies.append(reply_info)

		comment_info = get_comment_info(comment)
		comment_info.update({ 'replies': listJsonReplies })
		listJsonCmts.append(comment_info)

	listJsonPosts.append({
		'url': post_url,
        'id': post_id,
        'utime': utime,
        'text': post_text,
        'total_shares': total_shares,
        'reactions': listJsonReacts,
        'total_cmts': total_cmts,
        'crawled_cmts': listJsonCmts,
	})

print('Total comments and replies crawled:', total)
with open('data.json', 'w', encoding='utf-8') as file:
	print('Save crawled data...')
	json.dump(listJsonPosts, file, ensure_ascii=False, indent=4)
kill_browser()
