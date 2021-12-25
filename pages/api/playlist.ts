import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}  

const apiKey = process.env.YOUTUBE_API_KEY;

async function getVideos(channelId: string, pageToken?: string) {
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${apiKey}&maxResults=50&channelId=${channelId}&maxResults=20`;
  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }
  console.log({ url })
  return fetch(url).then(res => {
    if (res.status !== 200) {
      console.log(res.statusText);
      return Promise.reject(new Error('Cannot get videos'));
    }

    return res.json();
  });
}

function getChannelID(channelUrl: string) {
  return fetch(channelUrl)
    .then(res => res.text())
    .then((page: string) => {
      const result = page.match(/channel_id=([\w|\-|\_]+)/);
      
      if (Array.isArray(result)) {
        return result[1];
      }

      return '';
    });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let channelId = '';
  const channelUrl = req.query.channelUrl as string;
  const pageToken = req.query.pageToken as string;
  
  try {
    channelId = await getChannelID(channelUrl);
  } catch (error) {
    res.status(400).json({ message: `cannot get channel id for url ${channelUrl}` })
  }

  console.log({ channelId, channelUrl, pageToken })

  getVideos(channelId, pageToken)
    .then((data) => {
      res.status(200).json(data)
    }) 
    .catch((err) => {
      res.status(400).json(err.message)
    });
}
