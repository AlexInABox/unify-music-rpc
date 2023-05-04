//Import nessecary api modules

const { Innertube, UniversalCache } = require('youtubei.js');

//import utilities
const fs = require('fs')
var request = require('request');


//import misc.json
var misc = require('./misc.json');
const config = require('./config.json');
const { getSystemErrorMap } = require('util');

var youtube;

//list of all possible thumnail urls:
/*
Width | Height | URL
------|--------|----
640   | 480    | https://i.ytimg.com/vi/<VIDEO ID>/sd1.jpg
640   | 480    | https://i.ytimg.com/vi/<VIDEO ID>/sd2.jpg
640   | 480    | https://i.ytimg.com/vi/<VIDEO ID>/sd3.jpg
640   | 480    | https://i.ytimg.com/vi/<VIDEO ID>/sddefault.jpg
1280  | 720    | https://i.ytimg.com/vi/<VIDEO ID>/hq720.jpg
1920  | 1080   | https://i.ytimg.com/vi/<VIDEO ID>/maxresdefault.jpg

Width | Height | URL
------|--------|----
120   | 90     | https://i.ytimg.com/vi/<VIDEO ID>/1.jpg
120   | 90     | https://i.ytimg.com/vi/<VIDEO ID>/2.jpg
120   | 90     | https://i.ytimg.com/vi/<VIDEO ID>/3.jpg
120   | 90     | https://i.ytimg.com/vi/<VIDEO ID>/default.jpg
320   | 180    | https://i.ytimg.com/vi/<VIDEO ID>/mq1.jpg
320   | 180    | https://i.ytimg.com/vi/<VIDEO ID>/mq2.jpg
320   | 180    | https://i.ytimg.com/vi/<VIDEO ID>/mq3.jpg
320   | 180    | https://i.ytimg.com/vi/<VIDEO ID>/mqdefault.jpg
480   | 360    | https://i.ytimg.com/vi/<VIDEO ID>/0.jpg
480   | 360    | https://i.ytimg.com/vi/<VIDEO ID>/hq1.jpg
480   | 360    | https://i.ytimg.com/vi/<VIDEO ID>/hq2.jpg
480   | 360    | https://i.ytimg.com/vi/<VIDEO ID>/hq3.jpg
480   | 360    | https://i.ytimg.com/vi/<VIDEO ID>/hqdefault.jpg

*/

async function runScript() {
    youtube = await Innertube.create({
        cache: new UniversalCache()
    });

    youtube.session.on('auth-pending', (data) => {
        console.log(`Go to ${data.verification_url} in your browser and enter code ${data.user_code} to authenticate.`);

        //send the message to the discord channel if a webhook is set
        if (config.discordWebhook != "") {
            var options = {
                'method': 'POST',
                'url': config.discordWebhook,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'content': `Go to ${data.verification_url} in your browser and enter code ${data.user_code} to (re)- authenticate.`
                })

            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
            });
        }
    });

    // 'auth' is fired once the authentication is complete
    youtube.session.on('auth', ({ credentials }) => {
        console.log('Sign in successful:', credentials);

        //send the message to the discord channel if a webhook is set
        if (config.discordWebhook != "") {
            var options = {
                'method': 'POST',
                'url': config.discordWebhook,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'content': `Sign in successful!`
                })

            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
            });
        }
    });

    // 'update-credentials' is fired when the access token expires, if you do not save the updated credentials any subsequent request will fail 
    youtube.session.on('update-credentials', ({ credentials }) => {
        youtube.session.oauth.cacheCredentials();
        console.log('Credentials updated/refreshed:', credentials);
    });


    await youtube.session.signIn();

    await youtube.session.oauth.cacheCredentials();

    //GEt the latest YTMusic Song
    try {
        var lastSong = await getLatestYTMusicSong()

        lastStreamName = getLatestYTMusicName(lastSong)
        lastStreamArtist = getLatestYTMusicArtist(lastSong)


        if (lastStreamName == misc.lastStreamName && lastStreamArtist == misc.lastStreamArtist) {
            console.log("No new song played")

        }
        else {

            misc.lastStreamName = lastStreamName
            misc.lastStreamArtist = lastStreamArtist
            misc.lastStreamUrl = getLatestYTMusicURL(lastSong)
            misc.lastStreamThumbnailURL = await getLatestYTMusicThumbnail(lastSong)
            misc.lastStreamTime = Date.now()
            patchMisc()
            console.log("A new song was played and saved")
        }

    } catch (error) {
        console.log("Something went wrong trying to fetch the latest YTMusic Song. You prb havent listened to any song today!")
        console.log(error)
    }

    //Get the latest YouTube Video
    try {
        var lastVideo = await getLatestYTVideo();
        console.log(lastVideo)

        if (lastVideo.videoURL == misc.lastYTStreamURL) {
            console.log("No new video played")
        }
        else {
            misc.lastYTStreamName = lastVideo.videoName
            misc.lastYTStreamURL = lastVideo.videoURL
            misc.lastYTStreamThumbnailURL = lastVideo.videoThumbnailURL
            misc.lastYTStreamChannelName = lastVideo.videoChannel
            patchMisc()
            console.log("A new video was played and saved")
        }
    } catch (error) {
        console.log("Something went wrong trying to fetch the latest YouTube Video. You prb havent watched any video today!")
        console.log(error)
    }


    console.log("Waiting for next check")
}

