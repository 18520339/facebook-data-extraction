# Run JS code directly at the DevTools Console

Simply to say, this method is just another automation one, the same as the [2nd method](#2) but without using any IP hiding techniques. You just directly write & run JS code in the [DevTools Console](https://developer.chrome.com/docs/devtools/open) of your browser, so it's quite convenient, not required to setup anything.

- You can take a look at this [extremely useful project](https://github.com/jayremnt/facebook-scripts-dom-manipulation) which includes many automation scripts (not just about data extraction) with no Access Token needed for Facebook users by directly manipulating the DOM.
  
- Here's my example script to collect comments on **a Facebook page when not sign-in**:
   
```js
// Go to the page you want to collect, wait until it finishes loading.
// Open the DevTools Console on the Browser and run the following code
let csvContents = [['UserId', 'Name', 'Comment']];
let cmtsSelector = '.userContentWrapper .commentable_item';

// 1. Click see more comments
// If you want more, just wait until the loading finishes and run this again
moreCmts = document.querySelectorAll(cmtsSelector + ' ._4sxc._42ft');
moreCmts.forEach(btnMore => btnMore.click());

// 2. Collect all comments
comments = document.querySelectorAll(cmtsSelector + ' ._72vr');
comments.forEach(cmt => {
    let info = cmt.querySelector('._6qw4');
    let userId = info.getAttribute('href')?.substring(1);
    let content = cmt.querySelector('._3l3x>span')?.innerText;
    csvContents.push([userId, info.innerText, content]);
});
csvContents.map(cmt => cmt.join('\t')).join('\n');
```

<details>
    <summary>
        <b>Example result for the script above</b>
    </summary><br/>

| UserId          | Name           | Comment                            |
| --------------  | -------------- | ---------------------------------- |
| freedomabcxyz   | Freedom        | Sau khi dùng                       |
| baodendepzai123 | Bảo Huy Nguyễn | nhưng mà thua                      |
| tukieu.2001     | Tú Kiều        | đang xem hài ai rãnh xem quãng cáo |
| ABCDE2k4        | Maa Vănn Kenn  | Lê Minh Nhất                       |
| buikhanhtoanpro | Bùi Khánh Toàn | Haha                               |

</details>