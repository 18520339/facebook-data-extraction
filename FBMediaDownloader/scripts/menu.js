import readline from "readline";
import { S } from "./constants.js";
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
const prompt = (query) =>
  new Promise((resolve) => rl.question(S.FgGreen + query + S.Reset, resolve));

const wait_for_key_pressed = async () =>
  await prompt("..Nhap phim bat ky de tiep tuc..");

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
    const input = await prompt("\n> Chon chuc nang: ");
    if (input in menu_items) {
      return {
        key: input,
        value: menu_items[input],
      };
    } else {
      console.log("[!] Khong hop le. Vui long chon lai.");
    }
  }
};

// ========================================== MENU =========================================
const menuDownloadAlbum = async () => {
  while (true) {
    const action = await choose("FB Media Downloader Tool > Tai Album", {
      0: "<- Quay lai",
      1: "Tai tat ca ANH trong album",
      2: "Tai tat ca LINK cua anh trong album",
    });

    if (action.key == 0) break;
    if (action.key == 1 || action.key == 2) {
      const album_id = await prompt("> Nhap album id (Nhap -1 de quay lai): ");
      const from_photo_id_text = await prompt(
        "> Tai tu vi tri id anh nao? (Nhap 0 de tai tu dau album): "
      );
      if (album_id != -1) {
        const from_photo_id =
          from_photo_id_text == "0" ? null : from_photo_id_text;

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
      "FB Media Downloader Tool > Tai anh/video tren tuong (wall)",
      {
        0: "<- Quay lai",
        1: "Tai tat ca ANH/VIDEO tren wall cua (user/group/page)",
        2: "Tai tat ca LINKS anh/video tren wall cua (user/group/page)",
      }
    );

    if (action.key == 0) break;
    if (action.key == 1 || action.key == 2) {
      const target_id = await prompt(
        "> Nhap id cua doi tuong (user_id/group_id/page_id) (Nhap -1 de quay lai): "
      );
      if (target_id != -1) {
        const page_limit = await prompt(
          "> Gioi han bao nhieu trang (Nhap 0 de tai het moi thu tren tuong): "
        );
        if (page_limit >= 0) {
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
      1: "Xem thong tin album",
      2: "Tim timeline album cua page",
      3: "Tai album (cua user/page/group)",
      4: "Tai anh/video tren tuong (wall)",
      5: "Thoat",
    });
    if (action.key == 1) {
      const album_id = await prompt("> Nhap album id (Nhap -1 de quay lai): ");
      if (album_id != -1) {
        console.log(await fetchAlbumInfo(album_id));
        await wait_for_key_pressed();
      }
    }
    if (action.key == 2) {
      const page_id = await prompt("> Nhap page id (Nhap -1 de quay lai): ");
      if (page_id != -1) {
        const timeline_album_id = await fetchTimeLineAlbumId_FBPage(page_id);
        if (timeline_album_id) {
          console.log("< TIM THAY Timeline Album ID: ", timeline_album_id);
          console.log("< Dang tai thong tin album....");
          console.log(await fetchAlbumInfo(timeline_album_id));
        } else
          console.log(S.BgRed + "< KHONG TIM THAY timeline album." + S.Reset);
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
