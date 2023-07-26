const fs = require("fs");
const path = require("path");
const { input } = require("@inquirer/prompts");
const puppeteer = require("puppeteer-core");
const PDFMerger = require("pdf-merger-js");
const zennDev = require("./website/zenn_dev");

const DPATH_PDF = "./pdf";
const isProd = process.env.NODE_ENV === "production";
const apiKey = process.env.BROWSERLESS_API_KEY;
const merger = new PDFMerger();

/** @returns {Promise<puppeteer.Browser>} */
const getBrowser = async () => {
  if (isProd) {
    return puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${apiKey}`,
    });
  }
  return await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: "/usr/bin/chromium",
    headless: true,
  });
};
/** @param {string} url */
const getWebsite = (url) => {
  const hostname = new URL(url).hostname;
  const result = {
    website: undefined,
    isImplemented: false,
  };
  switch (hostname) {
    case "zenn.dev":
      result.website = zennDev;
      result.isImplemented = true;
      break;
  }
  return result;
};
/** @param {string} path */
const mkdir = (path) => {
  if (fs.existsSync(path)) {
    if (fs.statSync(path).isDirectory()) {
      return;
    }
    throw new Error(`The following path is not a directory: ${path}`);
  }
  fs.mkdirSync(path);
};
(async () => {
  mkdir(DPATH_PDF);
  /** @type {string} */
  const urlBook = await input({ message: "Enter book url:" });
  const { website, isImplemented } = getWebsite(urlBook);
  if (!isImplemented) {
    console.log("Not yet implemented.");
    return;
  }
  const browser = await getBrowser();
  const { title, fpathsPdf } = await website.run(browser, urlBook);
  for (const fpathPdf of fpathsPdf) {
    await merger.add(fpathPdf);
  }
  const fpathPdf = path.join("pdf", `${title}.pdf`);
  await merger.save(fpathPdf);
  for (const fpathPdf of fpathsPdf) {
    fs.unlinkSync(fpathPdf);
  }
  await browser.close();
})();
