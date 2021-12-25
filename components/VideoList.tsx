import { VideoData } from '../lib/video';

const monthMap = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'Mei',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Agu',
  '09': 'Sep',
  '10': 'Okt',
  '11': 'Nov',
  '12': 'Des',
}
function formatDate(date: string) {
  const yyyy = date.slice(0, 4);
  const mm = date.slice(5, 7) as keyof typeof monthMap;
  const dd = date.slice(8, 10);

  return `${dd} ${monthMap[mm]} ${yyyy}`;
}

function VideoItem({ video }: { video: VideoData }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem 2rem', borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }} dangerouslySetInnerHTML={{ __html: video.title }}></h3>
      {/* <div style={{ marginBottom: 8 }}>{formatDate(video.publishedAt || '')}</div> */}
      <div><a style={{ textDecoration: 'underline' }} href={`/?videoID=${video.id}`}>Putar</a></div>
    </div>
  );
}

function VideoList({ videos }: { videos: VideoData[] }) {
  return (
    <div>
      {videos.map(video => (
        <div key={video.id} style={{ marginBottom: 20 }}>
          <VideoItem  video={video} />
        </div>
      ))}
    </div>
  );
}
export default VideoList;