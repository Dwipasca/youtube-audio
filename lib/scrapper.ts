import puppeteer from 'puppeteer';
import { VideoData } from './video';

interface SearchResultRawData {

}


export async function scrapeYoutubeChannelSearch(channelUrl: string, query: string = '*') : Promise<VideoData[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = `${channelUrl}/search?query=${query}`;
  console.log(url)
  await page.goto(`${channelUrl}/search?query=${query}`, {
    waitUntil: 'networkidle2',
  });
  const data : Pick<VideoData, 'id' | 'title'>[] = await page.evaluate(() => {
    function getIdFromHref(href: string) {
      return href.replace('/watch?v=', '');
    }
      
    // return document.body.innerHTML;
    let els = Array.from(document.querySelectorAll('a#video-title'));
    // let els = Array.from(document.querySelectorAll('div#meta'));
    // console.log('els', els);

    return els.map((el) => {
        const e = el as unknown as HTMLElement;
        const data: Pick<VideoData, 'id' | 'title'> = {
          id: getIdFromHref(e.getAttribute('href') || ''),
          title: e.innerText,
        };
        
        return data;
    });
  });

//   console.log(data.match(/href\=\"(.*)\"/g))

  return data.map(item => ({
      ...item,
      author: channelUrl,
      author_url: channelUrl,
  }));
}