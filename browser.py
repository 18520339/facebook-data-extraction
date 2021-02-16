from helium import *
from selenium.webdriver import ChromeOptions
from selenium.webdriver import FirefoxOptions
import os

BROWSER_OPTIONS = type('Enum', (), {
    'CHROME': ChromeOptions(),
    'FIREFOX': FirefoxOptions()
})

def setup_proxy_server(browser_options, tor_path, url):
    print("Use Tor's SOCKS proxy server")
    torBrowser = os.popen(tor_path)

    print('Go to page', url)
    if type(browser_options) == ChromeOptions:
        browser_options.add_argument('--proxy-server=socks5://127.0.0.1:9050')
        return start_chrome(url, options=browser_options)
    elif type(browser_options) == FirefoxOptions:
        browser_options.set_preference('network.proxy.type', 1)
        browser_options.set_preference('network.proxy.socks', '127.0.0.1')
        browser_options.set_preference('network.proxy.socks_port', 9050)
        browser_options.set_preference("network.proxy.socks_remote_dns", False)
        return start_firefox(url, options=browser_options)

def setup_driver(tor_path, browser_options, url):
    if not os.path.isfile(tor_path):
        print('Go to page', url)
        if type(browser_options) == ChromeOptions: return start_chrome(url)
        elif type(browser_options) == FirefoxOptions: return  start_firefox(url)
    return setup_proxy_server(browser_options, tor_path, url)