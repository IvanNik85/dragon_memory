$(document).ready(function() {
    let cardStyle;
    let dificulty;
    let timerReg;
    let changeTimer = []; 
    let changedTmr = false;   
    let dragons = [];
    let randomDragon = []; 
    let playerName;
    let time;
    let rank = [];
    let size = 10; 
    let pos = true; 
    let resetTime = 0;
    let s = 0;
    let m = 0;
    let aggrTime;
    let aggrSec;
    let minutes;   
    let seconds; 
    let startTime = 0;   
    let count = 0;   
    let textSize;  
    for(let i = 0; i < 12; i++) {
        $('.modal-content').prepend(`<img src="./images/card${i}.png" alt="card${i}" id="card${i}" data-dismiss="modal">`);       
    } 

    let cardsB = document.querySelectorAll('.modal-content img');
    cardsB.forEach(card => card.addEventListener('click', changeBack));
    function changeBack() {
       cardStyle = this.id;              
    }
  
    let selectDif = ['.one','.two','.three'];
    let dif = [8, 12, 18];
    for(let i = 0; i < 3; i++) {
        $(selectDif[i]).click(function() {  
            dificulty = dif[i];
            hide(this);           
        });
    }
    
    function hide(par) {
        $('#myCanvas').hide();
        par.parentElement.style.visibility = 'hidden'; 
    }

    $('.start').click(start);
    function start() { 
        randomiseDragons();        
        console.log(startTime)
        size = 10;
        $('#num').text(0); 
        resetTimer();       
        switch(dificulty) {
            case 8:
                dificultyLevel(8, cardStyle || 'card1'); 
                break; 
            case 12:
                dificultyLevel(12, cardStyle || 'card1');
                $('.memoryGame .card').css({
                    width: 'calc(20% - 6px)',
                    height: 'calc(20% - 6px)'
                });            
                break; 
            case 18:
                dificultyLevel(18, cardStyle || 'card1');
                $('.memoryGame .card').css({
                    width: 'calc(16.666% - 6px)',
                    height: 'calc(16.666% - 6px)'
                }) 
                break; 
            default:
                dificultyLevel(8, cardStyle || 'card1');
                changeTimer = ['∞'];
        }
        $('.wrapper').show();
        $('.mainMenu').hide();   
    }
     
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

    function dificultyLevel(num, back) {
        console.log(dragons);
        console.log(randomDragon);
        $('.memoryGame').empty();
        $('.memoryGame').append('<div id="overlay"><h1 id="winLose"></h1></div>')
        for(i = 0; i < 2; i++) {
            for(j = 1; j <= num; j++) {                             
                $('.memoryGame').append(`<div class="card" data-name="dragon${randomDragon[j]}">
                <img class="front" src="images/${randomDragon[j]}.jpg" alt="dragon${randomDragon[j]}">
                <img class="back" src="images/${back}.png" alt="cardBack"> 
                </div>`);
            }            
        }  

        (function shufle() {
            $('.card').each(function() {
                $(this).css({
                    'order': Math.floor(Math.random() * 16)
                });
            });
        })(); 

        if(num == 12 && j < 14) { 
            $('.memoryGame').append(`<div class="card1"<img src="images/lastCard1.png" alt="neutral"></div>`);
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
        
        function flip() {              
            if(lockBoard) return;
            if(this == firstCard) return;
            this.classList.add('flip');    
            if(!hasFlipped) {       
                hasFlipped = true;      
                firstCard = this;
            } else {        
                hasFlipped = false;   
                secondCard = this;
                $('#num').text(++count);  
                if(firstCard.dataset.name == secondCard.dataset.name) {
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
            if(cardsNumber == countPair) { 
                winLose('You Win', '#15ab20');
            } 
        }  
    }  

    function winLose(message, colorWL) {               
        let interval = setInterval(animateWinLose, 10);
        $('#overlay').css({
            'z-index': 1,
            'background-color': 'rgba(0, 0, 0, 0.7)'
        });
        function animateWinLose() {           
            if($(window).width() > 1200) {
                textSize = 150;  
            } else if ($(window).width() > 768 && $(window).width() < 1200) {
                textSize = 115; 
            } else if ($(window).width() > 450 && $(window).width() < 768) {
                textSize = 95;
            } else {
                textSize = 70;
            }   
            size++;
            if(size == textSize) {
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
            time = $('.clock').html();
            aggrSec = m*60 + s;
        }   
        uploadScores();
        console.log(time)
    }            
    
    $('#newGame').click(function(){ 
        start(); 
    })    

    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");    
    ctx.strokeStyle = '#fad232';
    ctx.lineWidth = 2.5;
    let called = false;
    $('.difficulty').click(function(){    
        $('#myCanvas').show();     
        $('.btnDiv').css('visibility', 'hidden');   
        if($(window).width() < 576) {
            $('#myCanvas, #myCanvasTime').hide();
            $('.btnDiv').fadeIn(270);
            setTimeout(function() {
                $('.btnDiv').css('visibility', 'visible'); 
            },230);   
        } else {       
            if(called) {            
                reset(); 
                setTimeout(function() {
                    $('.btnDiv').css('visibility', 'visible'); 
                },900)                                 
            } else {
                animate();
                $('.btnDiv').css('visibility', 'visible'); 
                called = true;             
            } 
        }       
    })     

    $('.btnDiv').css('display', 'none');
        let x = 0;    
        let y = 200;   
        let z = 200;
        let q = 40; 
        function animate() {
           window.requestAnimationFrame(animate); 
            if(x <= 40) { 
                ctx.beginPath();               
                ctx.moveTo(200,0);
                ctx.lineTo(200,x);   
                x += 5;  
            } else if(y < 350 && z > 50) {
                y += 5;  
                z -= 5;  
                ctx.moveTo(200,40);
                ctx.lineTo(y,40);               
                ctx.lineTo(z,40); 
            } else if(q <= 80){                                                
                ctx.moveTo(50,40);
                ctx.lineTo(50,q);
                ctx.moveTo(200,40);
                ctx.lineTo(200,q);
                ctx.moveTo(350,40);
                ctx.lineTo(350,q);   
                q += 5;                
            } else {                
                $('.btnDiv').fadeIn();
            }    
            ctx.stroke();             
        }    
        
        let called1 = false;     
        $('.timer').click(function(){            
            $('.timeBtn').css('visibility', 'hidden');  
            if($(window).width() < 576) {
                $('#myCanvas, #myCanvasTime').hide();
                $('.timeBtn').fadeIn(270);
                setTimeout(function() {
                    $('.timeBtn').css('visibility', 'visible'); 
                },230);   
            } else {                     
                if(called1) {                                     
                    resetTimeCanvas();                              
                    setTimeout(function() {
                        $('.timeBtn').css('visibility', 'visible'); 
                    },600)                                 
                } else {  
                    resetTimeCanvas();               
                    animateTime();                
                    $('.timeBtn').css('visibility', 'visible'); 
                    called1 = true;             
                }        
            }
        });

        function resetTimeCanvas() {
            $('#myCanvasTime').show();                   
            cont.clearRect(0, 0, 400, 80);                      
            g = 130; 
            h = 270;  
            j = 2*Math.PI; 
            k = 0*Math.PI;   
            l = 1*Math.PI;
            i = 1*Math.PI;   
        }

        $('.timeBtn').css('display', 'none');
        let t = document.getElementById("myCanvasTime");
        let cont = t.getContext("2d");    
        cont.strokeStyle = '#fad232';
        cont.lineWidth = 2.5;        
        let g = 130; 
        let h = 270;  
        let j = 2*Math.PI; 
        let k = 0*Math.PI;   
        let l = 1*Math.PI;
        let i = 1*Math.PI;
        function animateTime() {
            window.requestAnimationFrame(animateTime); 
            if(g >= 60 || h <= 340) { 
                 cont.beginPath();               
                 cont.moveTo(130, 40);
                 cont.lineTo(g, 40);
                 cont.moveTo(270, 40);
                 cont.lineTo(h, 40);   
                 g -= 5; 
                 h += 5;
            } else if(j>=1.5*Math.PI || k <= 0.5*Math.PI ||
                 l<=1.5*Math.PI || i>=0.5*Math.PI) { 
                 cont.moveTo(60,40);                 
                 cont.arc(20,40,30,2*Math.PI, j, true);
                 cont.moveTo(60,40);
                 cont.arc(20,40,30,0*Math.PI, k);
                 cont.moveTo(340,40);                 
                 cont.arc(380,40,30,1*Math.PI, l);
                 cont.moveTo(340,40);
                 cont.arc(380,40,30,1*Math.PI, i, true); 
                 k += 0.075;  
                 j -= 0.075;      
                 l += 0.075;      
                 i -= 0.075;          
            } else {
                $('.timeBtn').show(); 
            }
            cont.stroke();             
         }   

        function reset() {   
            $('#myCanvas').show();                   
            ctx.clearRect(0, 0, 400, 80);                      
            x = 0;    
            y = 200;   
            z = 200;
            q = 40;
        }

        function resetTimer() {
            s = 0;  
            if(pos){  
                m = 0;
                $('.clock').html(`0${m}:00`);
            } else {
                m = resetTime; 
                $('.clock').html(`0${m}:00`);
            } 
            clearInterval(timerReg); 
            timerReg = setInterval(timer, 1000); 
        }

        for(let i = 1; i <= 3; i++) {
            $(`.min${i}`).click(function() {
                if(changedTmr == false) {
                    $('.clock').html(`0${i}:00`);
                }               
                m, resetTime = i;                
                pos = false;    
                hideTimerBtns(); 
                changedTmr = false;                      
                changedTimer(this);  
                startTime = i; 
            });
        }

        $('.infinity').click(function() {
            hideTimerBtns();  
            m, resetTime = 0;
            pos = true;  
            startTime = 0; 
            changedTmr = false;    
            changedTimer(this);
        }); 

        function changedTimer(self) {   
            changeTimer.push(self.innerHTML)                
            if(changeTimer.length == 2){
                if(changeTimer[0] != changeTimer[1]) {
                    changedTmr = true;
                } 
                changeTimer.shift();
            }                             
        }

        $('#options').click(function() { 
            console.log(count)
            $('.backBtn').show();
            $('.mainMenu').show();
            $('.wrapper').hide(); 
            $('#myCanvas').css({display: "block"}) && hide(document.querySelector('.one')); 
            $('#myCanvasTime').css({display: "block"}) && hideTimerBtns();           
            $('.backBtn').on('click', hideMenu); 
            clearInterval(timerReg);
        });

        $('.backBtn').click(function() {  
            setTimeout(slideUpMenu, 200);                   
            if(changedTmr == true) {
                resetTimer();                 
            } else if($('.clock').html() != `00:00` || pos) {
                size == 10 && (timerReg = setInterval(timer, 1000));                     
            }    
            changedTmr = false;   
        });
        
        function hideMenu() {
            if(cardStyle) {
                let back = document.querySelectorAll('.back');
                back.forEach(card => card.setAttribute(`src`, `images/${cardStyle}.png`));                
            }               
            $('.mainMenu').hide();
            $('.wrapper').show(); 
        }        
        
        function hideTimerBtns() {
            $('.timeBtn').css('visibility', 'hidden');
            $('#myCanvasTime').hide();
        }
        
        function timer() {
            pos ? timerPos() : timerNeg(); 

            s > 9 ? sec = s : sec = '0' + s; 
            m > 9 ? min = m : min = '0' + m; 
            
            $('.clock').html(min + ':' + sec); 

            m == 30 && winLose('You Lose', '#bb2727');            
        }
        function timerNeg() {            
            if(s == 0 && s < 9) {               
                m--;
                s = 60;                
            }
            s--;  

            $('.clock').html() == `00:01` && winLose('You Lose', '#bb2727');                        
        }
        function timerPos() {            
            s++; 
            if(s == 60) {
                s = 0
                m++;
            } 
        }
        let menuBtn = true;
        $(window).resize(() => {  
            slideUpMenu();
        })
        function slideUpMenu() {
            $(this).width() < 975 ?                
            $('.menuBtns').slideUp() :    
            $('.menuBtns').slideDown(); 

            if($('.menuBtns').is(":visible")) {
                $('#slideOptions').css('transform', 'rotate(0deg)');
                menuBtn = true;
            } 
        }              
       
        $('#slideOptions').click(function(){
            $('.menuBtns').slideToggle();  
            rotateBtn(this);          
        });

        function rotateBtn(a) {
            if(menuBtn) {
                $(a).css('transform', 'rotate(180deg)');
                menuBtn = false;
            } else {
                $(a).css('transform', 'rotate(0deg)')
                menuBtn = true;
            }
        }     

        function generateHighscores() { 
            for(let i = 0; i < 10; i++) {
               rank.length < 10 ? rank.push('--- | | ---') : null;                  
                rank[i] != '--- | | ---' ? 
                $('.listHighscores').append(`<p>${i+1}.<span class="rank${i}">${ rank[i].name} - attempts: ${rank[i].attempts}, time: ${rank[i].playTime}</span></p>`):
                $('.listHighscores').append(`<p>${i+1}.<span class="rank${i}">${rank[i]}</span></p>`);            
            }     
            localStorage.setItem("rank", JSON.stringify(rank));
        }      
        if(!localStorage.getItem('rank')) {            
            generateHighscores();
        } else {   
            rank = JSON.parse(localStorage.getItem('rank'));         
            generateHighscores();          
        }

        function uploadScores() {
            let playerResult = {
                name: playerName,
                attempts: count,
                playTime: time,
                aggregate: aggrSec
            }               
            console.log(playerResult);
            function sort() {
                rank.unshift(playerResult);    
                rank.sort(function(a, b) {return a.aggregate - b.aggregate}); 
                rank.sort(function(a, b) {if(a.aggregate == b.aggregate) {return a.attempts - b.attempts}}); 
                rank.pop();   
            }
                                  
                if(rank.every((el) => el == '--- | | ---')) {    
                    rank.unshift(playerResult);                  
                    rank.pop();                                
                } else if(rank.some((el) => el == '--- | | ---')){
                    sort();
                } else {
                    sort(); 
                }
                localStorage.setItem("rank", JSON.stringify(rank)); 

           
            for(let i in rank) {                
                rank[i] != '--- | | ---' ? $('.rank'+ i).html(`${ rank[i].name} - attempts: ${rank[i].attempts}, time: ${rank[i].playTime}`):
                rank[i] = '--- | | ---';
            }  
        }    
        //let playerResult = ${playerName} - attempts: ${count}, time: ${time}
        $('.highscores').click(function() {            
            $('.listHighscores').addClass('active');           
        });
        $('.highscores').blur(function() {
            $('.listHighscores').removeClass('active');
        });

        $(window).on('load', function() {
            $('.playerSign').fadeIn(1000); 
            $('.start').hide();
        })  
        $('#sign').click(function() {            
            playerName = $('#player').val();
            localStorage.setItem('playerName', playerName);
            $('.playerName').html(playerName);
            if(playerName != '') {
                $('.playerSign').fadeOut(500);
                $('.start').fadeIn(500);
                return;
            } 
            Swal.fire({
                type: 'warning',
                title: 'Please enter some value',
                text: 'Enter your name or nickname!',                
              })           
        }); 
        $('#playerOne').click(function() {
            $('.start').fadeIn(500);
            playerName = 'Player1';
            localStorage.setItem('playerName', playerName);
            $('.playerName').html(playerName);
            $('.playerSign').fadeOut(500);            
        }); 
        
        $(window).resize(function() {
            if($(this).width() < 576) {
                $('#myCanvas, #myCanvasTime').hide(); 
            }
        })


});
    


    