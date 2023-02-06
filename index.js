//Import nessecary api modules
const YoutubeMusicApi = require('youtube-music-api')
const ytm = new YoutubeMusicApi()

//import utilities
const fs = require('fs')
const config = require('./config.json')


//import misc.json
var misc = require('./misc.json')

//Get your cookie from your browser

var cookie = config.cookie
//Print out the last song from you history

async function runScript() {
    var lastSong = await getLatestYTSong()

    lastStreamName = getLatestYTName(lastSong)
    lastStreamArtist = getLatestYTArtist(lastSong)


    if (lastStreamName == misc.lastStreamName && lastStreamArtist == misc.lastStreamArtist) {
        console.log("No new song played")
        return;
    }
    else {

        misc.lastStreamName = lastStreamName
        misc.lastStreamArtist = lastStreamArtist
        misc.lastStreamUrl = getLatestYTURL(lastSong)
        misc.lastStreamThumbnailURL = getLatestYTThumbnail(lastSong)
        misc.lastStreamTime = Date.now()
        patchMisc()
        console.log("A new song was played and saved")
    }

    console.log("Waiting for next check")
}

setInterval(runScript, 30000);
runScript().catch(console.error);

async function getLatestYTSong() {
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

function getLatestYTName(song) {
    return song.name
}

function getLatestYTArtist(song) {
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

function getLatestYTURL(song) {
    return "https://music.youtube.com/watch?v=" + song.videoId
}

function getLatestYTThumbnail(song) {
    return "https://img.youtube.com/vi/" + song.videoId + "/maxresdefault.jpg"
}

function patchMisc() {
    //console.log(misc)
    fs.writeFileSync('./misc.json', JSON.stringify(misc, null, 4))
}
