let nowPlaying = {
  isPlaying: false,
  title: "",
  artist: "",
  album: "",
  albumImageUrl: "",
  songUrl: "",
  previewUrl: null,
  duration: 0,
  progress: 0
};

export default function handler(req, res) {

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    return res.status(200).json(nowPlaying);
  }

  if (req.method === "POST") {
    nowPlaying = req.body;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
