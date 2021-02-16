from helium import *
from selenium.webdriver import ChromeOptions
from selenium.webdriver import FirefoxOptions
import os

BROWSER_OPTIONS = type('Enum', (), {
    'CHROME': ChromeOptions(),
    'FIREFOX': FirefoxOptions()
})

def speed_up(browser_options):
    if type(browser_options) == ChromeOptions:
        browser_options.add_experimental_option('prefs', {
            "profile.managed_default_content_settings.images": 2,
            "profile.managed_default_content_settings.stylesheets": 2,
            "profile.managed_default_content_settings.cookies": 2,
            "profile.managed_default_content_settings.geolocation": 2,
            "profile.managed_default_content_settings.media_stream": 2,
            "profile.managed_default_content_settings.plugins": 1,
            "profile.default_content_setting_values.notifications": 2,
        })
    elif type(browser_options) == FirefoxOptions:    
        browser_options.set_preference('permissions.default.stylesheet', 2)
        browser_options.set_preference('permissions.default.image', 2)
        browser_options.set_preference('dom.ipc.plugins.enabled.libflashplayer.so', 'false')
    return browser_options

def setup_proxy_server(tor_path, browser_options, url):
    print("Use Tor's SOCKS proxy server")
    torBrowser = os.popen(tor_path)

    print('Go to page', url)
    if type(browser_options) == ChromeOptions:
        browser_options.add_argument('--proxy-server=socks5://127.0.0.1:9050')
        return start_chrome(url, headless=False, options=browser_options)
    elif type(browser_options) == FirefoxOptions:
        browser_options.set_preference('network.proxy.type', 1)
        browser_options.set_preference('network.proxy.socks', '127.0.0.1')
        browser_options.set_preference('network.proxy.socks_port', 9050)
        browser_options.set_preference("network.proxy.socks_remote_dns", False)
        return start_firefox(url, headless=False, options=browser_options)

def setup_driver(tor_path, browser_options, url):
    browser_options = speed_up(browser_options)
    if not os.path.isfile(tor_path):
        print('Go to page', url)
        if type(browser_options) == ChromeOptions: 
            return start_chrome(url, headless=False)
        elif type(browser_options) == FirefoxOptions: 
            return  start_firefox(url, headless=False)
    return setup_proxy_server(tor_path, browser_options, url)