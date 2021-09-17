import readline from "readline";
import {
  fetchAlbumInfo,
  saveAlbumPhoto,
  saveAlbumPhotoLinks,
} from "./download_album.js";
import {
  fetchTimeLineAlbumId,
  saveTimeLineAlbum_FBPage,
  saveTimeLineAlbumPhotoLinks_FBPage,
} from "./download_timeline_album.js";

// https://stackoverflow.com/a/68504470
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));
rl.on("close", () => process.exit(0));

const wait_input = async () => await prompt("");

const choose = async (title, menu_items) => {
  let ui = `\n======== ${title} ========`;
  Object.entries(menu_items).map(([key, value], index) => {
    ui += `\n${key}: ${value}`;
  });
  console.log(ui);

  while (true) {
    const input = await prompt("> Choose action: ");
    if (input in menu_items) {
      return {
        key: input,
        value: menu_items[input],
      };
    } else {
      console.log("[!] Invalid. Please choose again.");
    }
  }
};

// ========================================== MENU =========================================

export const menu = async () => {
  while (true) {
    const main_menu = {
      0: "Download Album",
      3: "Get Album Infomation",
      4: "Exit",
    };

    const action = await choose("FB Album Downloader Tool", main_menu);
    if (action.key == 2) {
      const album_id = await prompt("Enter album id: ");
      const album_info = await fetchAlbumInfo(album_id);
      console.log(album_info);
    }
    if (action.key == 3) break;
  }

  rl.close();
};
