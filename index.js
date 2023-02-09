//Import nessecary api modules
const YoutubeMusicApi = require('youtube-music-api')
const ytm = new YoutubeMusicApi()

const { Innertube, UniversalCache } = require('youtubei.js');

//import utilities
const fs = require('fs')
const config = require('./config.json')


//import misc.json
var misc = require('./misc.json')

//Get your cookie from your browser

var cookie = config.cookie
//Print out the last song from you history

var youtube;

async function runScript() {
    youtube = await Innertube.create({
        cache: new UniversalCache()
    });

    youtube.session.on('auth-pending', (data) => {
        console.log(`Go to ${data.verification_url} in your browser and enter code ${data.user_code} to authenticate.`);
    });

    // 'auth' is fired once the authentication is complete
    youtube.session.on('auth', ({ credentials }) => {
        console.log('Sign in successful:', credentials);
    });

    // 'update-credentials' is fired when the access token expires, if you do not save the updated credentials any subsequent request will fail 
    youtube.session.on('update-credentials', ({ credentials }) => {
        console.log('Credentials updated:', credentials);
    });

    await youtube.session.signIn();

    await youtube.session.oauth.cacheCredentials();













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
        misc.lastStreamThumbnailURL = getLatestYTMusicThumbnail(lastSong)
        misc.lastStreamTime = Date.now()
        patchMisc()
        console.log("A new song was played and saved")
    }


    var lastVideo = await getLatestYTVideo();

    if (lastVideo.videoURL == misc.lastYTStreamURL) {
        console.log("No new video played")
    }
    else {
        misc.lastYTStreamName = lastVideo.videoName
        misc.lastYTStreamURL = lastVideo.videoURL
        misc.lastYTStreamThumbnailURL = lastVideo.videoThumbnailURL
        patchMisc()
        console.log("A new video was played and saved")
    }

    console.log("Waiting for next check")
}

setInterval(runScript, 30000);
runScript().catch(console.error);

//YTMusic API functions
async function getLatestYTMusicSong() {
    return new Promise((res) => {
        ytm.initalize(cookie).then(() => {
            ytm.getUserHistory().then((history) => {
                //console.log(history.content[0])
                return res(history.content[0])
            })
        })
    }
    )
}

function getLatestYTMusicName(song) {
    return song.name
}

function getLatestYTMusicArtist(song) {
    var artist;
    if (Array.isArray(song.author)) {
        //add all artists to the artist string divided by an '&'
        for (var i = 0; i < song.author.length; i++) {
            if (i == 0) {
                artist = song.author[i].name
            } else {
                artist = artist + " & " + song.author[i].name
            }
        }
    }
    else {
        artist = song.author.name
    }
    return artist
}

function getLatestYTMusicURL(song) {
    return "https://music.youtube.com/watch?v=" + song.videoId
}

function getLatestYTMusicThumbnail(song) {
    return "https://img.youtube.com/vi/" + song.videoId + "/maxresdefault.jpg"
}
//End of YTMusic API functions

//YT API functions
async function getLatestYTVideo() {
    var ythistory = await youtube.getHistory();
    var videoName;
    var videoURL;
    var videoThumbnailURL;


    return new Promise((res) => {

        if (ythistory.sections[0].contents[0].type == "ReelShelf") {
            videoName = ythistory.sections[0].contents[1].title.runs[0].text
            videoURL = "https://www.youtube.com/watch?v=" + ythistory.sections[0].contents[1].id
            videoThumbnailURL = ythistory.sections[0].contents[1].thumbnails[0].url
            return res({ videoName, videoURL, videoThumbnailURL })
        }
        else {
            videoName = ythistory.sections[0].contents[0].title.runs[0].text
            videoURL = "https://www.youtube.com/watch?v=" + ythistory.sections[0].contents[0].id
            videoThumbnailURL = ythistory.sections[0].contents[0].thumbnails[0].url
            return res({ videoName, videoURL, videoThumbnailURL })
        }
    })
}



//End of YT API functions

function patchMisc() {
    //console.log(misc)
    fs.writeFileSync('./misc.json', JSON.stringify(misc, null, 4))
}
