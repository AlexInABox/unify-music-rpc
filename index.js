//Import nessecary api modules
const YoutubeMusicApi = require('youtube-music-api')
const ytm = new YoutubeMusicApi()

//import utilities
const fs = require('fs')


//import misc.json
var misc = require('./misc.json')

//Get your cookie from your browser

var cookie = "YSC=iyo3H_kWO18; CONSENT=PENDING+063; SOCS=CAISNQgREitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjMwMTMxLjA2X3AwGgJkZSACGgYIgOP7ngY; DEVICE_INFO=ChxOekU1TmpZMk5qazNNalV6TWpneE1EVXhNdz09EPvk/p4GGPvk/p4G; VISITOR_INFO1_LIVE=-a1gi9a-lj4; SID=SwgeyLzkoavZ7eldSnqpQceqsUCS0tK4ru8W9Fhbdo8RC6vq2q0TlHy7TIdk8AigJ5KF8Q.; __Secure-1PSID=SwgeyLzkoavZ7eldSnqpQceqsUCS0tK4ru8W9Fhbdo8RC6vqxo4W8nTzMuIWGXqo8f0hhQ.; __Secure-3PSID=SwgeyLzkoavZ7eldSnqpQceqsUCS0tK4ru8W9Fhbdo8RC6vqPYhK_PHlJiOckTdDhkc2Sg.; HSID=ACUqtiMrA3pBtsOZk; SSID=AZJNdWH86H5flUJmF; APISID=Ue1ZD4fMQHV6ItlC/A0Q8e_wMIhM0H7Ci3; SAPISID=V-lhk2pfMRx1Zoql/As8FE8fW34X1PWDec; __Secure-1PAPISID=V-lhk2pfMRx1Zoql/As8FE8fW34X1PWDec; __Secure-3PAPISID=V-lhk2pfMRx1Zoql/As8FE8fW34X1PWDec; LOGIN_INFO=AFmmF2swRQIhAIni6aQg4RpwdyHUXJu3gfnRYEIrJTOQQ2atBHC-pG6uAiBLmMIPj7XYh_F_DlmehhUlUu7H6TLeVYRYkPODBocssQ:QUQ3MjNmekJHcGZaWjZrSDdaVFBtdFJSc3RpSTg2TzVyeWtZdXMwWnhHVGlHUmtnLVZwWnRrVWotTlN0RUJwLS1XMkRjSmV0Z0xuSkZOREl2Z01IcmNpUTNBdzlXUkxSWGpja2s0NUVQYlBDTUhRRjFTcHZZbld2SFdIMWkwTHBnTU9jdkVMRDVLcEpVVEMtQmNKWk9NcDcxTmFudHdlYnRn; PREF=f6=40000080&tz=Europe.Berlin&f7=100; SIDCC=AFvIBn8uku-KanWPArtyJMQvM33jClrWJcFJHF9vvzR4n6YlmAKqnPywGJGyc7FxFSlkLjFELw; __Secure-1PSIDCC=AFvIBn_jkSNOQFqEVdVQBAiD1xtlTKsLYXKSZcFd12O4_dkLIZJBVjwHvVJPTPXfqkf9SJSIuQ; __Secure-3PSIDCC=AFvIBn8iRqDE6S8itieExwd6GXqTzhEdieyi5kLkMreKQcK9DZbHzDnPJWGV2GAG_cy_vF7M"
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
