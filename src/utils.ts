import * as fs from "fs";

export function testAndCreateFolder(path: string): Error | null {
  try {
    // check if folder exist
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    // check if folder is writable
    fs.accessSync(path, fs.constants.W_OK);

    return;
  } catch (err) {
    return err;
  }
}
