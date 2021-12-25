import { VideoData } from "../lib/video";
import style from './VideoInfo.module.css';

interface Props {
  data?: VideoData
}

function VideoInfo (props: Props) {
  const { data } = props;
  if (!data) return null;
  return (
    <div className={style.videoInfo}>
      <h1>{data.title}</h1>
      <div>Channel: {data.author}</div>
    </div>
  );
}

export default VideoInfo;
