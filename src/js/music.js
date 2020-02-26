const requireContext1 = require.context("../audio", true, /^\.\/.*\.mp3$/);
requireContext1.keys().map(requireContext1);

// Cache DOM
export const $musicBtn = $('.musicBtn');
export const $mainAudio = $(".mainAudio");
const $inGameAudio = $(".inGameAudio");
const $inGameAudioTwo = $(".inGameAudioTwo");
const $musicControll = $('.musicControll');
const $slideLine = $('.slideLine');
const $musicText = $musicBtn.find('span');
const $musicDiv = $musicBtn.find('div');
const $musicOne = $musicBtn.find('.musicOne');
const $musicTwo = $musicBtn.find('.musicTwo');
const $musicThree = $musicBtn.find('.musicThree');
const $musicFour = $musicBtn.find('#musicFour');
const musicData = [$mainAudio, $inGameAudio, $inGameAudioTwo];

//Music button animations

//Main button function that trigger animation 
export function music() {
    $musicBtn.toggleClass('music1');
    $musicDiv.toggleClass('animDiv');
    $musicText.fadeToggle(150);
}
// Play song/stop another
function audio(song) {
    return function () {
        audioFour();
        song.get(0).play();
        musicLine(true);
    }
}
// Pause current song and reset play time
function audioFour() {
    musicData.forEach(song => {
        song.get(0).pause();
        song.get(0).currentTime = 0;
    });
}
// Stopping music function   
function musicStop() {
    musicLine(false);
    audioFour();
}
// Determining whether music button line is crossed or not and deciding when to cross out
function musicLine(condition) {
    $slideLine.hasClass('changeLine') === condition &&
    $slideLine.toggleClass('changeLine');
}
// Bind events 
$musicBtn.click(music);
$musicOne.click(audio($mainAudio));
$musicTwo.click(audio($inGameAudio));
$musicThree.click(audio($inGameAudioTwo));
$musicFour.click(musicStop);
$musicControll.click(musicStop);

