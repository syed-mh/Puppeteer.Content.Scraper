module.exports = {
  /**
   * Filesystem module
   */
  _fs: require("fs"),

  /**
   * @const { string } OUTPUT_MAIN_DIRECTORY
   */
  OUTPUT_MAIN_DIRECTORY: "./output",

  /**
   * Function to create a timestamp to use for unique file/folder naming
   *
   * @return { string } Timestamp in string format
   */
  generateTimestamp: function () {
    const now = new Date();
    return `${now.getDate()}-${now.getMonth()}-${now.getFullYear()}__${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
  },

  /**
   *
   * @param { string } FILENAME
   * @param { string } PHASE
   * @return { string } File name with extension
   */
  initFolderMeta: function (DIRECTORY_NAME, PHASE) {
    return `${DIRECTORY_NAME}-${this.generateTimestamp()}/${PHASE}`;
  },

  /**
   * Function to create a container directory for all projects within this scraper
   *
   * @return { void }
   */
  initOutputDirectory: function () {
    try {
      if (!this._fs.existsSync(this.OUTPUT_MAIN_DIRECTORY)) {
        this._fs.mkdirSync(this.OUTPUT_MAIN_DIRECTORY);
      }
      return this.OUTPUT_MAIN_DIRECTORY;
    } catch (ERROR) {
      console.log(ERROR);
    }
  },

  /**
   * Function to create a directory on demand
   *
   * @param { string } DIRECTORY_NAME
   * @return { string|void } The full relative directory path if successfully created OR if it already exists, nothing if it errros out
   */
  createFolder: function (DIRECTORY_NAME, PHASE) {
    const directory = `${this.initOutputDirectory()}/${this.initFolderMeta(
      DIRECTORY_NAME,
      PHASE
    )}`;
    try {
      // if (!this._fs.existsSync(directory)) {
      this._fs.mkdirSync(directory);
      // }
      return directory;
    } catch (ERROR) {
      console.log(ERROR);
    }
  },

  /**
   * Function to create a file
   *
   * @param { string } FILENAME
   * @param { string } FORMAT
   * @param { string|Object } CONTENT
   * @param { string } DIRECTORY_NAME
   * @param { string } PHASE
   * @return { string|void } Full relative path of create file if created OR overwritten, nothing if it errors out
   */
  createFile: function (FILENAME, FORMAT, CONTENT, DIRECTORY_NAME, PHASE) {
    const filename = `${this.createFolder(
      DIRECTORY_NAME,
      PHASE
    )}/${FILENAME}.${FORMAT}`;
    try {
      this._fs.writeFileSync(filename, CONTENT);
      return filename;
    } catch (ERROR) {
      console.log(ERROR);
    }
  },
};
