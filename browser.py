from helium import *
from selenium.webdriver import ChromeOptions
from selenium.webdriver import FirefoxOptions
from http_request_randomizer.requests.proxy.requestProxy import RequestProxy

import os
import psutil
import shutil
import random

TOR_FOLDER = os.path.join(os.getcwd(), 'tor')
TOR_PATH = type('Enum', (), {
    'WINDOWS': os.path.join(TOR_FOLDER, 'windows', 'tor.exe'),
    'MAC': os.path.join(TOR_FOLDER, 'mac', 'tor.real'),
    'LINUX': os.path.join(TOR_FOLDER, 'linux', 'tor'),
    'NONE': ''
})

BROWSER_OPTIONS = type('Enum', (), {
    'CHROME': ChromeOptions(),
    'FIREFOX': FirefoxOptions()
})

request_proxy = RequestProxy()
request_proxy.set_logger_level(40)
proxies = request_proxy.get_proxy_list()

def hidden(browser_options=BROWSER_OPTIONS.FIREFOX):
    if type(browser_options) == ChromeOptions:
        browser_options.add_argument('--incognito')
        browser_options.add_argument('--disable-blink-features=AutomationControlled')
    elif type(browser_options) == FirefoxOptions:
        browser_options.add_argument('--private') 
        browser_options.set_preference('dom.webdriver.enabled', False)
        browser_options.set_preference('useAutomationExtension', False)
    return browser_options

def simplify(browser_options=BROWSER_OPTIONS.FIREFOX):
    if type(browser_options) == ChromeOptions:
        browser_options.add_experimental_option('prefs', {
            'profile.managed_default_content_settings.images': 2,
            'profile.managed_default_content_settings.stylesheets': 2,
            'profile.managed_default_content_settings.cookies': 2,
            'profile.managed_default_content_settings.geolocation': 2,
            'profile.managed_default_content_settings.media_stream': 2,
            'profile.managed_default_content_settings.plugins': 1,
            'profile.default_content_setting_values.notifications': 2,
        })
    elif type(browser_options) == FirefoxOptions:
        browser_options.set_preference('permissions.default.image', 2)
        browser_options.set_preference('permissions.default.stylesheet', 2)
        browser_options.set_preference('dom.ipc.plugins.enabled.libflashplayer.so', 'false')
    return browser_options

def setup_free_proxy(page_url, proxy_server, browser_options=BROWSER_OPTIONS.FIREFOX, headless=False):
    print('Current proxy server:', proxy_server)
    host = proxy_server.split(':')[0]
    port = int(proxy_server.split(':')[1])
    print('Go to page', page_url)

    if type(browser_options) == ChromeOptions:
        browser_options.add_argument(f'--proxy-server={proxy_server}')
        return start_chrome(page_url, headless=headless, options=browser_options)
    elif type(browser_options) == FirefoxOptions:
        browser_options.set_preference('network.proxy.type', 1)
        browser_options.set_preference('network.proxy.http', host)
        browser_options.set_preference('network.proxy.http_port', port)
        browser_options.set_preference('network.proxy.ssl', host)
        browser_options.set_preference('network.proxy.ssl_port', port)
        return start_firefox(page_url, headless=headless, options=browser_options)

def setup_tor_proxy(page_url, tor_path=TOR_PATH.WINDOWS, browser_options=BROWSER_OPTIONS.FIREFOX, headless=False):
    torBrowser = os.popen(tor_path)
    print('Go to page', page_url)

    if type(browser_options) == ChromeOptions:
        browser_options.add_argument('--proxy-server=socks5://127.0.0.1:9050')
        return start_chrome(page_url, headless=headless, options=browser_options)
    elif type(browser_options) == FirefoxOptions:
        browser_options.set_preference('network.proxy.type', 1)
        browser_options.set_preference('network.proxy.socks', '127.0.0.1')
        browser_options.set_preference('network.proxy.socks_port', 9050)
        browser_options.set_preference('network.proxy.socks_remote_dns', False)
        return start_firefox(page_url, headless=headless, options=browser_options)

def setup_driver(page_url, tor_path=TOR_PATH.WINDOWS, browser_options=BROWSER_OPTIONS.FIREFOX, use_proxy=False, private=False, speed_up=False, headless=False):
    if private: browser_options = hidden(browser_options)
    if speed_up: browser_options = simplify(browser_options)

    if not use_proxy:
        print('Go to page', page_url)
        if type(browser_options) == ChromeOptions: 
            return start_chrome(page_url, headless=headless, options=browser_options)
        elif type(browser_options) == FirefoxOptions: 
            return start_firefox(page_url, headless=headless, options=browser_options)

    if not os.path.isfile(tor_path):
        print('Use HTTP Request Randomizer proxy server')
        while True:
            try: 
                rand_proxy = random.choice(proxies)
                proxy_server = rand_proxy.get_address()
                return setup_free_proxy(page_url, proxy_server, browser_options, headless)
            except Exception as e:
                proxies.remove(rand_proxy)
                print('=> Try another proxy.', e)
                close()

    print("Use Tor's SOCKS proxy server")
    return setup_tor_proxy(page_url, tor_path, browser_options, headless)

def close():
    kill_browser()
    if os.path.exists('__pycache__'): shutil.rmtree('__pycache__')
    for proc in psutil.process_iter(): 
        if proc.name()[:3] == 'tor': proc.kill()