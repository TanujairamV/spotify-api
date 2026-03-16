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

let lastPlayed = [];

export default function handler(req, res) {

  // GET current song
  if (req.method === "GET") {
    return res.status(200).json(nowPlaying);
  }

  // POST update from Spicetify
  if (req.method === "POST") {

    const song = req.body;

    nowPlaying = song;

    // store history if song changed
    if (
      lastPlayed.length === 0 ||
      lastPlayed[0].songUrl !== song.songUrl
    ) {

      lastPlayed.unshift({
        ...song,
        playedAt: new Date().toISOString()
      });

      // limit history
      if (lastPlayed.length > 50) {
        lastPlayed.pop();
      }
    }

    return res.status(200).json({
      success: true
    });
  }

  res.status(405).json({
    error: "Method not allowed"
  });
}
