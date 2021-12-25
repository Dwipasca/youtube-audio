import Plyr from 'plyr'
import 'plyr-react/dist/plyr.css'
import { useMemo, useRef, useEffect } from 'react';

interface Props {
  videoID: string;
}

function Player(props: Props) {
  const videoID = props.videoID;
  const options = {
    hideControls: false,
    controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'captions']
  };

  useEffect(() => {
    new Plyr('#player', options);
  }, []);

  return (
    <div>
      <div id="player" data-plyr-provider="youtube" data-plyr-embed-id={videoID}  />
      {/* <Plyr ref={ref} source={{
      type: 'video',
      sources: [
        { src: videoID, provider: 'youtube' }
      ]
    }} options={options} /> */}
    </div>
  );
}

export default Player;