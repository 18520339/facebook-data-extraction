# FB Album Downloader

Tham khảo cách làm việc với Facebook API từ [Hoàng Minh Dùng MMO](https://www.youtube.com/watch?v=auTBuwZOrBo&list=PL4BMIU_JnQBRSVZcc_ey0LDZdARdeuCh2&index=1)

## LƯU _ID_ VÀ _LINK_ ẢNH

- Dùng hàm _saveAlbumPhotoLinks_:
  - tham số duy nhất là album_id: id của album (string)
- Hàm này sẽ tải và lưu id của từng hình, link của từng hình có trong album ảnh.
- Dữ liệu sau khi tải xong được lưu vào file dạng [/links/{album_id}.txt](./links/).
- Từng dòng trong file chứa 2 thông tin: (cách nhau bởi **dấu chấm phẩy ;**)
  - **photo_id** (id của hình)
  - **photo_url** (link của hình)
- Với **photo_id**, bạn có thể truy cập bài viết chứa hình theo đường link có định dạng https://facebook.com/{photo_id}

## LƯU FILE _ẢNH_

- Dùng hàm _saveAlbumPhoto_:
  - Tham số duy nhất là album_id: id của album
- Hàm này sẽ tải và lưu tất cả hình có trong album ảnh.
- Các file ảnh sau khi tải sẽ được lưu trong folder dạng [/images/{album_id}/{photo_id}.png](./images/).
