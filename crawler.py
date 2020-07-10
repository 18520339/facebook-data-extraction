import load_page
import re

PAGE_URL = 'https://www.facebook.com/KTXDHQGConfessions/'
SCROLL_DOWN = 7

FILTER_CMTS_BY = load_page.CMTS.ALL_COMMENTS
VIEW_MORE_CMTS = 2
VIEW_MORE_REPLIES = 2

def get_child_attribute(element, selector, attr):
	try: 
		element = element.find_element_by_css_selector(selector)
		return str(element.get_attribute(attr))
	except: return ''
	
def get_comment_info(comment):
	cmt_url = get_child_attribute(comment, '._3mf5', 'href')
	cmt_id = cmt_url.split('=')[-1]

	if cmt_id == None:
		cmt_id = comment.get_attribute('data-ft').split(':"')[-1][:-2]
		user_url = user_id = user_name = 'Acc clone'
	else:
		user_url = cmt_url.split('?')[0]
		user_id = user_url.split('https://www.facebook.com/')[-1].replace('/', '')
		user_name = get_child_attribute(comment, '._6qw4', 'innerText')

	utime = get_child_attribute(comment, 'abbr', 'data-utime')
	text = get_child_attribute(comment, '._3l3x ', 'textContent')

	return {
		'id': cmt_id,
		'utime': utime,
		'user_url': user_url,
		'user_id': user_id,
		'user_name': user_name,
		'text': text,
	}


load_page.start(
	PAGE_URL, 
	SCROLL_DOWN, 
	FILTER_CMTS_BY, 
	VIEW_MORE_CMTS, 
	VIEW_MORE_REPLIES
)
driver = load_page.driver
total = 0

listJsonPosts = []
listHtmlPosts = driver.find_elements_by_css_selector('[class="_427x"] .userContentWrapper')
print('Start crawling', len(listHtmlPosts), 'posts...')

for post in listHtmlPosts:
	post_url = get_child_attribute(post, '._5pcq', 'href').split('?')[0]
	post_id = re.findall('\d+', post_url)[-1]
	utime = get_child_attribute(post, 'abbr', 'data-utime')
	post_text = get_child_attribute(post, '.userContent', 'textContent')
	total_shares = get_child_attribute(post, '[data-testid="UFI2SharesCount/root"]', 'innerText')
	total_cmts = get_child_attribute(post, '._3hg-', 'innerText')

	listJsonCmts = []
	listHtmlCmts = post.find_elements_by_css_selector('._7a9a>li')

	num_of_cmts = len(listHtmlCmts)
	total += num_of_cmts

	if num_of_cmts > 0:
		print('Crawling', num_of_cmts, 'comments of post', post_id)

		for comment in listHtmlCmts:
			comment_owner = comment.find_elements_by_css_selector('._7a9b')
			comment_info = get_comment_info(comment_owner[0])

			listJsonReplies = []
			listHtmlReplies = comment.find_elements_by_css_selector('._7a9g')

			num_of_replies = len(listHtmlReplies)
			total += num_of_replies

			if num_of_replies > 0:
				print('Crawling', num_of_replies, 'replies for', comment_info['user_name'] + "'s comment")
				
				for reply in listHtmlReplies:
					reply_info = get_comment_info(reply)
					listJsonReplies.append(reply_info)

			comment_info.update({ 'replies': listJsonReplies })
			listJsonCmts.append(comment_info)

	listJsonReacts = []
	listHtmlReacts = post.find_elements_by_css_selector('._1n9l')

	for react in listHtmlReacts:
		react_text = react.get_attribute('aria-label')
		listJsonReacts.append(react_text)

	listJsonPosts.append({
		'url': post_url,
		'id': post_id,
		'utime': utime,
		'text': post_text,
		'total_shares': total_shares,
		'total_cmts': total_cmts,
		'crawled_cmts': listJsonCmts,
		'reactions': listJsonReacts,
	})

print('Total comments and replies crawled:', total)
load_page.stop_and_save('data.json', listJsonPosts)
