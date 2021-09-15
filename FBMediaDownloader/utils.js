import fs from "fs";

export const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const saveToFile = (fileName, data, override = false) => {
  console.log(`Writting to ${fileName}...`);
  fs.writeFileSync(fileName, data, { flag: override ? "w" : "a+" }, (err) => {
    if (err) throw err;
    console.log("> Saved!");
  });
};
