import { FB_API_HOST, MEDIA_TYPE } from "./constants.js";
import {
  ACCESS_TOKEN,
  FOLDER_TO_SAVE_FEED_MEDIA,
  FOLDER_TO_SAVE_LINKS,
  ID_LINK_SEPERATOR,
  PHOTO_FILE_FORMAT,
  VIDEO_FILE_FORMAT,
} from "../config.js";
import {
  createIfNotExistDir,
  deleteFile,
  downloadFileSync,
  limit,
  myFetch,
  saveToFile,
} from "./utils.js";

// Lấy ra các thông tin cần thiết (id, ảnh, video) từ dữ liệu attachment.
const getMediaFromAttachment = (attachment) => {
  const filtered_media = [];

  let id = attachment?.target?.id;
  let type = attachment?.type;

  if (!id || !type) return filtered_media;

  /*
    Attachment LOẠI PHOTO có cấu trúc như sau
    {
        "media": {
            "image": {
                "height": 720,
                "src": "https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/p480x480/233193975_582887376210934_3917501890611553539_n.jpg?_nc_cat=103&ccb=1-5&_nc_sid=07e735&_nc_ohc=b2Z1BxAj3PwAX_a0j-F&_nc_ht=scontent.fhan2-4.fna&oh=1100b63609d1d331a0a17721b002ae78&oe=614A6EAD",
                "width": 480
            }
        },
        "target": {
            "id": "582887366210935",
            "url": "https://www.facebook.com/photo.php?fbid=582887366210935&set=gm.1020873538672374&type=3"
        },
        "type": "photo",
        "url": "https://www.facebook.com/photo.php?fbid=582887366210935&set=gm.1020873538672374&type=3"
    }*/
  if (type === "photo") {
    filtered_media.push({
      type: MEDIA_TYPE.PHOTO,
      id: id,
      url: attachment.media.image.src,
    });
  }

  /*
    Attachment LOẠI VIDEO_AUTOPLAY, VIDEO_INLINE, VIDEO có định dạng như sau
    {
        "media": {
            "image": {
                "height": 720,
                "src": "https://scontent.fsgn2-4.fna.fbcdn.net/v/t15.5256-10/s720x720/241870607_843209866352821_4272847571535179706_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=ad6a45&_nc_ohc=Ap2YChXA4fUAX_RgBT7&_nc_ht=scontent.fsgn2-4.fna&oh=f9fcc65d6c8a53207c1d03b19d036503&oe=614B4EE9",
                "width": 405
            },
            "source": "https://video.fsgn2-6.fna.fbcdn.net/v/t42.1790-2/241979905_562868464766358_5763545655575200708_n.mp4?_nc_cat=110&ccb=1-5&_nc_sid=985c63&efg=eyJybHIiOjM5MiwicmxhIjo1MTIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIn0%3D&_nc_ohc=1vx2K2s8m1IAX8TzDPs&rl=392&vabr=218&_nc_ht=video.fsgn2-6.fna&oh=32df5af4a31f119a16ca4fb8d30b48f0&oe=61477791"
        },
        "target": {
            "id": "843209423019532",
            "url": "https://www.facebook.com/groups/j2team.community.girls/permalink/1045907852835609/"
        },
        "type": "video_autoplay",
        "url": "https://www.facebook.com/groups/j2team.community.girls/permalink/1045907852835609/"
    } */
  if (
    type === "video_autoplay" ||
    type === "video_inline" ||
    type === "video"
  ) {
    filtered_media.push({
      type: MEDIA_TYPE.VIDEO,
      id: id,
      url: attachment.media.source,
    });
  }

  /*
    Attachment LOẠI ALBUM có định dạng như sau
    {
        "media": {
            "image": {
                "height": 720,
                "src": "https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/p480x480/233193975_582887376210934_3917501890611553539_n.jpg?_nc_cat=103&ccb=1-5&_nc_sid=07e735&_nc_ohc=b2Z1BxAj3PwAX_a0j-F&_nc_ht=scontent.fhan2-4.fna&oh=1100b63609d1d331a0a17721b002ae78&oe=614A6EAD",
                "width": 480
            }
        },
        "subattachments": {
            "data": [
                {sub_attachment_1}, // Các sub attachment này có cấu trúc giống attachment PHOTO hoặc VIDEO_AUTOPLAY
                {sub_attachment_2},
                ...
            ]
        },
        "target": {
            "id": "1020873538672374",
            "url": "https://www.facebook.com/media/set/?set=pcb.1020873538672374&type=1"
        },
        "title": "Photos from Lê Tài's post",
        "type": "album",
        "url": "https://www.facebook.com/media/set/?set=pcb.1020873538672374&type=1"
    } */
  if (type === "album") {
    // GỌI ĐỆ QUY VỚI TỪNG SUB_ATTACHMENT
    attachment.subattachments.data.forEach((sub) => {
      filtered_media.push(...getMediaFromAttachment(sub));
    });
  }

  return filtered_media;
};

