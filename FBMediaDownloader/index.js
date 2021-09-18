import {
  fetchAlbumInfo,
  saveAlbumPhoto,
  saveAlbumPhotoLinks,
} from "./scripts/download_album.js";
import {
  fetchTimeLineAlbumId,
  saveTimeLineAlbum_FBPage,
  saveTimeLineAlbumPhotoLinks_FBPage,
} from "./scripts/download_timeline_album.js";

// import { menu } from "./scripts/menu.js";
// menu();

// ============ Lấy thông tin album timeline từ page id trên fb ============
// (async () => {
//   const album_id = await fetchTimeLineAlbumId("ColourfulSpace");
//   console.log(album_id);

//   if (album_id) {
//     const album_info = await fetchAlbumInfo(album_id);
//     console.log(album_info);
//   }
// })();

// ============ Lưu tất cả hình trong timeline album của 1 page fb ============
// saveTimeLineAlbum_FBPage("BoxGirlVn");

// ============ Lưu tất cả id ảnh và link ảnh trong timeline album của 1 page  ============
// saveTimeLineAlbumPhotoLinks_FBPage("BoxGirlVn");

// ============ Lưu tất cả hình trong 1 album bất kỳ (nếu biết trước id của album) ============
saveAlbumPhoto("245004546697321");

// ============ Lưu tất cả id ảnh và link ảnh trong 1 album bất kỳ (nếu biết trước id của album) ============
// saveAlbumPhotoLinks("245004546697321");

// ================================ EXAMPLES =================================
//  ColourfulSpace: https://www.facebook.com/media/set/?vanity=ColourfulSpace&set=a.945632905514659
// saveAlbumPhotoLinks("945632905514659");
// saveAlbumPhoto("945632905514659"); // CẨN THẬN: hơn 30 nghìn ảnh lận đó, lưu vào máy là hơi bị LÂU và NẶNG luôn :))

// J2Team-Girl: https://www.facebook.com/media/set/?set=oa.245004546697321&type=3
// saveAlbumPhotoLinks("245004546697321");
// saveAlbumPhoto("245004546697321");

// J2Team-Girl: https://www.facebook.com/media/set/?set=oa.628769808043090&type=3
// saveAlbumPhotoLinks("628769808043090");
// saveAlbumPhoto("628769808043090");

// AnhGirlXinh: https://www.facebook.com/media/set/?vanity=anhgirlxinh.net&set=a.568433099885020
// saveAlbumPhotoLinks("568433099885020");
// saveAlbumPhoto("568433099885020");

// NgamGaiDep: https://www.facebook.com/media/set/?vanity=ngamgaidep.plus&set=a.1885102325148609
// saveAlbumPhotoLinks("1885102325148609");
// saveAlbumPhoto("1885102325148609");
