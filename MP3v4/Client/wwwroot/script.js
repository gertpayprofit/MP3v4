var audio = document.createElement('audio');
var track_index = 0;
var trackposition = 0;
var resumetrackposition = 0;
var resumevolume = 0;
var updateTimer;
var music_list;
var cnt = 0;

const music_list2 = [
    {
        img: 'images/stay.png',
        name: 'Stay',
        artist: 'The Kid LAROI, Justin Bieber',
        music: 'music/stay.mp3'
    },
    {
        img: 'images/fallingdown.jpg',
        name: 'Falling Down',
        artist: 'Wid Cards',
        music: 'music/fallingdown.mp3'
    },
    {
        img: 'images/faded.png',
        name: 'Faded',
        artist: 'Alan Walker',
        music: 'music/Faded.mp3'
    },
    {
        img: 'images/ratherbe.jpg',
        name: 'Rather Be',
        artist: 'Clean Bandit',
        music: 'music/Rather Be.mp3'
    }
];

function loadaudio(music_list, track_index) {
    this.music_list = music_list;
    this.track_index = track_index;
    trackposition = 0;
    clearInterval(updateTimer);
    audio.src = music_list[track_index].music;
    audio.load();
    displaytrack(); 
    setvolume();
}
function playTrack() {
    audio.removeEventListener('ended', nextTrack);
    audio.addEventListener('ended', nextTrack);
    audio.play();
    if (!isNaN(audio.duration)) audio.currentTime = (trackposition / 100) * audio.duration;
    if (resumetrackposition > 0) audio.volume = 0;
    clearInterval(updateTimer);
    updateTimer = setInterval(setUpdate, 1000);
}

function pauseTrack() {
    clearInterval(updateTimer);
    audio.pause();
}

function resumeTrack() {
    track_index = parseInt(localStorage.getItem('track_index'));
    trackposition = parseFloat(localStorage.getItem('trackposition'));
    resumetrackposition = trackposition;
    resumevolume = parseFloat(localStorage.getItem('volume'));
    loadtrack();
}

function loadtrack() {
    audio.src = music_list[track_index].music;
    audio.load();
    var volume = parseFloat(localStorage.getItem('volume'));
    var volumeslider = document.getElementById('volumeslider');
    volumeslider.value = volume;
    displaytrack();
    setvolume();
    playTrack();
}
function displaytrack() {
    var nowplaying = document.getElementById('nowplaying');
    var trackname = document.getElementById('trackname');
    var trackartist = document.getElementById('trackartist');
    nowplaying.innerText = (track_index + 1) + ' of ' + music_list.length;
    trackname.innerText = music_list[track_index].name;
    trackartist.innerText = music_list[track_index].artist;
    var trackslider = document.getElementById('trackslider');
    trackslider.value = trackposition;
    var txttrackslider = document.getElementById('txttrackslider');
    txttrackslider.innerText = "";
}

function nextTrack() {
    if (track_index < music_list.length - 1) {
        clearInterval(updateTimer);
        track_index++;
        trackposition = 0;
        loadtrack();
    }
}

function setvolume() {
    var volumeslider = document.getElementById('volumeslider');
    audio.volume = volumeslider.value / 100; 
    var txtvolumeslider = document.getElementById('txtvolumeslider');
    txtvolumeslider.innerText = "Volume: " + volumeslider.value + '%';
}

function settrack() {
    var trackslider = document.getElementById('trackslider');
    trackposition = trackslider.value;
    if (!isNaN(audio.duration)) audio.currentTime = (trackposition / 100) * audio.duration;
    else audio.currentTime = 0;
}

function setUpdate() {
    if (!isNaN(audio.duration)) {
        if (resumetrackposition > 0) {
            audio.currentTime = (trackposition / 100) * audio.duration;
            resumetrackposition = 0;
            audio.volume = resumevolume / 100; 
            resumevolume = 0;
        }
        trackposition = (audio.currentTime / audio.duration)*100;
        var trackslider = document.getElementById('trackslider');
        trackslider.value = trackposition;
        localStorage.setItem('track_index', track_index);
        localStorage.setItem('trackposition', trackposition);
        localStorage.setItem('volume', volumeslider.value);

        var currentMinutes = Math.floor(audio.currentTime / 60);
        var currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
        var durationMinutes = Math.floor(audio.duration / 60);
        var durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        var txttrackslider = document.getElementById('txttrackslider');
        txttrackslider.innerText = currentMinutes + ":" + currentSeconds + ' of ' + durationMinutes + ":" + durationSeconds;
    }
}

