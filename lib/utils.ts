// Taken from stackoverflow
export function youTubeGetID(url: string) : string {
  let ID = '';
  let urls = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (urls[2] !== undefined) {
    ID = urls[2].split(/[^0-9a-z_\-]/i)[0];
  } else {
    ID = url;
  }
  return ID;
}
  