setInterval(runScript, 30000);
runScript().catch(console.error);

//YTMusic API functions
async function getLatestYTMusicSong() {
    return await youtube.actions.execute('/browse', { client: 'YTMUSIC', browseId: 'FEmusic_history', parse: true });

}

function getLatestYTMusicName(history) {
    return history.contents_memo.get("MusicResponsiveListItem")[0].title
}

function getLatestYTMusicArtist(history) {
    var artists;
    //check if there are multiple artists by checking if the object artists exists
    //if it does not exist, the object is called authors

    //here the function .isArray() is used to check if the object is an array.
    //the function also returns false if the object does not exist wich is perfect for this case
    if (Array.isArray(history.contents_memo.get("MusicResponsiveListItem")[0].artists)) {
        var length = history.contents_memo.get("MusicResponsiveListItem")[0].artists.length
        for (let i = 0; i < length; i++) {
            if (i == 0) {
                artists = history.contents_memo.get("MusicResponsiveListItem")[0].artists[i].name
            }
            else {
                artists = artists + " & " + history.contents_memo.get("MusicResponsiveListItem")[0].artists[i].name
            }
        }
    } else {
        artists = history.contents_memo.get("MusicResponsiveListItem")[0].authors.name
    }

    return artists;
}

function getLatestYTMusicURL(history) {
    return "https://music.youtube.com/watch?v=" + history.contents_memo.get("MusicResponsiveListItem")[0].id
}

//go through all possible thumbnail urls (sorted by quality descending) and return the first one that is not the default thumbnail
async function getLatestYTMusicThumbnail(history) {
    return new Promise((async (res) => {
        const videoId = history.contents_memo.get("MusicResponsiveListItem")[0].id
        const thumbnailURLs = [
            "https://i.ytimg.com/vi/" + videoId + "/maxresdefault.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/hq720.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/sddefault.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/sd1.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/sd2.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/sd3.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/hq1.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/hq2.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/hq3.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/mqdefault.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/mq1.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/mq2.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/mq3.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/default.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/1.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/2.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/3.jpg",
            "https://i.ytimg.com/vi/" + videoId + "/0.jpg"
        ]
        for (let i = 0; i < thumbnailURLs.length; i++) {
            try {
                if (await isNotDefault(thumbnailURLs[i])) {
                    console.log("Found thumbnail: " + i)
                    return res(thumbnailURLs[i]);
                }
            } catch (error) {
                return res("https://img.youtube.com/vi/0/maxresdefault.jpg");
            }
        }
        return res("https://img.youtube.com/vi/0/maxresdefault.jpg");
    }
    ))
}

function isNotDefault(url) { //get the uint8Array buffer and compare it to the default buffer string ("lorem ipsum")
    return new Promise(async (res) => {
        const defaultResponse = await fetch("https://i.ytimg.com/vi/vi/0/maxresdefault.jpg"); //TODO: only fetch once (or once per iteration)
        const defaultBuffer = await defaultResponse.arrayBuffer();
        const defaultUint8Array = new Uint8Array(defaultBuffer);

        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        res(uint8Array.toString() != defaultUint8Array.toString())
    })
}
//End of YTMusic API functions

//YT API functions
async function getLatestYTVideo() {
    var ythistory = await youtube.getHistory();
    var videoName;
    var videoURL;
    var videoThumbnailURL;
    var videoChannel;

    //console.log(ythistory.sections[0].contents[1])


    return new Promise((res) => {

        if (ythistory.sections[0].contents[0].type == "ReelShelf") {
            videoName = ythistory.sections[0].contents[1].title.runs[0].text
            videoURL = "https://www.youtube.com/watch?v=" + ythistory.sections[0].contents[1].id
            videoThumbnailURL = ythistory.sections[0].contents[1].thumbnails[0].url
            videoChannel = ythistory.sections[0].contents[1].author.name
            return res({ videoName, videoURL, videoThumbnailURL, videoChannel })
        }
        else {
            videoName = ythistory.sections[0].contents[0].title.runs[0].text
            videoURL = "https://www.youtube.com/watch?v=" + ythistory.sections[0].contents[0].id
            videoThumbnailURL = ythistory.sections[0].contents[0].thumbnails[0].url
            videoChannel = ythistory.sections[0].contents[0].author.name
            return res({ videoName, videoURL, videoThumbnailURL, videoChannel })
        }
    })
}



//End of YT API functions

function patchMisc() {
    //console.log(misc)
    fs.writeFileSync('./misc.json', JSON.stringify(misc, null, 4))
}
