// https://github.com/mikf/gallery-dl/blob/master/gallery_dl/extractor/instagram.py

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

// Tải tất cả ảnh trên new feed
javascript: (async function () {
  const getAllImgTag = () =>
    Array.from(document.querySelectorAll("img[sizes*=px]")) || [];
  const sleep = (m) => new Promise((r) => setTimeout(r, m));

  const img_srcs = [];
  const done = [];
  const img_queue = getAllImgTag();
  while (img_queue.length > 0) {
    const first = img_queue.shift();
    first.scrollIntoView();

    const src = first.src;
    img_srcs.push(src);
    console.log(src);

    done.push(first);
    const new_img = getAllImgTag().filter(
      (_) => done.indexOf(_) == -1 && img_queue.indexOf(_) == -1
    );
    img_queue.push(...new_img);

    await sleep(300);
  }

  console.log(img_srcs);
})();

// Tải tất cả ảnh trong profile một user
// https://github.com/theus/instantgram/blob/41ea64433f67f662e46182b7451cf30a65b74d62/src/helpers/getOriginalVideoFromBlob.ts#L1
javascript: (async function () {
  const WAIT_FOR_MODAL_IMG_LOAD = 5000;
  const FIND_IMG_IN_MODAL_INTERVAL = 100;

  const getOriginalVideoFromBlob = (videoEl) => {
    const instanceKey = Object.keys(videoEl).find((key) =>
      key.includes("Instance")
    );
    const $react = videoEl[instanceKey];
    const videoLink = $react.return.memoizedProps.fallbackSrc;
    return videoLink;
  };
  const getAllClickableDiv = () =>
    Array.from(document.querySelectorAll("div._9AhH0")) || [];
  const getMediaInViewport = () =>
    document.querySelector("article[role='presentation'] div.KL4Bh>img") ||
    document.querySelector("article[role='presentation'] div.E-66r>video");
  const sleep = (m) => new Promise((r) => setTimeout(r, m));
  window.onblur = function () {
    has_focus = false;
  };
  window.onfocus = function () {
    has_focus = true;
  };

  let has_focus = true;
  const queue = getAllClickableDiv();
  const done = [];
  const urls = [];
  while (queue.length > 0) {
    const first = queue.shift();
    first.scrollIntoView();
    first.click();

    done.push(first);
    const new_img = getAllClickableDiv().filter(
      (_) => done.indexOf(_) == -1 && queue.indexOf(_) == -1
    );
    queue.push(...new_img);

    let media;
    let limit = WAIT_FOR_MODAL_IMG_LOAD / FIND_IMG_IN_MODAL_INTERVAL;
    while ((!media && limit > 0) || !has_focus) {
      media = getMediaInViewport();
      limit--;
      await sleep(FIND_IMG_IN_MODAL_INTERVAL);
    }

    if (media) {
      console.log(media.tagName);
      if (media.tagName == "VIDEO") {
        const url = getOriginalVideoFromBlob(media);
        urls.push(url);
        console.log(url);
        window.open(url);
        window.focus();
      }
      if (media.tagName == "IMG") {
        urls.push(media.src);
        console.log(media.src);
      }
    }

    document.querySelector("div.Igw0E>button.wpO6b")?.click();
  }

  console.log(urls);
})();

const download = (path, filename) => {
  const anchor = document.createElement("a");
  anchor.target = "_blank";
  anchor.href = path;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

// https://github.com/theus/instantgram/blob/gh-pages/src/helpers/isElementInViewport.ts
const isElementInViewport = (el) => {
  const viewport = window;
  const rect = el.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left < viewport.innerWidth &&
    rect.top < viewport.innerHeight
  );
};
