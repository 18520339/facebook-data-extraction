import fetch from "node-fetch";
import fs from "fs";
import { ACCESS_TOKEN } from "./config.js";

const HOST = "https://graph.facebook.com";
const SEPERATOR = ":";

const fetchAlbumDataFromCursor = async (albumId, cursor, limit = 100) => {
  // create link to fetch
  let url = `${HOST}/${albumId}/photos?fields=largest_image&limit=${limit}&access_token=${ACCESS_TOKEN}`;
  if (cursor) {
    url += `&after=${cursor}`;
  }

  // fetch data
  const response = await fetch(url);
  const json = await response.json();

  // return all_links + next cursor
  return {
    all_links: json.data.map((_) => _.id + SEPERATOR + _.largest_image.source),
    nextCursor: json.paging?.cursors?.after || null,
  };
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
    all_links = all_links.concat(data.all_links);

    console.log(`> Fetched ${data.all_links.length} photos.`);

    nextCursor = data.nextCursor;
    hasNextCursor = nextCursor != null;
    currentPage++;
  }

  return all_links;
};

export const saveAlbumPhotoLinks = async (albumId, override = false) => {
  console.log(`Fetching album ${albumId}...`);
  const links = await fetchAlbumData(albumId);

  const fileName = `data/${albumId}.txt`;
  console.log(`Writting ${links.length} photo links to ${fileName}...`);
  fs.writeFile(
    fileName,
    links.join("\n"),
    { flag: override ? "w" : "a+" },
    (err) => {
      if (err) throw err;
      console.log("> Saved!");
    }
  );
};
