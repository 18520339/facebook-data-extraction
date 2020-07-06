from helium import *
import json

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
	

############################################################
print('Start crawling', PAGE_URL)
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
listJsonPosts = []
listHtmlPosts = driver.find_elements_by_css_selector(POSTS_SELECTOR)

for post in listHtmlPosts:
	post_id = get_attribute(post, '._5pcp', 'id').split(';;')[0].split(';')[-1]
	utime = get_attribute(post, 'abbr', 'data-utime')
	post_text = get_attribute(post, '.userContent', 'textContent')
	total_shares = get_attribute(post, '[data-testid="UFI2SharesCount/root"]', 'innerText')
	total_cmts = get_attribute(post, '._3hg-', 'innerText')

	listJsonCmts = []
	listHtmlCmts = post.find_elements_by_css_selector('._7a9a>li>div>._4eek ')

	for comment in listHtmlCmts:
		cmt_id = str(comment.get_attribute('data-ft')).split(':"')[-1].replace('"}', '')
		cmt_utime = get_attribute(comment, 'abbr', 'data-utime')
		cmt_user_id = get_attribute(comment, '._3mf5', 'data-hovercard').split('=')[-1]
		cmt_user_name = get_attribute(comment, '._6qw4', 'innerText')
		cmt_text = get_attribute(comment, '._3l3x ', 'textContent')

		listJsonReplies = []
		listHtmlReplies= post.find_elements_by_css_selector('._7a9h li')

		for reply in listHtmlReplies:
			reply_id = str(reply.get_attribute('data-ft')).split(':"')[-1].replace('"}', '')
			reply_utime = get_attribute(reply, 'abbr', 'data-utime')
			reply_user_id = get_attribute(reply, '._3mf5', 'data-hovercard').split('=')[-1]
			reply_user_name = get_attribute(reply, '._6qw4', 'innerText')
			reply_text = get_attribute(reply, '._3l3x ', 'textContent')

			listJsonReplies.append({
				'id': reply_id,
				'utime': reply_utime,
				'user_id': reply_user_id,
				'user_name': reply_user_name,
		        'text': reply_text,
			})

		listJsonCmts.append({
			'id': cmt_id,
			'utime': cmt_utime,
	        'user_id': cmt_user_id,
	        'user_name': cmt_user_name,
	        'text': cmt_text,
	        'replies': listJsonReplies
		})

	listJsonReacts = []
	listHtmlReacts = post.find_elements_by_css_selector('._1n9l')

	for react in listHtmlReacts:
		react_text = react.get_attribute('aria-label')
		listJsonReacts.append(react_text)

	listJsonPosts.append({
        'id': post_id,
        'utime': utime,
        'text': post_text,
        'total_shares': total_shares,
        'total_cmts': total_cmts,
        'crawled_cmts': listJsonCmts,
        'reactions': listJsonReacts
	})

print(json.dumps(
	listJsonPosts, 
	indent=4, 
	ensure_ascii=False	
).encode('utf8').decode())
kill_browser()
