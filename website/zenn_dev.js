const { Book } = require("../book");
const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer-core");
const cliProgress = require("cli-progress");
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

exports.tmpdir = os.tmpdir();
/**
 * @param {puppeteer.Browser} browser
 * @param {string} url
 * @returns {Book}
 */
exports.run = async function (browser, url) {
  const dpathTemp = exports.tmpdir;
  // Go to top page and get book title
  const page = await browser.newPage();
  await page.goto(url);
  const h1 = await page.$("h1");
  const h1Text = await h1.getProperty("textContent");
  const title = await h1Text.jsonValue();
  // Get chapters' URL
  const chapters = await page.$$(`#chapters > a`);
  const urlsChapter = [];
  for (const chapter of chapters) {
    const href = await (await chapter.getProperty("href")).jsonValue();
    urlsChapter.push(href);
  }
  // Generate each chapters' PDF
  bar.start(urlsChapter.length, 0);
  const fpathsPdf = [];
  for (let i = 0, l = urlsChapter.length; i < l; i++) {
    bar.update(i + 1);
    const url = urlsChapter[i];
    const fpathPdf = path.join(dpathTemp, `${i}.pdf`);
    await page.goto(url);
    await page.evaluate(() => {
      const aside = document.querySelector("article aside");
      aside.style.setProperty("display", "none");
      const section = document.querySelector("article section");
      section.style.setProperty("padding-left", "0px");
    });
    await page.pdf({
      path: fpathPdf,
      printBackground: true,
      format: "A4",
      margin: {
        top: "9mm",
        right: "9mm",
        left: "9mm",
        bottom: "9mm",
      },
    });
    fpathsPdf.push(fpathPdf);
  }
  bar.stop();
  await page.close();
  return new Book(title, fpathsPdf);
};
