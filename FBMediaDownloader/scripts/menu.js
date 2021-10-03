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
  await prompt("..Nhấn phím bất kỳ để tiếp tục..");

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
    const input = await prompt("\n> Chọn chức năng: ");
    if (input in menu_items) {
      return {
        key: input,
        value: menu_items[input],
      };
    } else {
      console.log("[!] Không hợp lệ. Vui lòng chọn lại.");
    }
  }
};

// ========================================== MENU =========================================
const menuDownloadAlbum = async () => {
  while (true) {
    const action = await choose("FB Media Downloader Tool > Tải Album", {
      0: "<- Quay lại",
      1: "Tải tất cả ẢNH trong album",
      2: "Tải tất cả LINK của ảnh trong album",
    });

    if (action.key == 0) break;
    if (action.key == 1 || action.key == 2) {
      const album_id = await prompt("> Nhập album id (Nhập -1 để quay lại): ");
      if (album_id != -1) {
        const from_photo_id_text = await prompt(
          "> Tải từ vị trí id ảnh nào? (Nhập 0 để tải từ đầu album): "
        );
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
      "FB Media Downloader Tool > Tải ảnh/video trên tường",
      {
        0: "<- Quay lại",
        1: "Tải tất cả ẢNH/VIDEO trên tường của đối tượng (user/gorup/page)",
        2: "Tải tất cả LINK ảnh/video trên tường của đối tượng (user/group/page)",
      }
    );

    if (action.key == 0) break;
    if (action.key == 1 || action.key == 2) {
      const target_id = await prompt(
        "> Nhập id của đối tượng (user_id/group_id/page_id) (Nhập -1 để quay lại): "
      );
      if (target_id != -1) {
        const page_limit = await prompt(
          "> Tải bao nhiêu trang (Nhập 0 để tải mọi thứ trên tường): "
        );
        const include_video = await prompt(
          "> Có tải cả video không (0-Không, 1-Có): "
        );
        if (page_limit >= 0) {
          action.key == 1
            ? await downloadWallMedia({
                targetId: target_id,
                includeVideo: include_video == 1 ? true : false,
                pageLimit: page_limit == 0 ? Infinity : page_limit,
              })
            : await downloadWallMediaLinks({
                targetId: target_id,
                includeVideo: include_video == 1 ? true : false,
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
      1: "Xem thông tin album",
      2: "Tìm timeline album id của page",
      3: "Tải album (của user/page/group)",
      4: "Tải ảnh/video trên tường của đối tượng (user/group/page)",
      5: "Hỗ trợ",
      6: "Thoát",
    });
    if (action.key == 1) {
      const album_id = await prompt("> Nhập album id (Nhập -1 để quay lại): ");
      if (album_id != -1) {
        console.log(await fetchAlbumInfo(album_id));
        await wait_for_key_pressed();
      }
    }
    if (action.key == 2) {
      const page_id = await prompt("> Nhập page id (Nhập -1 để quay lại): ");
      if (page_id != -1) {
        const timeline_album_id = await fetchTimeLineAlbumId_FBPage(page_id);
        if (timeline_album_id) {
          console.log("< TÌM THẤY Timeline Album ID: ", timeline_album_id);
          console.log("< Đang tải thông tin album....");
          console.log(await fetchAlbumInfo(timeline_album_id));
        } else
          console.log(S.BgRed + "< KHÔNG TÌM THẤY timeline album." + S.Reset);
        await wait_for_key_pressed();
      }
    }
    if (action.key == 3) {
      await menuDownloadAlbum();
    }
    if (action.key == 4) {
      await menuDownloadWallMedia();
    }
    if (action.key == 5) {
      console.log(
        "---- Liên hệ mình để được hỗ trợ: https://www.facebook.com/99.hoangtran/ ----"
      );
      await wait_for_key_pressed();
    }
    if (action.key == 6) break;
  }

  rl.close();
};

rl.on("close", () => process.exit(0));
