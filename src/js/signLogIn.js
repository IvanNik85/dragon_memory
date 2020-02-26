import {$mainAudio} from "./music";

// Cashe DOM
export const $body = $('body');
export const $start = $body.find('.start');
export const $loader = $body.find('.loaderDiv'); 
export let playerName;
const $player = $body.find('#player');
const $playerName = $body.find('.playerName');
const $menuButtons = $body.find('.menuButtons');
const $playerSign = $body.find('.playerSign');
const $playerOne = $body.find('#playerOne');
const $sign = $body.find('#sign'); 

// Player sign in
function signIn() {            
    playerName = $player.val();
    localStorage.setItem('playerName', playerName);
    $playerName.html(playerName);        
    if(playerName != '') {
        $menuButtons.fadeIn();
        $mainAudio.get(0).play();
        $playerSign.fadeOut(500);
        $start.fadeIn(500);
        return;
    } 
    Swal.fire({
        type: 'warning',
        title: 'Please enter some value',
        text: 'Enter your name or nickname!',                
        })           
} 

// Player log in
function playerLog() {
    $start.fadeIn(500);
    $menuButtons.fadeIn();
    playerName = 'Player1';
    localStorage.setItem('playerName', playerName);
    $playerName.html(playerName);
    $playerSign.fadeOut(500); 
    $mainAudio.get(0).play();             
} 

//Loading animation
function loader() {
    for(let i = 1; i <= 10; i++) {
       $(`.loader .we:nth-child(${i})`)
        .css(`animation`, `loaderStart 1.2s ${i * .1}s infinite`);
    }   
}
loader();   

//Hide loader when element is loaded    
function init() {
    $playerSign.fadeIn(1000);             
}
setTimeout(() => {
    $('.mainMenu').onload = (function() {
        $loader.css("display","none");
        init();
    })()  
},2000)

// Bind events 
$sign.click(signIn);
$playerOne.click(playerLog);  