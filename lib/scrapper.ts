// with reference https://github.com/whitep4nth3r/puppeteer-demo/blob/main/api/screenshot.js
import puppeteer from 'puppeteer';
import { VideoData } from './video';
const chrome = require("chrome-aws-lambda");

const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function getOptions() {
  const isDev = process.env.NODE_ENV === 'development';
  let options;
  if (isDev) {
    options = {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }
  return options;
}
  
export async function scrapeYoutubeChannelSearch(channelUrl: string, query: string = '*') : Promise<VideoData[]> {
  const opts = await getOptions();
  const browser = await puppeteer.launch(opts);
  const page = await browser.newPage();
  const url = `${channelUrl}/search?query=${query}`;

  console.log('Scrapping: ' + url)

  await page.goto(`${channelUrl}/search?query=${query}`, {
    waitUntil: 'networkidle2',
  });
  const data : Pick<VideoData, 'id' | 'title'>[] = await page.evaluate(() => {
    function getIdFromHref(href: string) {
      return href.replace('/watch?v=', '');
    }
      
    let els = Array.from(document.querySelectorAll('a#video-title'));
    
    return els.map((el) => {
        const e = el as unknown as HTMLElement;
        const data: Pick<VideoData, 'id' | 'title'> = {
          id: getIdFromHref(e.getAttribute('href') || ''),
          title: e.innerText,
        };
        
        return data;
    });
  });

  return data.map(item => ({
    ...item,
    author: channelUrl,
    author_url: channelUrl,
  }));
}