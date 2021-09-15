import fetch from "node-fetch";
import { saveToFile, sleep } from "./utils.js";
import {
  ACCESS_TOKEN,
  WAIT_BEFORE_NEXT_FETCH,
  ID_LINK_SEPERATOR,
  FOLDER_TO_SAVE,
} from "./config.js";

const HOST = "https://graph.facebook.com";

const fetchAlbumDataFromCursor = async (albumId, cursor, limit = 100) => {
  // create link to fetch
  let url = `${HOST}/${albumId}/photos?fields=largest_image&limit=${limit}&access_token=${ACCESS_TOKEN}`;
  if (cursor) {
    url += `&after=${cursor}`;
  }

  try {
    // fetch data
    const response = await fetch(url);
    const json = await response.json();

    // return all_links + next cursor
    return {
      all_links: json.data.map(
        (_) => _.id + ID_LINK_SEPERATOR + _.largest_image.source
      ),
      nextCursor: json.paging?.cursors?.after || null,
    };
  } catch (e) {
    return {};
  }
};

const fetchAlbumData = async (
  albumId,
  pageNum = Infinity,
  pageSize = 100 // max is 100 in facebook graph API
) => {
  let currentPage = 1;
  let hasNextCursor = true;
  let nextCursor = null;
  let all_links = [];

  while (hasNextCursor && currentPage <= pageNum) {
    console.log(`Fetching page: ${currentPage}, pageSize: ${pageSize} ...`);

    const data = await fetchAlbumDataFromCursor(albumId, nextCursor, pageSize);

    if (data.all_links) {
      all_links = all_links.concat(data.all_links);

      console.log(`> Fetched ${data.all_links.length} photos.`);

      nextCursor = data.nextCursor;
      hasNextCursor = nextCursor != null;
      currentPage++;

      if (WAIT_BEFORE_NEXT_FETCH) {
        console.log(`Sleeping ${WAIT_BEFORE_NEXT_FETCH}ms ...`);
        await sleep(WAIT_BEFORE_NEXT_FETCH);
      }
    } else {
      console.log("FAILED.");
    }
  }

  return all_links;
};

export const saveAlbumPhotoLinks = async (albumId, override = false) => {
  console.log(`Fetching album ${albumId}...`);
  const links = await fetchAlbumData(albumId);

  const fileName = `${FOLDER_TO_SAVE}/${albumId}.txt`;
  saveToFile(fileName, links.join("\n"), override);
};
