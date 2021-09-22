// Lấy access token - chỉ gọi được hàm này trong trang www.instagram.com VÀ đã đăng nhập
javascript: (function () {
  try {
    const encoded = document.cookie
      .split("; ")
      ?.find((_) => _.startsWith("fbsr"))
      ?.split(".")[1];
    if (encoded) {
      const decoded = JSON.parse(atob(encoded));
      console.log(decoded);
      window.prompt("Access token: ", decoded.oauth_token);
    } else {
      alert(
        "Không tìm thấy thông tin access token trong cookie!\nBạn đã đăng nhập instagram chưa??"
      );
    }
  } catch (e) {
    alert("Lỗi: " + e.toString());
  }
})();

// Lấy user id - Chỉ gọi được hàm này trong trang instagram.com
javascript: (function () {
  if (window.location.host === "www.instagram.com") {
    console.log("Đang lấy user id ...");
    fetch(location.href + "?__a=1")
      .then((response) => response.json())
      .then((json) => {
        const {
          fbid,
          id,
          username,
          full_name,
          profile_pic_url_hd,
          profile_pic_url,
          edge_owner_to_timeline_media,
        } = json.graphql.user;
        console.log(json.graphql.user);
        window.prompt(`User ID của ${username}:`, id);
      })
      .catch((e) => {
        alert("Lỗi: " + e.toString());
      });
  } else {
    alert(
      "Bookmark này chỉ hoạt động trên trang www.instagram.com\nBạn hãy vào trang www.instagram.com và ấn lại bookmark để lấy token an toàn nhé."
    );
    window.open("https://www.instagram.com");
  }
})();
