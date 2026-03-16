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
