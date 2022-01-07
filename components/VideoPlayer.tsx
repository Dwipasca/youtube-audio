import Plyr from 'plyr'
import 'plyr-react/dist/plyr.css'
import { useEffect, useState } from 'react';

interface Props {
  videoID: string;
  defaultShowVideo?: boolean;
}

function Player(props: Props) {
  const { videoID, defaultShowVideo = false } = props;
  const [isDefaultShowVideo] = useState<boolean>(defaultShowVideo);
  const [isShowVideo, setShowVideo] = useState<boolean>(defaultShowVideo);
  const className = isShowVideo ? 'show-video' : '';
  const options = {
    hideControls: false,
    controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'captions']
  };

  useEffect(() => {
    new Plyr('#player', options);
  }, []);

  return (
    <div className={className}>
      <div id="player" data-plyr-provider="youtube" data-plyr-embed-id={videoID}  />

      {isDefaultShowVideo && <button onClick={() => setShowVideo(!isShowVideo)}>{isShowVideo ? 'Sembunyi Video' : 'Tampilkan Video'}</button>}
    </div>
  );
}

export default Player;