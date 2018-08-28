var zero, last_touch, start_y;
var offset = 125;
function start(e) {
    console.log('start');

    zero = e.touches[0].clientX;
    start_y = e.touches[0].clientY;
}

function move(e) {
    console.log('moving');

    let diff = zero - e.touches[0].clientX;
    if (diff > 0) {
        if (diff < offset) {
            e.target.style.left = (-diff + 'px');
        }
    }
    else {
        if (e.target.getAttribute('data-swiped') === 'true') {
            let n_diff = offset + diff;
            if (n_diff > 0) {
                e.target.style.left = (-n_diff + 'px');
            }
        }
    }

    last_touch = e.touches[0];
}

function end(e) {
    console.log('end');

    let diff = zero - last_touch.clientX;
    if (diff < 0) {
        diff = offset + diff;
    }

    let h_diff = start_y - last_touch.clientY;
    if (h_diff < 0) { h_diff *= -1; }

    if (h_diff < e.target.offsetHeight / 2) {
        if (diff > offset / 2) {
            e.target.style.left = -offset + 'px';
            e.target.setAttribute('data-swiped', true);
        }
        else {
            e.target.style.left = 0;
            e.target.setAttribute('data-swiped', false);
        }
    }
    else {
        if (e.target.getAttribute('data-swiped') === 'true') {
            e.target.style.left = -offset + 'px';
        }
        else{
            e.target.style.left = 0;
        }
    }
}

let swippers = document.getElementsByClassName('swipe-it');
for (let i = 0; i < swippers.length; i++) {
    let sw = swippers[i];
    sw.addEventListener("touchstart", start, false);
    sw.addEventListener("touchmove", move, false);
    sw.addEventListener("touchend", end, false);
}