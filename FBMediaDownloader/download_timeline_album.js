// TimeLine Album là 1 album chứa tất cả hình ảnh có trong page
// Thường thì chỉ có page mới có timeline album
// album này sẽ không hiện trên trang web facebook (hoặc có mà mình ko biết cách tìm ở đâu), cần dùng tool để lấy

import fetch from "node-fetch";
import { ACCESS_TOKEN, FB_API_HOST } from "./config.js";
import { saveAlbumPhoto, saveAlbumPhotoLinks } from "./dowload_album.js";

export const fetchTimeLineAlbumId = async (page_id) => {
  // create link to fetch all albums of page
  let url = `${FB_API_HOST}/${page_id}/albums?fields=type&limit=100&access_token=${ACCESS_TOKEN}`;

  try {
    // fetch data
    const response = await fetch(url);
    const json = await response.json();
    
    // find timeline album
    const timeLineAlbum = json.data.find((_) => _.type === "wall");

    // return id (or null if not found timeline album)
    return timeLineAlbum?.id;
  } catch (e) {
    console.error("ERROR", e.toString());
  }
};

export const saveTimeLineAlbumPhotoLinks_FBPage = async (page_id) => {
  const album_id = await fetchTimeLineAlbumId(page_id);
  if (album_id) {
    console.log("Tìm thấy timeline album: ", album_id);
    saveAlbumPhotoLinks(album_id);
  } else {
    console.error("! Page facebook này không có timeline album.");
  }
};

export const saveTimeLineAlbum_FBPage = async (page_id) => {
  const album_id = await fetchTimeLineAlbumId(page_id);
  if (album_id) {
    console.log("Tìm thấy timeline album: ", album_id);
    saveAlbumPhoto(album_id);
  } else {
    console.error("! Page facebook này không có timeline album.");
  }
};
