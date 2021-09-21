javascript: (async () => {
  const access_token = window.prompt("Nhập access token: ");
  const fb_dtsg = access_token && window.prompt("Nhập fb_dtsg: ");

  if (!access_token || !fb_dtsg) return;

  const q =
    "viewer(){message_threads{nodes{thread_key{thread_fbid,other_user_id},all_participants{nodes{messaging_actor{name,gender,profile_picture}}},messages_count,name,image,thread_type}}}";

  try {
    const rawResponse = await fetch(
      `https://www.facebook.com/api/graphql?q=${q}&fb_dtsg=${fb_dtsg}`,
      {
        method: "POST",
      }
    );

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