// fetch tất cả bài post (feed) trong wall của 1 target (user, group, page), và lấy ra các media (ảnh, video, ..) trong các bài post đó (NẾU CÓ)
// Trả về danh sách chứa {id, url} của từng media
const fetchWallMedia = async ({
  targetId,
  pageLimit = Infinity, // Số lần fetch, mỗi lần fetch được khoảng 25 bài post (?)
  pageFetchedCallback = () => {},
}) => {
  const all_media = []; // store all media {id, url, type}
  let page = 1;
  let url = `${FB_API_HOST}/${targetId}/feed?fields=attachments{media,type,subattachments,target}&access_token=${ACCESS_TOKEN}`;

  while (url && page <= pageLimit) {
    console.log(`FETCHING page ${page}...`);
    const fetchData = await myFetch(url);
    page++;

    if (fetchData?.data) {
      // Get all media from each attachment
      const media = [];
      fetchData.data.forEach((feedData) => {
        feedData.attachments?.data.forEach((at) => {
          media.push(...getMediaFromAttachment(at));
        });
      });

      all_media.push(...media);
      console.log(
        `> Found ${media.length} media. (Total: ${all_media.length})`
      );

      // callback when each page fetched
      await pageFetchedCallback(media);

      // get next paging
      url = fetchData?.paging?.next;
    } else {
      break;
    }
  }

  return all_media;
};

// Tải và lưu tất cả id hình ảnh + link hình ảnh từ album, lưu vào file có tên trùng với albumId, lưu trong folder links
export const downloadWallMediaLinks = async ({
  targetId,
  includeVideo = true,
  pageLimit = Infinity,
}) => {
  console.log(`STARTING FETCH WALL_MEDIA_LINKS IN TARGET ${targetId}...`);

  const fileName = `${FOLDER_TO_SAVE_LINKS}/${targetId}.txt`;
  deleteFile(fileName); // delete if file exist

  await fetchWallMedia({
    targetId: targetId,
    pageLimit: pageLimit,
    pageFetchedCallback: (media) => {
      if (!includeVideo)
        media = media.filter((m) => m.type !== MEDIA_TYPE.VIDEO);

      saveToFile(
        fileName,
        media.map((_) => _.id + ID_LINK_SEPERATOR + _.url).join("\n"),
        false
      );
    },
  });
};

// Hàm này fetch tất cả các bài post của 1 target (user, group, page), và tải về media (photo, video) có trong các bài post
export const downloadWallMedia = async ({
  targetId,
  includeVideo = true,
  pageLimit = Infinity,
}) => {
  console.log(`STARTING FETCH WALL_MEDIA IN TARGET ${targetId}...`);
  await fetchWallMedia({
    targetId: targetId,
    pageLimit: pageLimit,
    pageFetchedCallback: async (media) => {
      // create dir if not exist
      const dir = `${FOLDER_TO_SAVE_FEED_MEDIA}/${targetId}`;
      createIfNotExistDir(dir);

      // save all photo to directory
      console.log(`Saving media ...`);
      const promises = [];

      for (let data of media) {
        const { id: media_id, url: media_url, type: media_type } = data;

        if (!includeVideo && media_type === MEDIA_TYPE.VIDEO) continue;

        const file_format =
          media_type === MEDIA_TYPE.PHOTO
            ? PHOTO_FILE_FORMAT
            : VIDEO_FILE_FORMAT;

        const savePath = `${dir}/${media_id}.${file_format}`;

        promises.push(
          limit(() =>
            downloadFileSync({
              uri: media_url,
              filename: savePath,
              successCallback: () => {
                console.log(`> Saved ${savePath}`);
              },
              failedCallback: (e) => {
                console.log(`ERROR while save media ${savePath}`, e.toString());
              },
            })
          )
        );
      }

      await Promise.allSettled(promises);
      console.log(`> Saved ${promises.length} media.`);
    },
  });
};
