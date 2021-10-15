// Hiển thị nút download cho tất cả video trong trang web
javascript: (function () {
  Array.from(document.querySelectorAll("video")).map(
    (_) => (_.attributes.controlslist.value = "nofullscreen noremoteplayback")
  );
})();

// Tải video trong story đang xem
javascript: (function () {
  const src = document.querySelector("video")?.src;
  if (src) window.open(src);
  else alert("Không tìm thấy video story nào");
})();

// Tải video đang xem
javascript: (function () {
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.left < window.innerWidth &&
      rect.top < window.innerHeight
    );
  };
  for (let v of Array.from(document.querySelectorAll("video")))
    if (isElementInViewport(v) && v.src) return window.open(v.src);
  alert(
    "Không tìm thấy video nào, hãy scroll tới khi nào video tự động phát rồi ấn lại bookmark nhé."
  );
})();

// Tải tất cả video trong profile của 1 user - Chưa ổn định, chỉ hiển thị video url ra console
javascript: (async function () {
  const WAIT_FOR_FULL_VIDEO_LOADED = 5000;
  const FIND_FULL_VIDEO_INTERVAL = 100;

  const sleep = (m) => new Promise((r) => setTimeout(r, m));
  const getAllVideo = () =>
    Array.from(document.querySelectorAll('img[loading="lazy"].object-cover'));
  const getFullVideo = () => document.querySelector("video");
  const closeFullVideo = () =>
    document.querySelector("div.top-8.left-4")?.click();

  const queue = getAllVideo();
  while (queue.length > 0) {
    const first = queue.shift();
    first.scrollIntoView();
    first.click();

    let full_video;
    let limit = WAIT_FOR_FULL_VIDEO_LOADED / FIND_FULL_VIDEO_INTERVAL;
    while (!full_video && limit > 0) {
      full_video = getFullVideo();
      limit--;
      await sleep(FIND_FULL_VIDEO_INTERVAL);
    }

    if (full_video) {
      console.log(full_video.src);
    } else {
      console.log("Not found full video");
    }

    closeFullVideo();
    await sleep(500);
  }
})();
