import { useCallback } from "react";
import { youTubeGetID } from '../lib/utils';
import style from './VideoForm.module.css';

interface Props {}

interface VideoFormElement extends HTMLFormElement {
    videoUrl: HTMLInputElement;
}

function VideoForm(props: Props) {
  const handleSubmit = useCallback((event: React.SyntheticEvent<VideoFormElement>) => {
    event.persist();
    event.preventDefault();
    const form = event.target as VideoFormElement;
    const videoID = youTubeGetID(form.videoUrl.value);
    window.location.href = `/?videoID=${videoID}`;
  }, []);
  return (
    <>
      <p>Masukkan URL Youtube dan tekan tombol submit.</p>
      <form className={style.videoForm} onSubmit={handleSubmit}>
        <input placeholder="Contoh: https://www.youtube.com/watch?v=GIDCZ_-3clw" className={style.videoForm__input} name="videoUrl" autoComplete="off" />
        <button className={style.videoForm__button}>Submit</button>
      </form>
    </>
  );
}

export default VideoForm;