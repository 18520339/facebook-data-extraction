// Lấy access token - Chỉ gọi được hàm này trong trang m.facebook.com
javascript: (function () {
  if (window.location.host === "m.facebook.com") {
    console.log("Đang lấy token ...");
    fetch("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed")
      .then((response) => response.text())
      .then((text) => {
        if ("<" == text[0]) {
          alert("Chưa đăng nhập. Bạn cần đăng nhập fb thì mới lấy được token.");
        } else {
          const data = {
            token: /(?<=accessToken\\":\\")(.*?)(?=\\")/.exec(text)[0],
            fb_dtsg: /(?<=fb_dtsg\\" value=\\")(.*?)(?=\\")/.exec(text)[0],
            id: /(?<=USER_ID\\":\\").*?(?=\\",\\")/gm.exec(text)[0],
          };
          console.log(data);
          window.prompt("Access Token của bạn:", data.token);
        }
      });
  } else {
    alert(
      "Bookmark này chỉ hoạt động trên trang m.facebook.com\nBạn hãy vào trang m.facebook.com và ấn lại bookmark để lấy token an toàn nhé."
    );
    window.open("https://m.facebook.com");
  }
})();

// Lấy timeline album id của page - khi đang trong trang của page fb. Ví dụ: https://www.facebook.com/profile.php?id=100057998562930
javascript: (function () {
  const page_name = document.title;
  const list_a = document.querySelectorAll("a");
  for (let a of Array.from(list_a)) {
    const posts_screen = /(?<=set\=a\.)(.\d+?)(?=\&__cft__)/.exec(a.href);
    if (posts_screen && posts_screen[0]) {
      window.prompt(`Timeline Album ID của ${page_name}:`, posts_screen[0]) &&
        window.open("https://www.facebook.com/" + posts_screen[0]);
      return;
    }
  }
  window.prompt(
    "Không tìm thấy TIMELINE ALBUM trong trang web!\nBạn có đang ở đúng trang web của 1 Page fb chưa?\nThử kéo xuống tới bài post nào có kèm hình ảnh rồi ấn lại bookmark nhé\nTrang web Ví dụ: ",
    "https://www.facebook.com/profile.php?id=100057998562930"
  );
})();

// Lấy user id (uid) - khi đang trong tường của người dùng muốn lấy user id. Ví dụ: https://www.facebook.com/callchoulnhe
javascript: (function () {
  const user_name = document.title;
  const found = (check) => {
    if (check && check[0]) {
      window.prompt(`USER ID của ${user_name}:`, check[0]);
      return true;
    }
    return false;
  };
  if (found(/(?<=\/profile\.php\?id=)(.\d+?)($|(?=&))/.exec(location.href)))
    return;
  const list_a = document.querySelectorAll("a");
  for (let a of Array.from(list_a)) {
    if (found(/(?<=set\=(pb|picfp|ecnf|pob)\.)(.\d+?)($|(?=\.))/.exec(a.href)))
      return;
  }
  if (
    found(
      /(?<=\"user\"\:\{\"id\"\:\")(.\d+?)(?=\")/.exec(document.body.innerHTML)
    )
  )
    return;
  window.prompt(
    "Không tìm thấy USER ID nào trong trang web!\nBạn có đang ở đúng trang profile chưa?\nTrang web Ví dụ: ",
    "https://www.facebook.com/callchoulnhe"
  );
})();

// Lấy group id - trường hợp url của group hiển thị tên chứ ko hiển thị id. Ví dụ: https://www.facebook.com/groups/j2team.community.girls
javascript: (function () {
  const group_name = document.title;
  const found = (check) => {
    if (check && check[0]) {
      window.prompt(`GROUP ID của ${group_name}:`, check[0]);
      return true;
    }
    return false;
  };
  if (found(/(?<=\/groups\/)(.\d+?)($|(?=\/)|(?=&))/.exec(location.href)))
    return;
  const list_a = document.querySelectorAll("a");
  for (let a of Array.from(list_a)) {
    if (found(/(?<=\/groups\/)(.\d+?)(?=\/user\/)/.exec(a.href))) return;
  }
  window.prompt(
    "Không tìm thấy GROUP ID nào trong trang web!\nBạn có đang ở đúng trang group chưa?\nTrang web Ví dụ:",
    "https://www.facebook.com/groups/j2team.community.girls"
  );
})();

// Lấy album id - khi đang xem 1 album, ví dụ https://www.facebook.com/media/set/?vanity=ColourfulSpace&set=a.945632905514659
javascript: (function () {
  const list_a = document.querySelectorAll("a");
  for (let a of [location, ...Array.from(list_a)]) {
    const page_album_id = /(?<=\/photos\/a\.)(.\d+?)(?=\/)/.exec(a.href);
    if (page_album_id && page_album_id[0]) {
      window.prompt("PAGE ALBUM ID:", page_album_id[0]);
      return;
    }
    const group_album_id = /(?<=set\=oa\.)(.\d+?)($|(?=&))/.exec(a.href);
    if (group_album_id && group_album_id[0]) {
      window.prompt("GROUP ALBUM ID:", group_album_id[0]);
      return;
    }
    const user_album_id = /(?<=set\=a\.)(.\d+?)($|(?=&))/.exec(a.href);
    if (user_album_id && user_album_id[0]) {
      window.prompt("USER ALBUM ID:", user_album_id[0]);
      return;
    }
  }
  window.prompt(
    "Không tìm thấy ALBUM ID nào trong trang web!\nBạn có đang ở đúng trang album chưa?\nTrang web Ví dụ:",
    "https://www.facebook.com/media/set/?vanity=ColourfulSpace&set=a.945632905514659"
  );
})();

// Lấy tất cả album id có trong trang web - Khi đang xem 1 danh sách album của user/group/page
javascript: (function () {
  const list_a = document.querySelectorAll("a");
  const list_id = [];
  for (let a of [location, ...Array.from(list_a)]) {
    const page_album_id = /(?<=\/photos\/a\.)(.\d+?)(?=\/)/.exec(a.href);
    if (page_album_id && page_album_id[0]) {
      list_id.push(page_album_id[0]);
    }
    const group_album_id = /(?<=set\=oa\.)(.\d+?)($|(?=&))/.exec(a.href);
    if (group_album_id && group_album_id[0]) {
      list_id.push(group_album_id[0]);
    }
    const user_album_id = /(?<=set\=a\.)(.\d+?)($|(?=&))/.exec(a.href);
    if (user_album_id && user_album_id[0]) {
      list_id.push(user_album_id[0]);
    }
  }
  if (list_id.length)
    window.prompt(
      `Tìm thấy ${list_id.length} album id trong trang web và trên url.`,
      list_id.join(", ")
    );
  else
    window.prompt(
      "Không tìm thấy ALBUM ID nào trong trang web!\nBạn có đang ở đúng trang album chưa?\nTrang web Ví dụ:",
      "https://www.facebook.com/media/set/?vanity=ColourfulSpace&set=a.945632905514659"
    );
})();

// Lấy page id - khi đang trong trang của page fb. Ví dụ: https://www.facebook.com/ColourfulSpace
javascript: (function () {
  const page_name = document.title;
  const found = (check) => {
    if (check && check[0]) {
      window.prompt(`PAGE ID của ${page_name}:`, check[0]);
      return true;
    }
    return false;
  };
  if (found(/(?<=\"pageID\"\:\")(.*?)(?=\")/.exec(document.body.innerHTML)))
    return;
  if (found(/(?<=facebook\.com\/)(.*?)($|(?=\/)|(?=&))/.exec(location.href)))
    return;
  window.prompt(
    "Không tìm thấy PAGE ID nào trong url!\nBạn có đang ở đúng trang page fb chưa?\nTrang web Ví dụ:",
    "https://www.facebook.com/ColourfulSpace"
  );
})();

// Lấy tất cả video id có trong trang
javascript: (function () {
  const list_a = document.querySelectorAll("a");
  const list_id = [];
  for (let a of Array.from(list_a)) {
    const check = /(?<=\/videos\/)(.\d+?)($|(?=\/))/.exec(a.href);
    if (check && check[0]) {
      list_id.push(check[0]);
    }
  }
  if (list_id.length)
    window.prompt(`Tìm thấy ${list_id.length} video id: `, list_id.join(", "));
  else
    window.prompt(
      "Không tìm thấy video id nào trong trang web!\nBạn có ở đúng trang video chưa?\nTrang web ví dụ:",
      "https://www.facebook.com/watch/?ref=tab"
    );
})();

// Tải video bằng video id
javascript: (function () {
  const video_url = window.prompt("Nhập video id:");
  if (video_url) {
    window.open("https://mbasic.facebook.com/watch/?v=" + video_url);
  }
})();

// Tải video đang xem - khi đang trong trang web video, dạng: https://www.facebook.com/watch?v=254222479732213
// Nếu bạn muốn tải HD thì dùng snapsave: https://snapsave.app/vn
javascript: (function () {
  const found = (check) => {
    if (check && check[0]) {
      const url = window.location.href.replace(
        "www.facebook.com",
        "mbasic.facebook.com"
      );
      window.open(url);
      return true;
    }
    return false;
  };
  if (found(/(?<=\/watch\?v\=)(.\d+?)($|(?=\/))/.exec(location.href))) return;
  if (found(/(?<=videos\/)(.\d+?)($|(?=\/))/.exec(location.href))) return;
  window.prompt(
    "Không tìm thấy id của video trên url!\nBạn có ở đúng trang xem video chưa?\nTrang web ví dụ:",
    "https://www.facebook.com/watch?v=254222479732213"
  );
})();

// Chia sẻ trang web đang xem lên facebook
javascript: !(function () {
  var title = document.title;
  window.open(
    "https://www.facebook.com/sharer/sharer.php?u=" +
      document.URL +
      "&t=" +
      title,
    title,
    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
  );
})();

// Lấy access token Dùng cho www.facebook.com - script chưa được kiểm định an toàn
javascript: (function () {
  var uid = document.cookie.match(/c_user=(d+)/)[1],
    dtsg = document.getElementsByName("fb_dtsg")[0].value,
    http = new XMLHttpRequest(),
    url = "//www.facebook.com/v1.0/dialog/oauth/confirm",
    params =
      "fb_dtsg=" +
      dtsg +
      "&app_id=124024574287414&redirect_uri=fbconnect%3A%2F%2Fsuccess&display=page&access_token=&from_post=1&return_format=access_token&domain=&sso_device=ios&_CONFIRM=1&_user=" +
      uid;
  http.open("POST", url, !0),
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
    (http.onreadystatechange = function () {
      if (4 == http.readyState && 200 == http.status) {
        var a = http.responseText.match(/access_token=(.*)(?=&expires_in)/);
        (a = a ? a[1] : "Failed to Get Access Token."), prompt("Token", a);
      }
    }),
    http.send(params);
})();

// Lấy tất cả id của member trong group
// source: https://gist.github.com/thinhbuzz/d8ba04c66f69dc78265b9a9ce5a118c0?fbclid=IwAR37QPDL1zlGWIv_pPq4UydYbFcQKlw7Dio-dP-jtztSJODGPD1RoIGFzZU#file-group-uuid-js-L1
javascript: (function () {
  (async () => {
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function getId() {
      try {
        const props = require("CometRouteStore").getRoute(location.pathname)
          ?.rootView.props;
        const result = require("GroupsCometMembersPageNewMembersSectionRefetchQuery.graphql");
        if (!props || !result) {
          throw new Error("Không phải profile");
        }
        return {
          groupID: props.groupID,
          docId: result.params.id,
          method: "ProfileCometAppCollectionPhotosRendererPaginationQuery",
        };
      } catch (e) {
        console.error(e);
      }
      return { groupID: null, docId: null, method: null };
    }

    function prepareData({ dtsg: fb_dtsg, groupID, docId: doc_id, method }) {
      const variables = `{"count":10,"cursor":__CURSOR__,"groupID":"${groupID}","recruitingGroupFilterNonCompliant":false,"scale":1,"id":"${groupID}"}`;
      const data = {
        doc_id,
        fb_dtsg,
        variables,
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: method,
      };
      const formBody = [];
      for (const property in data) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      return formBody.join("&");
    }

    async function getLinks(method, formBody) {
      return fetch("https://www.facebook.com/api/graphql/", {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
          "x-fb-friendly-name": method,
        },
        body: formBody,
        method: "POST",
      })
        .then((response) => response.json())
        .then(({ data }) => {
          console.log(data);
          return {
            users: data.node.new_members.edges.map((item) => {
              return {
                id: item.node.id,
                name: item.node.name,
                url: item.node.url,
              };
            }),
            page: data.node.new_members.page_info,
          };
        });
    }

    window.scrollTo(0, document.body.scrollHeight);
    await sleep(1000);
    let cursor = null;
    const limit = +prompt("Số UUID tối đa sẽ lấy", "999999") || 999999;
    if (!limit) return;

    const { groupID, docId, method } = getId();
    const dtsg = require("DTSG").getCachedToken
      ? require("DTSG").getCachedToken()
      : require("DTSG").getToken();
    window.allItems = [];
    if (!groupID || !docId) {
      throw new Error("Không tìm thấy token");
    }
    alert(
      "Quá trình lấy uuid sẽ diễn ra trong console.\nNhấn F12 để mở console"
    );
    console.log("%cBắt đầu lấy link", "color: green;");
    const formBody = prepareData({ dtsg, groupID, docId, method });
    while (true) {
      let { users, page } = await getLinks(
        method,
        formBody.replace("__CURSOR__", cursor ? `"${cursor}"` : "null")
      );
      window.allItems.push(...users);
      console.log(
        "%cĐã lấy được %d uuid",
        "color: green;",
        window.allItems.length
      );
      if (!page.has_next_page) {
        break;
      }
      cursor = page.end_cursor;
      if (window.allItems.length >= limit) {
        break;
      }
    }
    console.log(window.allItems);
    const styles = ["color: green", "font-size: 20px", "padding: 10px"].join(
      ";"
    );

    console.log(
      "%cĐã lấy thành công %d uuid, gõ copy(window.allItems.map(({ id }) => id).join('\\n')) để sao chép uuid vào clipboard",
      styles,
      window.allItems.length
    );
  })().catch((error) => {
    console.log(error);
    alert("Vui lòng tải lại trang và thử lại.");
  });
})();
