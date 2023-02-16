//Import nessecary api modules

const { Innertube, UniversalCache } = require('youtubei.js');

//import utilities
const fs = require('fs')


//import misc.json
var misc = require('./misc.json')

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
            misc.lastStreamThumbnailURL = getLatestYTMusicThumbnail(lastSong)
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

function getLatestYTMusicThumbnail(history) {
    return "https://img.youtube.com/vi/" + history.contents_memo.get("MusicResponsiveListItem")[0].id + "/maxresdefault.jpg"
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
