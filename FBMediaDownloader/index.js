import fetch from "node-fetch";
import fs from "fs";

const HOST = "https://graph.facebook.com";
const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN";

const fetchAlbumDataFromCursor = async (albumId, cursor, limit = 100) => {
  // create link to fetch
  let url = `${HOST}/${albumId}/photos?fields=largest_image&limit=${limit}&access_token=${ACCESS_TOKEN}`;
  if (cursor) {
    url += `&after=${cursor}`;
  }

  // fetch data
  const response = await fetch(url);
  const json = await response.json();

  // save data to all_link
  let all_links = json.data.map((_) => _.largest_image.source);
  console.log(`Fetched ${all_links.length} photos.`);

  // get next cursor
  const nextCursor = json.paging?.cursors?.after || null;

  // return all_links + next cursor
  return {
    all_links,
    nextCursor,
  };
};

const fetchAlbumData = async (albumId, pageNum = Infinity, pageSize = 100) => {
  let currentPage = 0;
  let hasNextCursor = true;
  let nextCursor = null;
  let all_links = [];

  while (hasNextCursor && currentPage < pageNum) {
    console.log(`> Fetching page: ${currentPage}, pageSize: ${pageSize}`);

    const data = await fetchAlbumDataFromCursor(albumId, nextCursor, pageSize);
    all_links = all_links.concat(data.all_links);

    nextCursor = data.nextCursor;
    hasNextCursor = nextCursor != null;
    currentPage++;
  }

  return all_links;
};

const saveAlbumPhotoLinks = async (albumId) => {
  const links = await fetchAlbumData(albumId);

  const fileName = `data/${albumId}.txt`;
  console.log(`Writting ${links.length} photo links to ${fileName}`);
  fs.writeFile(fileName, links.join("\n"), { flag: "a+" }, (err) => {
    if (err) throw err;
    console.log("Saved!");
  });
};

// https://www.facebook.com/media/set/?vanity=ColourfulSpace&set=a.945632905514659
saveAlbumPhotoLinks("945632905514659");
