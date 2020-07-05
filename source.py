from helium import *

PAGE_URL = 'https://facebook.com/KTXDHQGConfessions'
SCROLL_DOWN	= 2
VIEW_MORE_CMTS = 0
VIEW_MORE_REPLIES = 0

POSTS_SELECTOR = '[class="_427x"] .userContentWrapper'
COMMENTABLE_SELECTOR = POSTS_SELECTOR + ' .commentable_item'
REPLIES_SELECTOR = COMMENTABLE_SELECTOR + ' li ._7a9h'

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

def get_attribute(element, class_name, attr):
	return element.web_element.find_element_by_class_name(class_name).get_attribute(attr)

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
	click_multiple_button(REPLIES_SELECTOR + ' ._4sxc')

############################################################
listJsonPosts = []
for post in find_all(S(POSTS_SELECTOR)):
	post_id = get_attribute(post, '_5pcp', 'id').split(';')[1] 
	utime = get_attribute(post, '_5ptz', 'data-utime')
	post_text = get_attribute(post, 'userContent', 'textContent')
	total_shares = get_attribute(post, '', '')
	total_cmts = get_attribute(post, '', '')

	crawled_cmts = []
	for comment in post.web_element.find_element_by_class_name(''):
		cmt_id = get_attribute(comment, '', '')
		cmt_utime = get_attribute(comment, '', '')
		cmt_user_id = get_attribute(comment, '', '')
		cmt_user_name = get_attribute(comment, '', '')
		cmt_text = get_attribute(comment, '', '')
		total_replies = get_attribute(comment, '', '')

		crawled_replies = []
		for reply in comment.web_element.find_element_by_class_name(''):
			reply_id = get_attribute(reply, '', '')
			reply_utime = get_attribute(reply, '', '')
			reply_user_id = get_attribute(reply, '', '')
			reply_user_name = get_attribute(reply, '', '')
			reply_text = get_attribute(reply, '', '')

			crawled_replies.append({
				'id': reply_id,
				'utime ': reply_utime,
				'user_id': reply_user_id,
				'user_name': reply_user_name,
		        'text': reply_text,
			})

		crawled_cmts.append({
			'id': cmt_id,
			'utime ': cmt_utime,
	        'user_id': cmt_user_id,
	        'user_name': cmt_user_name,
	        'text': cmt_text,
	        'total_replies': total_replies,
	        'crawled_replies': crawled_replies
		})

	reactions = []
	for react in post.web_element.find_element_by_class_name(''):
		react_text = get_attribute(react, '', '')
		reactions.append(react_text)

	listJsonPosts.append({
        'id': post_id,
        'utime ': utime,
        'text': post_text,
        'total_shares': 0,
        'total_cmts': 0,
        'crawled_cmts': crawled_cmts,
        'reactions': reactions
	})

kill_browser()
