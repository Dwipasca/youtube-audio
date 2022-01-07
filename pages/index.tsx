import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'
import { useEffect, useState, FormEvent, useCallback } from 'react';
import VideoForm from '../components/VideoForm';
import type { VideoData, YoutubeSearchListResponse } from '../lib/video';
import VideoInfo from '../components/VideoInfo';
import VideoList from '../components/VideoList';

const VideoPlayer = dynamic(() => import('../components/VideoPlayer'));
const ShareBox = dynamic(() => import('../components/ShareBox'));

type BooleanStr = '0' | '1';

interface Props {
  videoID: string;
  data?: VideoData;
  showVideo: boolean;
}

interface SearchFormElement extends HTMLFormElement {
  q: HTMLInputElement;
}

function getVideosWithYoutubeAPI({ q = '', channelUrl, pageToken }: { channelUrl: string, pageToken?: string, q: string}) : Promise<YoutubeSearchListResponse> {
  let url = `/api/playlist?channelUrl=${channelUrl}`;
  if (pageToken) url += `&pageToken=${pageToken}`;
  if (q) url += `&q=${q}`;

  return fetch(url)
    .then(res => res.json())
}

function getVideosWithScrapping({ q = '', channelUrl, pageToken }: { channelUrl: string, pageToken?: string, q: string}) : Promise<{ items: VideoData[] }> {
  let url = `/api/search?channelUrl=${channelUrl}`;
  if (pageToken) url += `&pageToken=${pageToken}`;
  if (q) url += `&q=${q}`;

  return fetch(url)
    .then(res => res.json())
}

const Home: NextPage<Props> = ({ data, videoID, showVideo }) => {
  const [url, setUrl] = useState<string>('');
  const [q, setQ] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  // Youtube API
  const [pageToken, setPageToken] = useState<string>('');
  const [nextPageToken, setNextPageToken] = useState<string>('');
  
  const [videos, setVideos] = useState<VideoData[]>([]);
  useEffect(() => {
    if (data?.author_url) {
      setIsSearching(true);
      getVideosWithScrapping({
        channelUrl: data?.author_url,
        q,
      })
        .then(res => {
          setVideos(res.items);
          setIsSearching(false);
        })
        .catch((err) => {
          setIsSearching(false);
          throw err;
        })
    }

    console.info('Made by Abu Fatimah di Palu. Say hi https://www.linkedin.com/in/muhammad-rizki-rijal-0a711575/');
    setUrl(window.location.href);
  }, [data, q]);

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
            <VideoPlayer defaultShowVideo={showVideo} videoID={videoID} />
            <ShareBox url={url} />
            <hr />
            <div>
              <h2>Audio-audio dari {data.author}</h2>
              <form style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }} onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const form = e.target as SearchFormElement;
                setQ(form.q.value);
              }}>
                <p style={{ margin: 0, marginRight: 8 }}>Cari Video</p>
                <input style={{ padding: '4px 8px', marginRight: 8 }} type="search" name="q" />
                <button style={{ padding: '4px 8px' }}>Cari</button>
              </form>
              <div style={{ position: 'relative' }}>
                {isSearching && (<div style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.5)' }}>
                  <p style={{ textAlign: 'center', marginTop: '2rem' }}>Sedang memuat...</p>
                </div>)}
                <VideoList videos={videos} />
              </div>
            </div>
          </>
        ) : null}
      </main>
      <div dangerouslySetInnerHTML={{ __html: `<!-- Dibuat oleh Abu Fatimah di Palu -->` }} />
    </div>
  )
}

Home.getInitialProps = async function (ctx) {
  const videoID : string = (ctx.query.videoID || '') as string;
  const showVideoStr : string = (ctx.query.showVideo || '0') as BooleanStr;
  const showVideo : boolean = showVideoStr !== '0';

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

    return { data: videoData, videoID, showVideo };
  } catch (err) {
    return { videoID, showVideo }
  }
}

export default Home
