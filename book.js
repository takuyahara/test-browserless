exports.Book = class {
  /**
   * @param {string} title
   * @param {string[]} fpathsPdf
   */
  constructor(title, fpathsPdf) {
    this.title = title;
    this.fpathsPdf = fpathsPdf;
  }
};
