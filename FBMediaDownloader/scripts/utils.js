import fs from "fs";
import fetch from "node-fetch";
import request from "request";
import pLimit from "p-limit";
import { NUMBER_OF_DOWNLOAD_THREADS } from "../config.js";

export const limit = pLimit(NUMBER_OF_DOWNLOAD_THREADS);

export const myFetch = async (_url) => {
  try {
    const response = await fetch(_url);
    const json = await response.json();
    if (json.error) {
      console.log("ERROR", JSON.stringify(json, null, 4));
      return null;
    }
    return json;
  } catch (e) {
    console.log("ERROR", e.toString());
    return null;
  }
};

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
        // https://github.com/request/request/issues/636#issuecomment-23030577
        request
          .get({ uri, gzip: true, timeout: 5000 })
          .on("error", function (e) {
            console.log("ERROR", e.toString());
            reject(e);
          })
          .on("close", () => {
            successCallback();
            resolve();
          })
          .pipe(fs.createWriteStream(filename, { flags: "w+" }));
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
