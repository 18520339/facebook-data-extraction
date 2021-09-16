import fetch from "node-fetch";
import {
  ACCESS_TOKEN,
  FB_API_HOST,
  WAIT_BEFORE_NEXT_FETCH,
  ID_LINK_SEPERATOR,
  FOLDER_TO_SAVE_LINKS,
  FOLDER_TO_SAVE_IMAGES,
} from "./config.js";
import {
  createIfNotExistDir,
  deleteFile,
  downloadFileSync,
  saveToFile,
  sleep,
} from "./utils.js";

// Hàm này fetch và trả về 2 thứ:
// 1. Toàn bộ link ảnh (max 100) từ 1 vị trí (cursor) nhất định trong album ảnh
// 2. Vị trí của ảnh tiếp theo (next cursor) (nếu có)
const fetchAlbumPhotosFromCursor = async ({ albumId, cursor, limit = 100 }) => {
  // create link to fetch
  let url = `${FB_API_HOST}/${albumId}/photos?fields=largest_image&limit=${limit}&access_token=${ACCESS_TOKEN}`;
  if (cursor) {
    url += `&after=${cursor}`;
  }

  try {
    // fetch data
    const response = await fetch(url);
    const json = await response.json();

    // return imgData + next cursor
    return {
      imgData: json.data.map(
        (_) => _.id + ID_LINK_SEPERATOR + _.largest_image.source
      ),
      nextCursor: json.paging?.cursors?.after || null,
    };
  } catch (e) {
    return {};
  }
};

// Hàm này fetch về toàn bộ ảnh từ 1 album. Sử dụng hàm fetchAlbumPhotosFromCursor
// Liên tục fetch ảnh và lấy nextCursor, rồi lại fetch ảnh tiếp ở cursor mới. Liên tục cho tới khi không còn nextCursor
const fetchAlbumPhotos = async ({
  albumId,
  pageNum = Infinity,
  pageSize = 100, // max is 100 in facebook graph API
  pageFetchedCallback = async () => {},
}) => {
  let currentPage = 1;
  let hasNextCursor = true;
  let nextCursor = null;
  let allImgsData = [];

  while (hasNextCursor && currentPage <= pageNum) {
    console.log(`Fetching page: ${currentPage}, pageSize: ${pageSize}...`);

    const data = await fetchAlbumPhotosFromCursor({
      albumId,
      cursor: nextCursor,
      limit: pageSize,
    });

    if (data.imgData) {
      // concat data to result array
      allImgsData = allImgsData.concat(data.imgData);

      console.log(
        `> Fetched ${data.imgData.length} photos. (Total: ${allImgsData.length})`
      );

      // callback when each page fetched
      await pageFetchedCallback(data.imgData);

      // get next cursor AND increase pageNum
      nextCursor = data.nextCursor;
      hasNextCursor = nextCursor != null;
      currentPage++;

      // wait for next fetch - if needed
      if (WAIT_BEFORE_NEXT_FETCH) {
        console.log(`Sleeping ${WAIT_BEFORE_NEXT_FETCH}ms...`);
        await sleep(WAIT_BEFORE_NEXT_FETCH);
      }
    } else {
      // FAILED => re-fetch currentPage
      console.log("FAILED.");
    }
  }

  return allImgsData;
};

// Hàm này fetch thông tin của 1 album, bao gồm nhiều thứ như tên, loại, số lượng ảnh, ngày tạo, người tạo, ...
// Bạn có thể thêm những trường khác vào url để lấy được nhiều thông tin hơn, tìm hiểu các trường trong https://developers.facebook.com/tools/explorer/
export const fetchAlbumInfo = async (albumId) => {
  // create link to fetch
  let url = `${FB_API_HOST}/${albumId}?fields=count,link,name,updated_time,id,created_time,type,from&access_token=${ACCESS_TOKEN}`;

  try {
    // fetch data
    const response = await fetch(url);
    const json = await response.json();

    // return album infomation
    return {
      id: albumId,
      type: json.type,
      count: json.count,
      link: json.link,
      name: json.name,
      created_time: json.created_time,
      updated_time: json.updated_time,
      from: {
        name: json.from?.name,
        id: json.from?.id,
      },
    };
  } catch (e) {
    console.error("ERROR while fetch album information", e);
    return null;
  }
};

// Tải và lưu tất cả id hình ảnh + link hình ảnh từ album, lưu vào file có tên trùng với albumId, lưu trong folder links
export const saveAlbumPhotoLinks = async (albumId) => {
  console.log(`STARTING FETCH ALBUM ${albumId}...`);

  const fileName = `${FOLDER_TO_SAVE_LINKS}/${albumId}.txt`;
  deleteFile(fileName); // delete if file exist

  fetchAlbumPhotos({
    albumId,
    pageFetchedCallback: (pageImgsData) => {
      saveToFile(fileName, pageImgsData.join("\n"), false);
    },
  });
};

// Tải và lưu tất cả HÌNH ẢNH từ album, lưu từng file ảnh bằng id của ảnh và lưu hết vào folder images/albumId/
export const saveAlbumPhoto = async (albumId) => {
  console.log(`STARTING FETCH ALBUM ${albumId}...`);
  fetchAlbumPhotos({
    albumId,
    pageFetchedCallback: async (pageImgsData) => {
      // create dir if not exist
      const dir = `${FOLDER_TO_SAVE_IMAGES}/${albumId}`;
      createIfNotExistDir(dir);

      // save all photo to directory
      console.log(`Saving images ...`);
      const promises = [];

      for (let data of pageImgsData) {
        const seperated = data.split(ID_LINK_SEPERATOR);
        const photo_id = seperated[0];
        const link = seperated[1];

        const savePath = `${dir}/${photo_id}.png`;
        promises.push(
          downloadFileSync({
            uri: link,
            filename: savePath,
            successCallback: () => {
              console.log(`> Saved ${savePath}`);
            },
            failedCallback: (e) => {
              console.log(`ERROR while save image ${savePath}`);
            },
          })
        );
      }

      try {
        await Promise.all(promises);
        console.log(`> Saved ${promises.length} images.`);
      } catch (e) {}
    },
  });
};
