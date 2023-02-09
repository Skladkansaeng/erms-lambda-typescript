import { readdirSync } from "fs";
import { handlerPath } from "@libs/handler-resolver";

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const outSize = () => {
  try {
    const LIST_DIRECTORY = getDirectories(`${handlerPath(__dirname)}`);
    let exportValue = {};
    for (const ld of LIST_DIRECTORY) {
      exportValue[ld] = require(`./${ld}`).default;
    }
    // console.log("exportValue : ",exportValue)
    return {
      ...exportValue,
    };
  } catch (error) {
    throw error;
  }
};
export default outSize;
