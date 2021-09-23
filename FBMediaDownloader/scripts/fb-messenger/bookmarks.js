// get logged_in user_id: require("CurrentUserInitialData").USER_ID || document.cookie.match(/c_user=([0-9]+)/)[1]

javascript: (async () => {
  const fb_dtsg =
    require("DTSGInitialData").token ||
    document.querySelector('[name="fb_dtsg"]').value;
  const access_token = window.prompt("Nhập access token: ");

  if (!access_token || !fb_dtsg) return;

  const q =
    "viewer(){message_threads{nodes{thread_key{thread_fbid,other_user_id},all_participants{nodes{messaging_actor{name,gender,profile_picture}}},messages_count,name,image,thread_type}}}";

  try {
    const rawResponse = await fetch(`https://www.facebook.com/api/graphql`, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: `q=${q}&fb_dtsg=${fb_dtsg}`,
      referrer: "https://www.facebook.com/",
      mode: "cors",
      credentials: "include",
    });

    const json = await rawResponse.json();
    console.log(json);

    const data = [];
    json?.viewer.message_threads.nodes.forEach((t) => {
      "ONE_TO_ONE" == t.thread_type
        ? data.push({
            messages_count: t.messages_count,
            other_user_id: t.thread_key.other_user_id,
            name: t.all_participants.nodes[0].messaging_actor.name,
            image: `https://graph.facebook.com/${t.thread_key.other_user_id}/picture?width=200&height=200&access_token=${access_token}`,
            type: "Riêng tư",
          })
        : "GROUP" == t.thread_type &&
          data.push({
            messages_count: t.messages_count,
            other_user_id: t.thread_key.thread_fbid,
            name: t.name,
            image: t.image?.uri,
            type: "Nhóm",
          });
    });

    data.sort((t, e) => e.messages_count - t.messages_count);

    console.log(data);
    alert("Đã hiển thị dữ liệu tin nhắn trong console.");
  } catch (e) {
    alert("ERROR: " + e.toString());
  }
})();

// https://www.facebook.com/ajax/profile/removefriendconfirm.php?dpr=1
// https://www.facebook.com/api/graphqlbatch/
// https://www.facebook.com/ajax/mercury/delete_thread.php

const locmai = {
  post_q:
    "node(958865924218839){timeline_feed_units.first(10).after(){page_info,edges{node{id,creation_time,can_viewer_edit_post_privacy,message{text},privacy_scope{type},feedback{reactors{count},comments{count},reshares{count}}}}}}",
  mes_q:
    "viewer(){message_threads{count,nodes{customization_info{emoji,outgoing_bubble_color,participant_customizations{participant_id,nickname}},all_participants{nodes{messaging_actor{name,id,profile_picture}}},thread_type,name,messages_count,image,id}}}",
  mes2_q:
    "viewer(){message_threads{nodes{thread_key{thread_fbid,other_user_id},messages_count,thread_type,updated_time_precise}}}",
};

// https://www.thetechbasket.com/most-useful-bookmarklets/
// https://www.online-tech-tips.com/cool-websites/the-12-best-bookmarklets-every-browser-should-have/

// Tìm google cho trang web hiện tại
javascript: (function () {
  const q = prompt("What are you looking for?", "");
  if (q)
    window.location.href =
      "http://www.google.com/search?q=site%3A" +
      window.location.host +
      " " +
      escape(q);
})();

// View wayback url
javascript: location.href = "https://web.archive.org/web/*/" + location.href;

// Share on fb
javascript: (function () {
  var d = document,
    f = "https://www.facebook.com/share",
    l = d.location,
    e = encodeURIComponent,
    p = ".php?src=bm&v=4&i=1563462283&u=" + e(l.href) + "&t=" + e(d.title);
  1;
  try {
    if (!/^(.*\.)?facebook\.[^.]*$/.test(l.host)) throw 0;
    share_internal_bookmarklet(p);
  } catch (z) {
    a = function () {
      if (
        !window.open(
          f + "r" + p,
          "sharer",
          "toolbar=0,status=0,resizable=1,width=626,height=436"
        )
      )
        l.href = f + p;
    };
    if (/Firefox/.test(navigator.userAgent)) setTimeout(a, 0);
    else {
      a();
    }
  }
})();

// View hidden passwork
javascript: (function () {
  var s, F, j, f, i;
  s = "";
  F = document.forms;
  for (j = 0; j < F.length; ++j) {
    f = F[j];
    for (i = 0; i < f.length; ++i) {
      if (f[i].type.toLowerCase() == "password") s += f[i].value + "\n";
    }
  }
  if (s) alert("Passwords in forms on this page:\n\n" + s);
  else alert("There are no passwords in forms on this page.");
})();

// Enable right click
javascript: void (document.oncontextmenu = null);

// Enable text selection
javascript: (function () {
  function R(a) {
    ona = "on" + a;
    if (window.addEventListener)
      window.addEventListener(
        a,
        function (e) {
          for (var n = e.originalTarget; n; n = n.parentNode) n[ona] = null;
        },
        true
      );
    window[ona] = null;
    document[ona] = null;
    if (document.body) document.body[ona] = null;
  }
  R("click");
  R("mousedown");
  R("mouseup");
  R("selectstart");
})();

// Find shared login account
javascript: (function () {
  var url = "http://www.bugmenot.com/view/" + escape(location.hostname);
  w = open(
    url,
    "w",
    "location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,width=500,height=400,modal=yes,dependent=yes"
  );
  if (w) {
    setTimeout("w.focus()", 1000);
  } else {
    location = url;
  }
})();

// Get biggest instagram image
// https://theus.github.io/instantgram/

// Convert page to pdf
javascript: void window.open("https://www.web2pdfconvert.com#" + location.href);
