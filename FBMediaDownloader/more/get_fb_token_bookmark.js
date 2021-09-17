
// Chỉ dùng cho trang m.facebook.com
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
      "Bookmark này chỉ hoạt động trên trang m.facebook.com\nBạn hãy vào trang trên và ấn lại bookmark để lấy token an toàn nhé."
    );
    window.open("https://m.facebook.com");
  }
})();

// Dùng cho www.facebook.com - script chưa được kiểm định an toàn
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
