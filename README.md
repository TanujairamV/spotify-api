# Spotify Now Playing API

A simple API that exposes your current **Spotify Now Playing** track using **Spicetify** and **Vercel**.

It sends your current song from the Spotify desktop client to an API endpoint which can be used in websites, widgets, or overlays.

---

## Features

* Shows current **song title**
* Shows **artist and album**
* Returns **album cover**
* Returns **song URL**
* Shows **song duration and progress**
* Works with websites and widgets

---

## Architecture

```
Spotify Desktop
      ↓
Spicetify Extension
      ↓
Vercel API
      ↓
JSON endpoint
```

Example endpoint:

```
https://your-project.vercel.app/api/now-playing
```

---

## API Response Example

```json
{
  "isPlaying": true,
  "title": "I Think They Call This Love",
  "artist": "Elliot James Reay",
  "album": "I Think They Call This Love",
  "albumImageUrl": "https://i.scdn.co/image/ab67616d00001e02a24a9c872775ae61137e23f3",
  "songUrl": "https://open.spotify.com/track/XXXX",
  "previewUrl": null,
  "duration": 196000,
  "progress": 28222
}
```

---

# Setup

---

## 1. Deploy

Deploy this project using vercel

---

## 2. Install the Spicetify extension

Create the file:

`
~/.config/spicetify/Extensions/now-playing-api.js
`

Paste these code in it

```
(function () {

    const API = "YOURVERCELURL/api/now-playing";

    function convertImage(uri) {
        if (!uri) return "";
        if (uri.startsWith("spotify:image:")) {
            return "https://i.scdn.co/image/" + uri.replace("spotify:image:", "");
        }
        return uri;
    }

    function getSongUrl(item) {
        if (item?.external_urls?.spotify) return item.external_urls.spotify;

        if (item?.uri) {
            const id = item.uri.split(":")[2];
            return "https://open.spotify.com/track/" + id;
        }

        return "";
    }

    function getDuration(item) {
        return (
            item?.duration_ms ||
            item?.metadata?.duration ||
            0
        );
    }

    function init() {

        if (!window.Spicetify?.Player?.data) {
            setTimeout(init, 1000);
            return;
        }

        function updateNowPlaying() {

            const data = Spicetify.Player.data;
            if (!data || !data.item) return;

            const item = data.item;

            const artists = item.artists
                ? item.artists.map(a => a.name).join(", ")
                : "";

            const albumImage = convertImage(
                item.album?.images?.[0]?.url ||
                item.album?.images?.[0]?.uri
            );

            const payload = {
                isPlaying: !data.isPaused,
                title: item.name || "",
                artist: artists,
                album: item.album?.name || "",
                albumImageUrl: albumImage,
                songUrl: getSongUrl(item),
                previewUrl: item.preview_url || null,
                duration: getDuration(item),
                progress: Spicetify.Player.getProgress() || 0
            };

            fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }).catch(console.error);
        }

        Spicetify.Player.addEventListener("songchange", updateNowPlaying);

        setInterval(updateNowPlaying, 5000);

        updateNowPlaying();
    }

    init();

})();
```
Run these Commands:

```
spicetify config extensions now-playing-api.js
spicetify apply
```

Restart Spotify.

---

## 3. Test the API

Open the endpoint in your browser:

```
https://your-project.vercel.app/api/now-playing
```

If a song is playing, the API will return the current track information.

---

# Usage Example

Example JavaScript usage:

```javascript
fetch("https://your-project.vercel.app/api/now-playing")
  .then(res => res.json())
  .then(data => {
    console.log(data.title + " - " + data.artist);
  });
```

---

# Use Cases

* Website widgets
* GitHub profile widgets
* OBS streaming overlays
* Discord status integrations
* Desktop widgets

---

# License

MIT
