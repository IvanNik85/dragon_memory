import {$body} from "./signLogIn";

// Cashe DOM
export const $window = $(window);
export const $myCanvasTime = $body.find('#myCanvasTime');
export const $myCanvas = $body.find('#myCanvas');
const $btnDiv = $body.find('.btnDiv');
const $difficulty = $body.find('.difficulty');
const $timer = $body.find('.timer');
const $timeBtn = $body.find('.timeBtn');

// Level button canvas --------------------------------------------------
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.strokeStyle = '#fad232';
ctx.lineWidth = 2.5;
let called = false;
$btnDiv.css('display', 'none');
let x = 0;
let y = 200;
let z = 200;
let q = 40;

// Level canvas animation
function levelCanvas() {
    $myCanvas.show();
    $btnDiv.css('visibility', 'hidden');
    if ($window.width() < 576) {
        $myCanvas.hide();
        $myCanvasTime.hide();
        $btnDiv.fadeIn(270);
        setTimeout(function () {
            $btnDiv.css('visibility', 'visible');
        }, 230);
    } else {
        if (called) {
            reset();
            setTimeout(function () {
                $btnDiv.css('visibility', 'visible');
            }, 900)
        } else {
            animateLevel();
            $btnDiv.css('visibility', 'visible');
            called = true;
        }
    }
}

// Reset level canvas
function reset() {
    $myCanvas.show();
    ctx.clearRect(0, 0, 400, 80);
    x = 0;
    y = 200;
    z = 200;
    q = 40;
}

//Canvas draw on level button click
function animateLevel() {
    window.requestAnimationFrame(animateLevel);
    if (x <= 40) {
        ctx.beginPath();
        ctx.moveTo(200, 0);
        ctx.lineTo(200, x);
        x += 5;
    } else if (y < 350 && z > 50) {
        y += 5;
        z -= 5;
        ctx.moveTo(200, 40);
        ctx.lineTo(y, 40);
        ctx.lineTo(z, 40);
    } else if (q <= 80) {
        ctx.moveTo(50, 40);
        ctx.lineTo(50, q);
        ctx.moveTo(200, 40);
        ctx.lineTo(200, q);
        ctx.moveTo(350, 40);
        ctx.lineTo(350, q);
        q += 5;
    } else {
        $btnDiv.fadeIn();
    }
    ctx.stroke();
}

// Timer button canvas --------------------------------------------------
$timeBtn.css('display', 'none');
let t = document.getElementById("myCanvasTime");
let cont = t.getContext("2d");
cont.strokeStyle = '#fad232';
cont.lineWidth = 2.5;
let g = 130;
let h = 270;
let j = 2 * Math.PI;
let k = 0 * Math.PI;
let l = 1 * Math.PI;
let i = 1 * Math.PI;
let called1 = false;

// Timer canvas animation
function timerAnimate() {
    $timeBtn.css('visibility', 'hidden');
    if ($window.width() < 576) {
        $myCanvas.hide();
        $myCanvasTime.hide();
        $timeBtn.fadeIn(270);
        setTimeout(function () {
            $timeBtn.css('visibility', 'visible');
        }, 230);
    } else {
        if (called1) {
            resetTimeCanvas();
            setTimeout(function () {
                $timeBtn.css('visibility', 'visible');
            }, 600)
        } else {
            resetTimeCanvas();
            animateTime();
            $timeBtn.css('visibility', 'visible');
            called1 = true;
        }
    }
}

// Reset timer canvas
function resetTimeCanvas() {
    $myCanvasTime.show();
    cont.clearRect(0, 0, 400, 80);
    g = 130;
    h = 270;
    j = 2 * Math.PI;
    k = 0 * Math.PI;
    l = 1 * Math.PI;
    i = 1 * Math.PI;
}

//Canvas draw on timer button click
function animateTime() {
    window.requestAnimationFrame(animateTime);
    if (g >= 60 || h <= 340) {
        cont.beginPath();
        cont.moveTo(130, 40);
        cont.lineTo(g, 40);
        cont.moveTo(270, 40);
        cont.lineTo(h, 40);
        g -= 5;
        h += 5;
    } else if (j >= 1.5 * Math.PI || k <= 0.5 * Math.PI ||
        l <= 1.5 * Math.PI || i >= 0.5 * Math.PI) {
        cont.moveTo(60, 40);
        cont.arc(20, 40, 30, 2 * Math.PI, j, true);
        cont.moveTo(60, 40);
        cont.arc(20, 40, 30, 0 * Math.PI, k);
        cont.moveTo(340, 40);
        cont.arc(380, 40, 30, 1 * Math.PI, l);
        cont.moveTo(340, 40);
        cont.arc(380, 40, 30, 1 * Math.PI, i, true);
        k += 0.075;
        j -= 0.075;
        l += 0.075;
        i -= 0.075;
    } else {
        $timeBtn.show();
    }
    cont.stroke();
}

//Trigering animations
$timer.click(timerAnimate);
$difficulty.click(levelCanvas);

//Remove canvas on small devices
$window.resize(function() {
    if($(this).width() < 576) {
        $myCanvas.hide();
        $myCanvasTime.hide(); 
    }
})  

export function hideTimerBtns() {
    $timeBtn.css('visibility', 'hidden');
    $myCanvasTime.hide();
}