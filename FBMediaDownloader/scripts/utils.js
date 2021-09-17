import fs from "fs";
import request from "request";

export const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const checkFileExist = (fileDir) => fs.existsSync(fileDir);

export const deleteFile = (fileDir) =>
  checkFileExist(fileDir) && fs.unlinkSync(fileDir);

export const createIfNotExistDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`> Created directory ${dir}.`);
  }
};

export const saveToFile = (fileName, data, override = false) => {
  try {
    fs.writeFileSync(fileName, data, { flag: override ? "w+" : "a+" });
    console.log(`> Saved to ${fileName}`);
  } catch (err) {
    console.error("ERROR", err);
  }
};

// https://stackoverflow.com/a/12751657
export const downloadFile = function ({
  uri,
  filename,
  successCallback = () => {},
  failedCallback = () => {},
}) {
  try {
    request.head(uri, function (err, res, body) {
      if (err) {
        failedCallback(err);
      } else {
        request(uri)
          .pipe(fs.createWriteStream(filename, { flags: "w+" }))
          .on("close", successCallback);
      }
    });
  } catch (e) {
    console.error("ERROR", e);
  }
};

export const downloadFileSync = async function ({
  uri,
  filename,
  successCallback = () => {},
  failedCallback = () => {},
}) {
  await new Promise((resolve, reject) => {
    request.head(uri, function (err, res, body) {
      if (err) {
        failedCallback(err);
        reject(err);
      } else {
        request({ uri, gzip: true })
          .pipe(fs.createWriteStream(filename, { flags: "w+" }))
          .on("close", () => {
            successCallback();
            resolve();
          });
      }
    });
  });
};

// for browser ONLY: https://dev.to/sbodi10/download-images-using-javascript-51a9
export const _downloadImage = async (imageSrc) => {
  const image = await fetch(imageSrc);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  const link = document.createElement("a");
  link.href = imageURL;
  link.download = "image file name here";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
