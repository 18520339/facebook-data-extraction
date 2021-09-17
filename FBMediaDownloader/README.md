# FB Album Downloader

1 Tool nhỏ viết bằng Nodejs. Giúp tải nhanh 1 album ảnh bất kì trên facebook, bạn chỉ cần có id của album ảnh đó là được.

## Ưu Điểm

### **2 CHẾ ĐỘ**

- Bạn có thể tải tất cả **FILE ẢNH** trong album.
- Hoặc có thể tải tất cả **LINK** của các ảnh trong album. Và lưu danh sách link đó vào **1 file**. (Rồi sau này muốn làm gì đống link đó thì tùy bạn).

### **TẢI CỰC NHANH**

- Tại sao viết tool bằng **NodeJs** chứ không phải **chrome extension**, vì theo mình thấy những việc liên quan tới tải file vậy thì dùng NodeJs sẽ nhanh hơn rất nhiều so với extension (phải thông qua trình duyệt để tải file).
- Tốc độ tải file sẽ phụ thuộc vào đường truyền mạng của bạn. Có khi ngốn hết băng thông luôn đấy, MAX NHANH NHÉ.
- Tải [album 30 NGHÌN ảnh](https://www.facebook.com/media/set?vanity=ColourfulSpace&set=a.945632905514659) trong chưa đầy 15p (intel core i5, gen 8, 12GB RAM)

### **TẢI CỰC NHIỀU**

- Tool có thể tải và lưu cả Timeline Album - 1 dạng album ẨN, chứa **TẤT CẢ** các hình ảnh có trong 1 **TRANG FACEBOOK** (Page)
- Ví dụ: [Post này](https://www.facebook.com/groups/j2team.community/posts/1377217242610392/) (Mình tải thử thì được 7GB ảnh)
- Timeline Album chỉ có trên TRANG FB, không có trên GROUP FB hay FB CÁ NHÂN (hoặc có mà mình chưa tìm ra)
- Bạn chỉ cần truyền vào id của TRANG FB là tool sẽ tự tìm timline album của TRANG và tải về cho bạn (NẾU CÓ).

### **TỈ LỆ BỊ CHECKPOINT THẤP**

- Tool dùng acccess token của bạn để fetch dữ liệu từ Facebook (Các API mình tham khảo từ [Đây](https://developers.facebook.com/tools/explorer)).
- Mỗi lần fetch lấy dữ liệu ảnh của album, sẽ lấy được 1 json object, chứa tối đa 100 link ảnh.
- Sau đó sẽ ngưng fetch để tải hết 100 ảnh đó. Tải xong mới fetch tiếp. Cho tới cuối album.
- Việc tải ảnh thì không ảnh hưởng tới checkpoint.
- Do có độ trễ nên khó bị check point lắm nhé.
- Mình đã thử ở album [Này](https://www.facebook.com/media/set?vanity=ColourfulSpace&set=a.945632905514659). Trên 30 NGHÌN ảnh, tải rất mượt và không vấn đề gì nhé.

## CHUẨN BỊ

Để có thể chạy được code thì bạn cần:

0. Cài NodeJS. Tải code về.

1. Lấy AccessToken của bạn [Cách lấy](https://ahachat.com/help/blog/cach-lay-token-facebook#2-token-facebook-theo-t%C3%A0i-kho%E1%BA%A3n-c%C3%A1-nh%C3%A2n) (Hoặc dùng bookmark mình để ở dưới để lấy token)

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

## BOOKMARK HỖ TRỢ

- <a href='javascript: (function () {if(window.location.host==="m.facebook.com"){console.log("Đang lấy token ...");fetch("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed").then((response)=>response.text()).then((text)=>{if("<"==text[0]){alert("Chưa đăng nhập. Bạn cần đăng nhập fb thì mới lấy được token.")}else{window.prompt("Token:",/(?<=accessToken\\":\\")(.*?)(?=\\")/.exec(text)[0])}})}else{alert("Bookmark này chỉ hoạt động trên trang m.facebook.com\nBạn hãy vào trang trên và ấn lại bookmark để lấy token an toàn nhé.");window.open("https://m.facebook.com")}})()'>Bookmark</a>
  giúp lấy Access Token FB AN TOÀN ([Soruce Code](./more/get_fb_token_bookmark.js))

## LINK NGON

- [facebook-scripts-dom-manipulation](https://github.com/jayremnt/facebook-scripts-dom-manipulation)

- Tham khảo cách làm việc với Facebook API từ [Hoàng Minh Dùng MMO](https://www.youtube.com/watch?v=auTBuwZOrBo&list=PL4BMIU_JnQBRSVZcc_ey0LDZdARdeuCh2&index=1)
