import readline from "readline";
import {
  downloadAlbumPhoto,
  downloadAlbumPhotoLinks,
  fetchAlbumInfo,
} from "./download_album.js";
import { fetchTimeLineAlbumId_FBPage } from "./download_timeline_album.js";
import {
  downloadWallMedia,
  downloadWallMediaLinks,
} from "./download_wall_media.js";

// https://stackoverflow.com/a/68504470
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const wait_for_key_pressed = async () =>
  await prompt("..press any key to continue..");

const choose = async (title, menu_items) => {
  let title_ui = `======== ${title} ========`;
  let ui = "";
  ui += "\n" + new Array(title_ui.length).fill("=").join("") + "\n";
  ui += title_ui + "\n";
  ui += new Array(title_ui.length).fill("=").join("");
  Object.entries(menu_items).map(([key, value], index) => {
    ui += `\n${key}: ${value}`;
  });
  console.log(ui);

  while (true) {
    const input = await prompt("\n> Choose action: ");
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
const menuDownloadAlbum = async () => {
  while (true) {
    const action = await choose("FB Media Downloader Tool > Download Album", {
      0: "<- Back",
      1: "Download all PHOTOs in album",
      2: "Download all LINKs of photos in album",
    });

    if (action.key == 0) break;
    if (action.key == 1 || action.key == 2) {
      const album_id = await prompt("> Enter album id (-1 to go back): ");
      const from_photo_id = await prompt(
        "> From photo id (0 to fetch from beginning  of album): "
      );
      if (album_id != -1) {
        action.key == 1
          ? await downloadAlbumPhoto({
              albumId: album_id,
              fromPhotoId: from_photo_id,
            })
          : await downloadAlbumPhotoLinks({
              albumId: album_id,
              fromPhotoId: from_photo_id,
            });
      }
    }
  }
};

const menuDownloadWallMedia = async () => {
  while (true) {
    const action = await choose(
      "FB Media Downloader Tool > Download Wall Media",
      {
        0: "<- Back",
        1: "Download all VIDEO/PHOTOs on target's wall",
        2: "Download all LINKs of video/photos on target's wall",
      }
    );

    if (action.key == 0) break;
    if (action.key == 1 || action.key == 2) {
      const target_id = await prompt(
        "> Enter target id (user_id/group_id/page_id) (-1 to go back): "
      );
      if (target_id != -1) {
        const page_limit = await prompt(
          "> Page limit (0 to download all media in target wall): "
        );
        if (page_limit >= 0) {
          console.log("in");
          action.key == 1
            ? await downloadWallMedia({
                targetId: target_id,
                includeVideo: true,
                pageLimit: page_limit == 0 ? Infinity : page_limit,
              })
            : await downloadWallMediaLinks({
                targetId: target_id,
                pageLimit: page_limit == 0 ? Infinity : page_limit,
              });
        }
      }
    }
  }
};

export const menu = async () => {
  while (true) {
    const action = await choose("FB Media Downloader Tool", {
      1: "Get album infomation",
      2: "Get timeline_album_id of page",
      3: "Download album",
      4: "Download wall media",
      5: "Exit",
    });
    if (action.key == 1) {
      const album_id = await prompt("> Enter album id (-1 to go back): ");
      if (album_id != -1) {
        console.log(await fetchAlbumInfo(album_id));
        await wait_for_key_pressed();
      }
    }
    if (action.key == 2) {
      const page_id = await prompt("> Enter page id (-1 to go back): ");
      if (page_id != -1) {
        const timeline_album_id = await fetchTimeLineAlbumId_FBPage(page_id);
        if (timeline_album_id) {
          console.log("< FOUND Timeline Album ID: ", timeline_album_id);
          console.log("< Fetching album infomation....");
          console.log(await fetchAlbumInfo(timeline_album_id));
        } else console.log("< NOT FOUND timeline album.");
        await wait_for_key_pressed();
      }
    }
    if (action.key == 3) {
      await menuDownloadAlbum();
    }
    if (action.key == 4) {
      await menuDownloadWallMedia();
    }
    if (action.key == 5) break;
  }

  rl.close();
};

rl.on("close", () => process.exit(0));
