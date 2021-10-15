import { FB_API_HOST, MEDIA_TYPE, S } from "./constants.js";
import {
  ACCESS_TOKEN,
  FOLDER_TO_SAVE_COMMENT_POST,
  WAIT_BEFORE_NEXT_FETCH,
} from "../config.js";
import { deleteFile, myFetch, saveToFile, sleep } from "./utils.js";

const refactorReaction = (object) => {
  return (({
    updated_time,
    reactions_like,
    reactions_love,
    reactions_haha,
    reactions_wow,
    reactions_sad,
    reactions_angry,
    ...rest
  }) => {
    return {
      ...rest,
      reactions: {
        like: reactions_like.summary.total_count,
        love: reactions_love.summary.total_count,
        haha: reactions_haha.summary.total_count,
        wow: reactions_wow.summary.total_count,
        sad: reactions_sad.summary.total_count,
        angry: reactions_angry.summary.total_count,
      },
    };
  })(object);
};

const fetchWallPostComment = async ({
  targetId,
  setLimit, // Số lần fetch, mỗi lần fetch được khoảng 25 bài post (?)
  pageFetchedCallback = () => {},
}) => {
  let all_posts,
    fetchPosts,
    fetchComments,
    set = 1;
  let postsQueryUrl =
    `${FB_API_HOST}/${targetId}/feed?fields=permalink_url,updated_time,message,` +
    "reactions.type(LIKE).limit(0).summary(total_count).as(reactions_like)," +
    "reactions.type(LOVE).limit(0).summary(total_count).as(reactions_love)," +
    "reactions.type(HAHA).limit(0).summary(total_count).as(reactions_haha)," +
    "reactions.type(WOW).limit(0).summary(total_count).as(reactions_wow)," +
    "reactions.type(SAD).limit(0).summary(total_count).as(reactions_sad)," +
    "reactions.type(ANGRY).limit(0).summary(total_count).as(reactions_angry)," +
    "shares,comments.limit(0).summary(true)" +
    `&limit=10&access_token=${ACCESS_TOKEN}`;
  // fcodefpt/feed?fields=permalink_url,id,updated_time,message,reactions.type(LIKE).limit(0).summary(total_count).as(reactions_like),reactions.type(LOVE).limit(0).summary(total_count).as(reactions_love),reactions.type(HAHA).limit(0).summary(total_count).as(reactions_haha),reactions.type(WOW).limit(0).summary(total_count).as(reactions_wow),reactions.type(SAD).limit(0).summary(total_count).as(reactions_sad),reactions.type(ANGRY).limit(0).summary(total_count).as(reactions_angry),shares&limit=1
  while (postsQueryUrl && set <= setLimit) {
    console.log(`ĐANG TẢI THÔNG TIN BỘ POST THỨ ${set}...`);
    all_posts = [];
    fetchPosts = await myFetch(postsQueryUrl);
    set++;

    if (fetchPosts?.data) {
      await Promise.all(
        fetchPosts.data.map(async (feedData) => {
          const postId = feedData.id;
          let postsDetail = refactorReaction(feedData);
          postsDetail = (({ updated_time, shares, comments, ...rest }) => {
            return {
              ...rest,
              updated_time: new Date(updated_time).getTime(),
              total_shares: shares ? shares.count : 0,
              total_cmt: comments.summary.total_count,
            };
          })(postsDetail);

          let comments = [];
          let commentsQueryUrl =
            `${FB_API_HOST}/${postId}/comments?fields=` +
            "comments{comments.limit(100),message,created_time,attachment{media}," +
            "reactions.type(LIKE).limit(0).summary(total_count).as(reactions_like)," +
            "reactions.type(LOVE).limit(0).summary(total_count).as(reactions_love)," +
            "reactions.type(HAHA).limit(0).summary(total_count).as(reactions_haha)," +
            "reactions.type(WOW).limit(0).summary(total_count).as(reactions_wow)," +
            "reactions.type(SAD).limit(0).summary(total_count).as(reactions_sad)," +
            "reactions.type(ANGRY).limit(0).summary(total_count).as(reactions_angry)" +
            "},message,created_time," +
            "reactions.type(LIKE).limit(0).summary(total_count).as(reactions_like)," +
            "reactions.type(LOVE).limit(0).summary(total_count).as(reactions_love)," +
            "reactions.type(HAHA).limit(0).summary(total_count).as(reactions_haha)," +
            "reactions.type(WOW).limit(0).summary(total_count).as(reactions_wow)," +
            "reactions.type(SAD).limit(0).summary(total_count).as(reactions_sad)," +
            "reactions.type(ANGRY).limit(0).summary(total_count).as(reactions_angry)" +
            `&limit=100&access_token=${ACCESS_TOKEN}`;
          while (commentsQueryUrl) {
            fetchComments = await myFetch(commentsQueryUrl);
            await Promise.all(
              fetchComments.data.map(async (comment) => {
                let commentsQueryUrlV2 = comment?.comments?.paging?.next;
                let commentsV2;
                if (comment.comments) {
                  commentsV2 = comment.comments.data.map((comment) => {
                    return refactorReaction(comment);
                  });
                } else commentsV2 = [];
                while (commentsQueryUrlV2) {
                  const fetchCommentsV2 = await myFetch(commentsQueryUrlV2);

                  commentsV2 = [
                    ...commentsV2,
                    ...fetchCommentsV2.data.map((comment) => {
                      return refactorReaction(comment);
                    }),
                  ];
                  commentsQueryUrlV2 = fetchCommentsV2?.paging?.next;

                  if (WAIT_BEFORE_NEXT_FETCH) {
                    console.log(`ĐANG TẠM DỪNG ${WAIT_BEFORE_NEXT_FETCH}ms...`);
                    await sleep(WAIT_BEFORE_NEXT_FETCH);
                  }
                }

                const tempComments = refactorReaction(comment);
                comments.push({ ...tempComments, comments: commentsV2 });
              })
            );
            commentsQueryUrl = fetchComments?.paging?.next;

            if (WAIT_BEFORE_NEXT_FETCH) {
              console.log(`ĐANG TẠM DỪNG ${WAIT_BEFORE_NEXT_FETCH}ms...`);
              await sleep(WAIT_BEFORE_NEXT_FETCH);
            }
          }

          postsDetail.comments = comments;
          postsQueryUrl = fetchPosts?.paging?.next;
          all_posts.push(postsDetail);
        })
      );

      // callback when each page fetched
      await pageFetchedCallback(all_posts);

      // get next paging
      postsQueryUrl = fetchPosts?.paging?.next;

      // wait for next fetch - if needed
      if (WAIT_BEFORE_NEXT_FETCH) {
        console.log(`ĐANG TẠM DỪNG ${WAIT_BEFORE_NEXT_FETCH}ms...`);
        await sleep(WAIT_BEFORE_NEXT_FETCH);
      }
    } else {
      break;
    }
  }

  return all_posts;
};

export const downloadWallPostComment = async ({ targetId, setLimit }) => {
  console.log(`ĐANG TẢI DỮ LIỆU TRÊN TƯỜNG CỦA ${targetId}...`);

  const fileName = `${FOLDER_TO_SAVE_COMMENT_POST}/${targetId}.txt`;
  deleteFile(fileName);

  await fetchWallPostComment({
    targetId: targetId,
    setLimit: setLimit,
    pageFetchedCallback: (posts) => {
      saveToFile(
        fileName,
        posts.map((post) => JSON.stringify(post)).join("\n"),
        false
      );
    },
  });
};
