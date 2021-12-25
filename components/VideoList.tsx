import { VideoData } from '../lib/video';

function VideoItem({ video }: { video: VideoData }) {
  return (
    <div>
      <div>{video.title}</div>
      <div>{video.publishedAt || '-'}</div>
      <div><a href={`/?videoID=${video.id}`}>Buka</a></div>
    </div>
  );
}

function VideoList({ videos }: { videos: VideoData[] }) {
  return (
    <div>
      {videos.map(video => (
        <VideoItem key={video.id} video={video} />
      ))}
    </div>
  );
}
export default VideoList;