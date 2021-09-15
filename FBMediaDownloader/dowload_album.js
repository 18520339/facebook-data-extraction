import fetch from "node-fetch";
import {
  ACCESS_TOKEN,
  WAIT_BEFORE_NEXT_FETCH,
  ID_LINK_SEPERATOR,
  FOLDER_TO_SAVE_LINKS,
  FOLDER_TO_SAVE_IMAGES,
} from "./config.js";
import {
  createIfNotExistDir,
  deleteFile,
  downloadImage,
  saveToFile,
  sleep,
} from "./utils.js";

const HOST = "https://graph.facebook.com";

const fetchAlbumDataFromCursor = async ({ albumId, cursor, limit = 100 }) => {
  // create link to fetch
  let url = `${HOST}/${albumId}/photos?fields=largest_image&limit=${limit}&access_token=${ACCESS_TOKEN}`;
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

const fetchAlbumData = async ({
  albumId,
  pageNum = Infinity,
  pageSize = 100, // max is 100 in facebook graph API
  pageFetchedCallback = () => {},
}) => {
  let currentPage = 1;
  let hasNextCursor = true;
  let nextCursor = null;
  let allImgsData = [];

  while (hasNextCursor && currentPage <= pageNum) {
    console.log(`Fetching page: ${currentPage}, pageSize: ${pageSize}...`);

    const data = await fetchAlbumDataFromCursor({
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
      pageFetchedCallback(data.imgData);

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

// Tải và lưu tất cả id hình ảnh + link hình ảnh từ album, lưu vào file có tên trùng với albumId, lưu trong folder links
export const saveAlbumPhotoLinks = async (albumId) => {
  console.log(`STARTING FETCH ALBUM ${albumId}...`);

  const fileName = `${FOLDER_TO_SAVE_LINKS}/${albumId}.txt`;
  deleteFile(fileName); // delete if file exist

  fetchAlbumData({
    albumId,
    pageFetchedCallback: (pageImgsData) => {
      saveToFile(fileName, pageImgsData.join("\n"), false);
    },
  });
};

// Tải và lưu tất cả HÌNH ẢNH từ album, lưu từng file ảnh bằng id của ảnh và lưu hết vào folder images/albumId/
export const saveAlbumPhoto = async (albumId) => {
  console.log(`STARTING FETCH ALBUM ${albumId}...`);
  fetchAlbumData({
    albumId,
    pageFetchedCallback: (pageImgsData) => {
      // create dir if not exist
      const dir = `${FOLDER_TO_SAVE_IMAGES}/${albumId}`;
      createIfNotExistDir(dir);

      // save all photo to directory
      console.log(`Saving images ...`);
      for (let data of pageImgsData) {
        const seperated = data.split(ID_LINK_SEPERATOR);
        const photo_id = seperated[0];
        const link = seperated[1];

        const savePath = `${dir}/${photo_id}.png`;
        downloadImage(link, savePath, () => {
          console.log(`> Saved ${savePath}`);
        });
      }
    },
  });
};
