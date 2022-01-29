let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let playlist_img = document.querySelector(".playlist-img");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let tracklist_right = document.querySelector(".right");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");
let external_btn = document.querySelector(".external-link");
let random_btn = document.querySelector(".random-play");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0;
let isPlaying = false;
let updateTimer;

// Create new audio element
let curr_track = document.createElement('audio');

// Define the tracks that have to be played
let track_list = [];

function getTracksByPlaylistId(id,playlistName){
  getTracks(id).then(value => {
    track_list = value;
    curr_track.volume = volume_slider.value / 100;
    track_index = 0;
    loadTrack(track_index);
    fillTheMusicList(value,playlistName)
  });
  pauseTrack();
}

function fillTheMusicList(trackL,playlistName) {
  var str="<div class=\"playlist\"><b><marquee>"+playlistName+"</marquee></b></div>";
  trackL.map((item,index)=>{
    str = str+"<div><div class=\"listeler\" onclick=\"playMusic("+index+")\" >"+item.name+"</div><br><hr><br></div>";
  })
  tracklist_right.innerHTML=str;
}

function playMusic(track_indexx) {
  track_index=track_indexx;
  loadTrack(track_index)
  playTrack();
}

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);
}

function randomTrack() {
  Math.random()
}

function openLink() {
  let url = track_list[track_index].spotify_url;
  window.open(url, '_blank');
}
function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  if (!isPlaying) playTrack()
  else pauseTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fi fi-rr-pause icon-buyuk"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fi fi-rr-play icon-buyuk"></i>';;
}

function nextTrack() {
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length;
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

async function GetBearerToken() {
  var ls_access_token = localStorage.getItem("access_token");
  var ls_token_expires_in = localStorage.getItem("token_expires_in");

  if (ls_access_token == null || ls_token_expires_in == null || new Date() > new Date(ls_token_expires_in)) {
    var TOKENURL = 'https://accounts.spotify.com/api/token';
    var options = {
      method: 'POST',
      headers: {
        Authorization: 'Basic NTU0YjEzNWU0MzFmNDQyZmFlOTc2ZmFjZDRlMjFkYmI6ZWQ2NjdmMDVmMzE4NDJmYjkyNGM0OWVkMzdmMWRlMGE=',
        host: 'accounts.spotify.com',
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json'
      },
      body: 'grant_type=client_credentials',
      host: 'accounts.spotify.com'
    }

    var t = await fetch(TOKENURL, options);
    var j = await t.json();
    console.log("Yeni Token Alındı", j);
    var expires_time = new Date();
    expires_time.setSeconds(expires_time.getSeconds() + j.expires_in);

    localStorage.setItem("token_expires_in", expires_time)
    localStorage.setItem("access_token", j.access_token)
    return j.access_token;
  }
  else {
    return ls_access_token;
  }

}
function getTracks2() {
  playlist_img.style.backgroundImage = "url('resimler/nightCity.jpg')";
  var value = [{
    name: "Daddy Issues",                // Albüm ismi
    artist: "The Neighbourhood",              // Sanatçı ismi
    path: "music/Daddy Issues.mp3",                // Müziğin mp3 Konumu
    image: "resimler/sun.webp",               // Albüm resmi
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",         // Müziğin url'i
  },
  {
    name: "Heat Waves",               
    artist: "Glass Animals",             
    path: "music/glass animals - heat waves.mp3",               
    image: "resimler/car.webp",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",   
  },
  {
    name: "Everything i wanted",               
    artist: "Billie Eilish",             
    path: "music/billie eilish everything i wanted slowed reverb.mp3",               
    image: "resimler/light.gif",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",   
  },
  {
    name: "Just the Two of Us",          
    artist: "Grover Washington, Jr.",             
    path: "music/just the two of us.mp3",               
    image: "resimler/jr.jpg",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  },
  {
    name: "Another love",               
    artist: "Tom Odell",             
    path: "music/another love - tom odell.mp3",               
    image: "resimler/wave.gif",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  },
  {
    name: "SWEATER WEATHER",               
    artist: "The Neighbourhood",             
    path: "music/SWEATER WEATHER.mp3",               
    image: "resimler/bahce.gif",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  },
  {
    name: "J U D A S",               
    artist: "Lady Gaga",             
    path: "music/judas.mp3",               
    image: "resimler/devil.gif",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  },
  {
    name: "Lost On You",               
    artist: "LP",             
    path: "music/lost on you.mp3",               
    image: "resimler/car2.gif",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  },
  {
    name: "Where's My Love",               
    artist: "SYML",             
    path: "music/Just come back home.mp3",               
    image: "resimler/gul.gif",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  },
  {
    name: "Habits Stay High",               
    artist: "Tove Lo",             
    path: "music/tove lo.mp3",               
    image: "resimler/car3.gif",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  },
  {
    name: "No Lie",               
    artist: "Sean Paul, Dua Lipa",             
    path: "music/no lie.mp3",               
    image: "resimler/sun2.gif",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  },
  {
    name: "Love nwantiti",               
    artist: "CKay, Dj Yo!, AX'EL",             
    path: "music/love nwantiti.mp3",               
    image: "resimler/tiren.gif",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  },
  {
    name: "S",               
    artist: "Adale",             
    path: "music/skyfall.mp3",               
    image: "resimler/gun.gif",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  },
  {
    name: "Streets",               
    artist: "Doja Cat",             
    path: "music/Doja Cat- Streets.mp3",               
    image: "resimler/hand.gif",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  },
  {
    name: "Here Lucian Remix",               
    artist: "Alessia Cara",             
    path: "music/Alessia Cara - Here Lucian Remix.mp3",               
    image: "resimler/plak.gif",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  },
  {
    name: "Space Song",               
    artist: "Beach House",             
    path: "music/beach house.mp3",               
    image: "resimler/hand.webp",                                                    
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",  
  }]
  track_list = value;
  curr_track.volume = volume_slider.value / 100; 
  track_index = 0;
  loadTrack(track_index);
  fillTheMusicList(value,"S L O W E D + R E V E R B")
  pauseTrack();
}
async function getTracks(playlist_id) {
  var spotifytracks = [];
  let apiurl = "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?market=TR&fields=items(track(album(images)%2Cartists(name)%2Cname%2Cexternal_urls(spotify)%2Cpreview_url%2Chref))%2Cnext"
  let playlistimage_apiurl = "https://api.spotify.com/v1/playlists/"+playlist_id+"?market=TR&fields=images"
  let options = {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + await GetBearerToken(),
      "Content-Type": "application/json"
    }
  }

  var n = await fetch(playlistimage_apiurl, options)
  var m = await n.json();

  var next = true;
  var nexturl = apiurl;
  while (next) {
    var x = await fetch(nexturl, options)
    var y = await x.json();
    console.log(y)
    await y.items.map(item => {
      if (item.track != null && item.track.preview_url!=null) {
        var arts = "";
        item.track.artists.map(a => {
          if (arts === "") {
            arts += a.name
          }
          else {
            arts += ", " + a.name
          }
        })

        var track = {
          name: item.track.name,
          artist: arts,
          path: item.track.preview_url,
          image: item.track.album.images[0].url,
          spotify_url: item.track.external_urls.spotify,
        }
        spotifytracks.push(track)
      }
    })
    if (y.next !== null) {
      nexturl = y.next;
    }
    else {
      next = false;
    }
  }
  playlist_img.style.backgroundImage = "url(" +m.images[0].url+ ")";
  return spotifytracks;
}
