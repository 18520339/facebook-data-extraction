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
          window.prompt(
            "Token:",
            /(?<=accessToken\\":\\")(.*?)(?=\\")/.exec(text)[0]
          );
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
    const posts_screen = /(?<=set\=a\.)(.*?)(?=\&__cft__)/.exec(a.href);
    if (posts_screen && posts_screen[0]) {
      window.prompt(`Timeline Album ID của ${page_name}:`, posts_screen[0]) &&
        window.open("https://www.facebook.com/" + posts_screen[0]);
      return;
    }
  }
  window.prompt(
    "Không tìm thấy timeline album trong trang web!\nBạn có đang ở đúng trang web của 1 Page fb chưa?\nThử kéo xuống tới bài post nào có kèm hình ảnh rồi ấn lại bookmark nhé\nTrang web Ví dụ: ",
    "https://www.facebook.com/profile.php?id=100057998562930"
  );
})();

// Lấy user id (uid) - khi đang trong tường của người dùng muốn lấy user id. Ví dụ: https://www.facebook.com/callchoulnhe
javascript: (function () {
  const user_name = document.title;
  const list_a = document.querySelectorAll("a");
  for (let a of Array.from(list_a)) {
    const posts_screen = /(?<=set\=pb\.)(.*?)(?=\.)/.exec(a.href);
    if (posts_screen && posts_screen[0]) {
      window.prompt(`User ID của ${user_name}:`, posts_screen[0]);
      return;
    }

    const photos_screen = /(?<=set\=ecnf\.)(.*?)$/.exec(a.href);
    if (photos_screen && photos_screen[0]) {
      window.prompt(`User ID của ${user_name}:`, photos_screen[0]);
      return;
    }
  }
  window.prompt(
    "Không tìm thấy user id nào trong trang web!\nBạn có đang ở đúng trang profile chưa?\nTrang web Ví dụ: ",
    "https://www.facebook.com/callchoulnhe"
  );
})();

// Lấy group id - trường hợp url của group hiển thị tên chứ ko hiển thị id. Ví dụ: https://www.facebook.com/groups/j2team.community.girls
javascript: (function () {
  const group_name = document.title;
  const list_a = document.querySelectorAll("a");
  for (let a of Array.from(list_a)) {
    const found = /(?<=\/groups\/)(.*?)(?=\/user\/)/.exec(a.href);
    if (found && found[0]) {
      window.prompt(`GROUP ID của ${group_name}:`, found[0]);
      return;
    }
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
    const page_album_id = /(?<=\/photos\/a\.)(.*?)(?=\/)/.exec(a.href);
    if (page_album_id && page_album_id[0]) {
      window.prompt("PAGE ALBUM ID:", page_album_id[0]);
      return;
    }

    const group_album_id = /(?<=set\=oa\.)(.*?)($|(?=&))/.exec(a.href);
    if (group_album_id && group_album_id[0]) {
      window.prompt("GROUP ALBUM ID:", group_album_id[0]);
      return;
    }

    const user_album_id = /(?<=set\=a\.)(.*?)($|(?=&))/.exec(a.href);
    if (user_album_id && user_album_id[0]) {
      window.prompt("USER ALBUM ID:", user_album_id[0]);
      return;
    }
  }
  window.prompt(
    "Không tìm thấy Album id nào trong trang web!\nBạn có đang ở đúng trang album chưa?\nTrang web Ví dụ:",
    "https://www.facebook.com/media/set/?vanity=ColourfulSpace&set=a.945632905514659"
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
