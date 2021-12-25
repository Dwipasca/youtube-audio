import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import VideoForm from '../components/VideoForm';
import type { VideoMetadata, VideoData, YoutubeSearchListResponse } from '../lib/video';
import VideoInfo from '../components/VideoInfo';
import VideoList from '../components/VideoList';

const VideoPlayer = dynamic(() => import('../components/VideoPlayer'));
const ShareBox = dynamic(() => import('../components/ShareBox'));

interface Props {
  videoID: string;
  data?: VideoData;
}

function getVideos(channelUrl: string, pageToken?: string) : Promise<YoutubeSearchListResponse> {
  let url = `/api/playlist?channelUrl=${channelUrl}`;
  if (pageToken) url += `pageToken=${pageToken}`;

  return fetch(url)
    .then(res => res.json())
}
const Home: NextPage<Props> = ({ data, videoID }) => {
  const [url, setUrl] = useState<string>('');
  const [videos, setVideos] = useState<VideoData[]>([]);
  useEffect(() => {
    if (data?.author_url) {
      // getVideos(getChannelIdFromChannelUrl(data?.author_url));
      getVideos(data?.author_url)
        .then(res => {
          const vids : VideoData[] = res.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            author: item.snippet.channelTitle,
            author_url: data?.author_url,
          }));
          setVideos(vids);
        })
    }

    console.info('Made by Abu Fatimah di Palu. Say hi https://www.linkedin.com/in/muhammad-rizki-rijal-0a711575/');
    setUrl(window.location.href);
  }, [data]);

  const title = data?.title || '';
  const htmlTitle = data ? data.title : 'Selamat Datang';
  const htmlDescription = title ? `Dengarkan kajian ${title}` : 'Web untuk mendengar audio kajian di youtube';
  
  return (
    <div className={styles.container}>
      <Head>
        <title>{`Audio - ${htmlTitle}`}</title>
        <meta name="description" content={htmlDescription} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={htmlTitle} />
        <meta property="og:description" content={htmlDescription} />
      </Head>

      <main className="container">
        <h1>Pemutar Audio Youtube</h1>

        <div>
          <p>Bismillah. Website ini dibuat untuk antum yang ingin mendengarkan kajian yang di-<i>publish</i> di youtube tanpa video. Baarokallohu fiikum.</p>
        </div>


        <VideoForm />
        {data ? (
          <>
            <VideoInfo data={data} />
            <VideoPlayer videoID={videoID} />
            <ShareBox url={url} />
            <hr />
            <VideoList videos={videos} />
          </>
        ) : null}
      </main>
      <div dangerouslySetInnerHTML={{ __html: `<!-- Dibuat oleh Abu Fatimah di Palu -->` }} />
    </div>
  )
}

Home.getInitialProps = async function (ctx) {
  const videoID : string = (ctx.query.videoID || '') as string;
  // 6o0BrP41SAo
  try {
    const data = await fetch(`https://www.youtube.com/oembed?url=https://youtu.be/${videoID}&format=json`)
      .then(function (response) {
        if (response.status === 400) {
          
          return { videoID };
        }
        return response.json();
      });
    
    const videoData = {
      id: videoID,
      title: data.title,
      author: data.author_name,
      author_url: data.author_url,
    };

    return { data: videoData, videoID };
  } catch (err) {
    return { videoID }
  }
}

export default Home
