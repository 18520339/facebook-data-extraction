// you can modify all the variables below
export const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN";
export const NUMBER_OF_DOWNLOAD_THREADS = 20; // số lượng luồng tải ảnh/video cùng 1 lúc (lớn thì sẽ tải song song cùng lúc nhiều ảnh/video, nhưng sẽ ko tải nhanh hơn, do vẫn dùng toàn bộ băng thông có thể)
export const WAIT_BEFORE_NEXT_FETCH = 0; // thời gian chờ (ms) trước mỗi lần fetch tiếp theo
export const ID_LINK_SEPERATOR = ";";
export const PHOTO_FILE_FORMAT = "png"; // OR jpg
export const VIDEO_FILE_FORMAT = "mp4"; // OR wav ?
export const FOLDER_TO_SAVE_LINKS = "downloads/links";
export const FOLDER_TO_SAVE_ALBUM_MEDIA = "downloads/album_media";
export const FOLDER_TO_SAVE_FEED_MEDIA = "downloads/feed_media";
