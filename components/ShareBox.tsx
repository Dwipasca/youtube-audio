import useClipboard from "react-use-clipboard";
import { useMemo } from "react";

type Props = {
  url: string;
}

function ShareBox({ url }: Props) {
  const urlText = useMemo(() => {
    return url;
  }, [url]);
  const [isCopied, setCopied] = useClipboard(urlText, {
    successDuration: 2000,
  });
  return (
    <>
      <div className="shareBox">
        <input className="shareBox__input" value={urlText} readOnly />
        <button onClick={setCopied} className="shareBox__button">Bagikan</button>
      </div>
      {isCopied ? <p style={{ textAlign: 'right' }}>Tersalin di clipboard</p> : null}
    </>
  );
}

export default ShareBox;
