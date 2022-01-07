// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { scrapeYoutubeChannelSearch } from '../../lib/scrapper';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const channelUrl = req.query.channelUrl as string;
  const q = req.query.q as string;
  const data = await scrapeYoutubeChannelSearch(channelUrl, q);
  res.status(200).json({
    items: data,
  });
}
