# FB Album Downloader

Tham khảo cách làm việc với Facebook API từ [Hoàng Minh Dùng MMO](https://www.youtube.com/watch?v=auTBuwZOrBo&list=PL4BMIU_JnQBRSVZcc_ey0LDZdARdeuCh2&index=1)

## CHUẨN BỊ

Để có thể chạy được code thì bạn cần:

0. Cài NodeJS. Tải code về.

1. Lấy AccessToken của bạn [Cách lấy](https://ahachat.com/help/blog/cach-lay-token-facebook#2-token-facebook-theo-t%C3%A0i-kho%E1%BA%A3n-c%C3%A1-nh%C3%A2n)

2. Bỏ access token vào file [config.js](./config.js)

3. Cũng trong config.js. Bạn có thể tùy chỉnh đường dẫn lưu ảnh _FOLDER_TO_SAVE_IMAGES_ hoặc đường dẫn lưu link _FOLDER_TO_SAVE_LINKS_

4. Lấy album_id, mã của album muốn tải ảnh. Thường hiện trên đường dẫn url của album (trong file [index.js](./index.js) có ví dụ)

5. Dán album_id vào file hàm trong [index.js](./index.js). Dùng hàm nào thì đọc tiếp phía dưới.

## LƯU _ID_ VÀ _LINK_ ẢNH

- Dùng hàm _saveAlbumPhotoLinks_:
  - tham số album_id: id của album (string)
- Hàm này sẽ tải và lưu id của từng hình, link của từng hình có trong album ảnh.
- Dữ liệu sau khi tải xong được lưu vào file dạng [/links/{album_id}.txt](./links/).
- Từng dòng trong file chứa 2 thông tin: (cách nhau bởi **dấu chấm phẩy ;**)
  - **photo_id** (id của hình)
  - **photo_url** (link của hình)
- Với **photo_id**, bạn có thể truy cập bài viết chứa hình theo đường link có định dạng https://facebook.com/{photo_id}

## LƯU FILE _ẢNH_

- Dùng hàm _saveAlbumPhoto_:
  - Tham số album_id: id của album (string)
- Hàm này sẽ tải và lưu tất cả hình có trong album ảnh.
- Các file ảnh sau khi tải sẽ được lưu trong folder dạng [/images/{album_id}/{photo_id}.png](./images/).

## CHẠY CODE

Chỉ cần mở terminal tại folder chứa code và gõ
- _npm install_
- _node index.js_

Kết quả sẽ xuất trong màn hình console
