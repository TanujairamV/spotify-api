let nowPlaying = {
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

export default function handler(req, res) {

  if (req.method === "POST") {
    nowPlaying = req.body;

    return res.status(200).json({
      status: "updated"
    });
  }

  if (req.method === "GET") {
    return res.status(200).json(nowPlaying);
  }

  res.status(405).json({ error: "Method not allowed" });
}