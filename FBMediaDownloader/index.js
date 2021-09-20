import {
  fetchAlbumInfo,
  downloadAlbumPhoto,
  downloadAlbumPhotoLinks,
} from "./scripts/download_album.js";
import {
  downloadWallMedia,
  downloadWallMediaLinks,
} from "./scripts/download_wall_media.js";
import {
  fetchTimeLineAlbumId_FBPage,
  downloadTimeLineAlbum_FBPage,
  downloadTimeLineAlbumPhotoLinks_FBPage,
} from "./scripts/download_timeline_album.js";

import { menu } from "./scripts/menu.js";

menu();

// ============ Lấy thông tin album timeline từ page id trên fb ============
// (async () => {
//   const album_id = await fetchTimeLineAlbumId_FBPage("ColourfulSpace");
//   console.log(album_id);

//   if (album_id) {
//     const album_info = await fetchAlbumInfo(album_id);
//     console.log(album_info);
//   }
// })();

// ============ Lưu tất cả wall media (ảnh, video trên tường) của 1 target (user, group, page) ============
// downloadWallMedia({
//   targetId: 697332711026460, // user_id / group_id / page_id
//   includeVideo: false,
//   pageLimit: 5,
// });
// downloadWallMediaLinks({
//   targetId: 697332711026460, // user_id / group_id / page_id
//   pageLimit: 1,
// });

// ============ Lưu tất cả hình trong timeline album của 1 page fb ============
// downloadTimeLineAlbum_FBPage("BoxGirlVn");

// ============ Lưu tất cả id ảnh và link ảnh trong timeline album của 1 page  ============
// downloadTimeLineAlbumPhotoLinks_FBPage("BoxGirlVn");

// ============ Lưu tất cả hình trong 1 album bất kỳ (nếu biết trước id của album) ============
// downloadAlbumPhoto("245004546697321");

// ============ Lưu tất cả id ảnh và link ảnh trong 1 album bất kỳ (nếu biết trước id của album) ============
// downloadAlbumPhotoLinks("245004546697321");

// ================================ EXAMPLES =================================
//  ColourfulSpace: https://www.facebook.com/media/set/?vanity=ColourfulSpace&set=a.945632905514659
// downloadAlbumPhotoLinks("945632905514659");
// downloadAlbumPhoto("945632905514659"); // CẨN THẬN: hơn 30 nghìn ảnh lận đó, lưu vào máy là hơi bị LÂU và NẶNG luôn :))

// J2Team-Girl: https://www.facebook.com/media/set/?set=oa.245004546697321&type=3
// downloadAlbumPhotoLinks("245004546697321");
// downloadAlbumPhoto("245004546697321");

// J2Team-Girl: https://www.facebook.com/media/set/?set=oa.628769808043090&type=3
// downloadAlbumPhotoLinks("628769808043090");
// downloadAlbumPhoto("628769808043090");

// AnhGirlXinh: https://www.facebook.com/media/set/?vanity=anhgirlxinh.net&set=a.568433099885020
// downloadAlbumPhotoLinks("568433099885020");
// downloadAlbumPhoto("568433099885020");

// NgamGaiDep: https://www.facebook.com/media/set/?vanity=ngamgaidep.plus&set=a.1885102325148609
// downloadAlbumPhotoLinks("1885102325148609");
// downloadAlbumPhoto("1885102325148609");
