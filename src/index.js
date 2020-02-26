import "./styles/style.css";
import {$musicBtn} from "./js/music";
import {$window, hideTimerBtns, $myCanvasTime, $myCanvas} from "./js/canvas";
import {$start, $loader, playerName} from "./js/signLogIn";
const requireContext = require.context("./images", true, /^\.\/.*\.(png|jpe?g$)/);
requireContext.keys().map(requireContext);

$(document).ready(function() {
    let cardStyle, dificulty, timerReg;
    let changeTimer = []; 
    let changedTmr = false;   
    let dragons = [];
    let randomDragon = []; 
    let time;
    let rank, rankMedium, rankHard;
    let size = 10; 
    let pos = true; 
    let resetTime = 0;
    let startTime = 0;   
    let count = 0;     
    let s = 0;
    let m = 0;
    let sec, min;
    let aggrTime, aggrSec, minutes, seconds, textSize;  
        
    // Cache DOM       
    const $mainMenu = $('.mainMenu');
    const $wrapper = $('.wrapper');       
    const $modalContent = $mainMenu.find('.modal-content');    
    const $num = $wrapper.find('#num');
    const $memoryGame = $wrapper.find('.memoryGame');
    const $clock = $wrapper.find('.clock');    
    const $newGame = $wrapper.find('#newGame');  
    const $options = $wrapper.find('#options');
    const $infinity = $mainMenu.find('.infinity');
    const $backBtn = $mainMenu.find('.backBtn');
    const $menuBtns = $wrapper.find('.menuBtns');
    const $slideOptions = $wrapper.find('#slideOptions');
    const $highscores = $mainMenu.find('.highscores');
    const $exitScores = $mainMenu.find('.fa-times-circle');    
    const $scoreRight = $mainMenu.find('.fa-angle-right');
    const $scoreLeft = $mainMenu.find('.fa-angle-left');
    
    // Bind events    
    $start.click(start); 
    $newGame.click(newGame);    
    $infinity.click(infiniteTimer);
    $options.click(optionsMenu);
    $backBtn.click(backToGame);
    $slideOptions.click(slideOptions);
    $highscores.click(showHighscores);
    $exitScores.click(exitScores);    
    $scoreRight.click(rightScore);
    $scoreLeft.click(leftScore);

    // Modal with cards backround selection
    for(let i = 0; i < 12; i++) {
        $modalContent.prepend(
        `<img 
            src="./images/card${i}.png" 
            alt="card${i}" 
            id="card${i}" 
            data-dismiss="modal"
        >`);       
    } 
    // Choosing the card backround
    let cardsB = document.querySelectorAll('.modal-content img');
    cardsB.forEach(card => card.addEventListener('click', changeBack));
    function changeBack() {
       cardStyle = this.id;              
    }
    // Selecting game difficulty
    let selectDif = ['.one','.two','.three'];
    let dif = [8, 12, 18];
    for(let i = 0; i < 3; i++) {
        $(selectDif[i]).click(function() {  
            dificulty = dif[i];
            hide(this); 
        });
    }
    // Hiding function
    function hide(par) {
        $myCanvas.hide();
        par.parentElement.style.visibility = 'hidden'; 
    }
    // Function that starts the game, generate card fields   
    function start() {    
        $loader.css("display","flex");      
        randomiseDragons();     
        $musicBtn.hasClass('music1') && music();    
        setTimeout(slideUpMenu, 200);          
        size = 10;
        $num.html(0); 
        switch(dificulty) {
            case 8:
                dificultyLevel(8, cardStyle || 'card1'); 
                break; 
            case 12:
                dificultyLevel(12, cardStyle || 'card1');
                $memoryGame.find('.card').css({
                    width: 'calc(20% - 6px)',
                    height: 'calc(20% - 6px)'
                });            
                break; 
            case 18:
                dificultyLevel(18, cardStyle || 'card1');
                $memoryGame.find('.card').css({
                    width: 'calc(16.666% - 6px)',
                    height: 'calc(16.666% - 6px)'
                }) 
                break; 
            default:
                dificultyLevel(8, cardStyle || 'card1');
                changeTimer = ['∞'];
                dificulty = 8;
        }      
        $wrapper.show();
        $mainMenu.hide(); 
        $wrapper.onload = (function() {
            $loader.css("display","none");    
            resetTimer();             
        })()    
                
    }
    // Randomise dragon cards that will be displayed
    function randomiseDragons() {
        randomDragon = [];
        for(let i=1; i<=50; i++) {
            dragons.push(`dragon${i}`)
        } 
        while(dragons.length > 0) {
            let rand = Math.floor(Math.random() * dragons.length);
            randomDragon.push(dragons[rand]);
            dragons.splice(rand, 1)
        }        
    }    

    // Generate field according to difficulty level and card background 
    function dificultyLevel(num, back) {  
        $memoryGame.empty();
        $memoryGame.append('<div id="overlay"><h1 id="winLose"></h1></div>')
        for(let i = 0; i < 2; i++) {
            for(var j = 1; j <= num; j++) {                             
                $memoryGame.append(`<div class="card" data-name="dragon${randomDragon[j]}">
                <img class="front" src="images/${randomDragon[j]}.jpg" alt="dragon${randomDragon[j]}">
                <img class="back" src="images/${back}.png" alt="cardBack"> 
                </div>`);
            }            
        }  
        // Shuffling cards at the beginning of the game
        (function shufle() {
            $memoryGame.find('.card').each(function() {
                $(this).css({
                    'order': Math.floor(Math.random() * 16)
                });
            });
        })(); 

        if(num === 12 && j < 14) { 
            $memoryGame.append(`<div class="card1"<img src="images/lastCard1.png" alt="neutral"></div>`);
            $('.card1').css('order', 16);
        }  
 
        let cards = document.querySelectorAll('.card');
        cards.forEach(card => card.addEventListener('click', flip));  
        let hasFlipped = false;
        let firstCard, secondCard;
        let lockBoard = false;
        let countPair = 0; 
        count = 0;   
        let cardsNumber = document.querySelectorAll('.card').length;

        // Flipping cards function
        function flip() {              
            if(lockBoard) return;
            if(this === firstCard) return;
            this.classList.add('flip');    
            if(!hasFlipped) {       
                hasFlipped = true;      
                firstCard = this;
            } else {        
                hasFlipped = false;   
                secondCard = this;
                $num.html(++count);  
                if(firstCard.dataset.name === secondCard.dataset.name) {
                    firstCard.removeEventListener('click', flip);
                    secondCard.removeEventListener('click', flip);
                    countPair += 2;
                } else {       
                    lockBoard = true;      
                    setTimeout(function() {
                        firstCard.classList.remove('flip');
                        secondCard.classList.remove('flip');
                        lockBoard = false;
                        firstCard = null;
                    }, 1000);              
                }             
            }  
            // Win condition and display message
            if(cardsNumber === countPair) { 
                winLose('You Win', '#15ab20');
                switch(dificulty) {
                    case 8:
                    uploadScores(rank, 'rank');   
                    break;
                    case 12:
                    uploadScores(rankMedium, 'rankMedium');   
                    break;
                    case 18:
                    uploadScores(rankHard, 'rankHard');   
                    break;
                }                
            } 
        }  
    }  
    // End game animation and uploading results
    function winLose(message, colorWL) {               
        let interval = setInterval(animateWinLose, 10);
        $memoryGame.find('#overlay').css({
            'z-index': 1,
            'background-color': 'rgba(0, 0, 0, 0.7)'
        });
        function animateWinLose() {           
            if($window.width() > 1200) {
                textSize = 150;  
            } else if ($window.width() > 768 && $window.width() < 1200) {
                textSize = 115; 
            } else if ($window.width() > 450 && $window.width() < 768) {
                textSize = 95;
            } else {
                textSize = 70;
            }   
            size++;
            if(size === textSize) {
                return clearInterval(interval);
            } 
            $('#winLose').html(message).css({
                fontSize: size + 'px',
                color: colorWL
            })                  
        }  
        clearInterval(timerReg);
        if(startTime != 0) {
            aggrTime = m*60 + s; 
            aggrSec = startTime*60 - aggrTime;       
            if(aggrSec > 60) {
                minutes = parseInt(aggrSec/60);
                seconds = aggrSec - minutes*60;
            } else {
                minutes = 0; 
                seconds = aggrSec;
            }     
            seconds < 9 && (seconds = '0' + seconds); 
            minutes < 9 && (minutes = '0' + minutes);         
            time = `${minutes}:${seconds}`;           
        } else {
            time = $clock.html();
            aggrSec = m*60 + s;
        }   
    }         
    // Start new game
    function newGame() { 
        start(); 
    }    
    // Reset timer function
    function resetTimer() {
        s = 0;  
        if(pos){  
            m = 0;
            $clock.html(`0${m}:00`);
        } else {
            m = resetTime; 
            $clock.html(`0${m}:00`);
        } 
        clearInterval(timerReg); 
        timerReg = setInterval(timer, 1000); 
    }
    // Different timer settings (1,2,3 min)
    for(let i = 1; i <= 3; i++) {
        $(`.min${i}`).click(function() {
            if(changedTmr === false) {
                $clock.html(`0${i}:00`);
            }               
            m, resetTime = i;                
            pos = false;    
            hideTimerBtns(); 
            changedTmr = false;                      
            changedTimer(this);  
            startTime = i; 
        });
    }
    // Infinite timer (limited to 30min :)        
    function infiniteTimer() {
        hideTimerBtns();  
        m, resetTime = 0;
        pos = true;  
        startTime = 0; 
        changedTmr = false;    
        changedTimer(this);
    } 
    // Changing timer value
    function changedTimer(self) {   
        changeTimer.push(self.innerHTML)                
        if(changeTimer.length === 2){
            if(changeTimer[0] != changeTimer[1]) {
                changedTmr = true;
            } 
            changeTimer.shift();
        }                             
    }
    // Options menu function
    function optionsMenu() {   
        $backBtn.show();
        $mainMenu.show();
        $wrapper.hide(); 
        $myCanvas.css({display: "block"}) && hide(document.querySelector('.one')); 
        $myCanvasTime.css({display: "block"}) && hideTimerBtns();           
        $backBtn.on('click', hideMenu); 
        clearInterval(timerReg);
    }
    // Returning to game from main menu
    function backToGame() {  
        $musicBtn.hasClass('music1') && music();
        setTimeout(slideUpMenu, 200);                   
        if(changedTmr === true) {
            resetTimer();                 
        } else if($clock.html() != `00:00` || pos) {
            size === 10 && (timerReg = setInterval(timer, 1000));                     
        }    
        changedTmr = false;   
    }
    // Hide menu and change card style if selected
    function hideMenu() {
        if(cardStyle) {
            let back = document.querySelectorAll('.back');
            back.forEach(card => card.setAttribute(`src`, `images/${cardStyle}.png`));                
        }               
        $mainMenu.hide();
        $wrapper.show(); 
    }   

    // Timer functions
    function timer() {
        pos ? timerPos() : timerNeg(); 

        s > 9 ? sec = s : sec = '0' + s; 
        m > 9 ? min = m : min = '0' + m; 
        
        $clock.html(min + ':' + sec); 

        m === 30 && winLose('You Lose', '#bb2727');            
    }
    function timerNeg() {            
        if(s === 0 && s < 9) {               
            m--;
            s = 60;                
        }
        s--;  

        $clock.html() === `00:01` && winLose('You Lose', '#bb2727');                        
    }
    function timerPos() {            
        s++; 
        if(s === 60) {
            s = 0
            m++;
        } 
    }
    // Slide up menu
    let menuBtn = true;
    $window.resize(() => {  
        slideUpMenu();
    })
    function slideUpMenu() {           
        $(this).width() < 975 ?                
        $menuBtns.slideUp() :    
        $menuBtns.slideDown(); 

        if($menuBtns.is(":visible")) {
            $slideOptions.css('transform', 'rotate(0deg)');
            menuBtn = true;
        } 
    }     
    // Slide menu buttons on smaller screens
    function slideOptions(){
        $menuBtns.slideToggle();  
        rotateBtn(this);          
    }
    // Rotate button for smaler devices menu
    function rotateBtn(a) {
        if(menuBtn) {
            $(a).css('transform', 'rotate(180deg)');
            menuBtn = false;
        } else {
            $(a).css('transform', 'rotate(0deg)')
            menuBtn = true;
        }
    }     
    let highscores = ['.listHighscores','.listHighscoresM','.listHighscoresH']; 
    let storageScores = [rank, rankMedium, rankHard]; 
    let storageNames = ['rank', 'rankMedium', 'rankHard'];

    $window.on('load', function() {           
        for(let i=0; i<3; i++) {               
            storageScores[i].slice(JSON.parse(localStorage.getItem(storageNames[i])));
        }
    })  
    //Generate highscores
    function generateHighscores(par, par2, par3) { 
        for(let i = 0; i < 10; i++) {
            par.length < 10 ? par.push('--- | | ---') : null;                  
            par[i] != '--- | | ---' ? 
            $(par3).append(`<p>${i+1}.<span class="${par2}${i}">${ par[i].name} - attempts: ${par[i].attempts}, time: ${par[i].playTime}</span></p>`):
            $(par3).append(`<p>${i+1}.<span class="${par2}${i}">${par[i]}</span></p>`);            
        }     
        localStorage.setItem(par2, JSON.stringify(par));
    }      

    // Uploading and displaying highscores    
    (function storageData() {
        storageNames.map((stname, i) => {
            if (!localStorage.getItem(stname)) {
                generateHighscores(storageScores[i], stname, highscores[i])
            } else {
                storageScores[i] = JSON.parse(localStorage.getItem(stname));
                generateHighscores(storageScores[i], stname, highscores[i]);            
            }
        })               
    })();
    [rank, rankMedium, rankHard] = storageScores;
    
    // Uploading and sorting scores by result and difficulty level
    function uploadScores(diff, storageName) {
        let playerResult = {
            name: playerName,
            attempts: count,
            playTime: time,
            aggregate: aggrSec
        }     
        function sort() {
            diff.unshift(playerResult);    
            diff.sort(function(a, b) {return a.aggregate - b.aggregate}); 
            diff.sort(function(a, b) {if(a.aggregate === b.aggregate) {return a.attempts - b.attempts}}); 
            diff.pop();   
        }                                        
        if(diff.every((el) => el === '--- | | ---')) {    
            diff.unshift(playerResult);                  
            diff.pop();                                
        } else if(diff.some((el) => el === '--- | | ---')){
            sort();
        } else {
            sort(); 
        }
        localStorage.setItem(storageName, JSON.stringify(diff)); 
        
        for(let i in diff) {                
            diff[i] != '--- | | ---' ? $(`.${storageName}${i}`).html(`${ diff[i].name} - attempts: ${diff[i].attempts}, time: ${diff[i].playTime}`):
            diff[i] = '--- | | ---';
        }                        
    }        

    // Showing highscores
    function showHighscores() { 
        $('.listHighscores').addClass('active');  
        $scoreLeft.hide(); 
        $scoreRight.show();             
    }    

    // Exiting highscores
    function exitScores() {           
        $(this).parent().removeClass('active');
    }
 
    // Remove canvas on smaler devices
    $window.resize(function() {
        if($(this).width() < 576) {
            $myCanvas.hide();
            $myCanvasTime.hide(); 
        }
    })         
    // Move to right scorelist by difficulty
    function rightScore() {
        for(let i in highscores) {    
            $scoreLeft.show(500);           
            if($(highscores[i]).hasClass('active')) {
                i == 1 && $scoreRight.hide(500);
                $(highscores[i]).removeClass('active');                  
                $(highscores[(++i)]).addClass('active');
                break;
            }               
        }           
    }
     // Move to left scorelist by difficulty
    function leftScore() {            
        for(let i in highscores) {    
            $scoreRight.show(500);            
            if($(highscores[i]).hasClass('active')) {
                i == 1 && $scoreLeft.hide(500);
                $(highscores[i]).removeClass('active');                  
                $(highscores[(--i)]).addClass('active');
                break;
            }
        }           
    }
}); 