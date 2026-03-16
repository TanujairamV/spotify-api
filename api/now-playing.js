export default function handler(req, res) {

  const data = {
    isPlaying: false,
    title: "",
    artist: "",
    album: "",
    albumImageUrl: "",
    songUrl: "",
    previewUrl: "",
    duration: 0,
    progress: 0
  };

  res.status(200).json(data);

}
