let c = document.getElementById('canvas'),
    ctx = c.getContext('2d'),
    pointView = document.querySelector('#point'),
    cx = c.width,
    cy = c.height,
    gameStart = true,
    foodColor = 'purple',
    snakeColor = ['white', 'red'],
    pz = 15,
    tail = 40,
    speed = 15,
    point = 0,
    trail = [],
    to = {
        x: 0,
        y: 0
    },
    storeTo = {
        x: 0,
        y: 0
    },
    snake = {
        x: (c.width / 2),
        y: (c.height / 2),
    },
    food = {
        x: Math.random() * cx,
        y: Math.random() * cy,
        ready: true
    };

window.onload = function () {
    document.addEventListener('keydown', eventListener);
    setInterval(game, 1000 / 15);
}

function assignValue(destination, x, y) {
    destination['x'] = x;
    destination['y'] = y;
}

function swapValue(destination, to, storeTo) {
    switch (destination) {
        case 'stopGame':
            assignValue(storeTo, to['x'], to['y']);
            assignValue(to, 0, 0);
            gameStart = false;
            break;
        case 'runGame':
            gameStart = true;
            assignValue(to, storeTo['x'], storeTo['y']);
            assignValue(storeTo, 0, 0);
            break;
        default:
            break;
    }
}

function eventListener(ev) {
    switch (ev.key) {
        case 'ArrowUp':
            assignValue(to, 0, -1);
            break;
        case 'ArrowDown':
            assignValue(to, 0, 1);
            break;
        case 'ArrowLeft':
            assignValue(to, -1, 0);
            break;
        case 'ArrowRight':
            assignValue(to, 1, 0);
            break;
        case ' ':
            if (storeTo['x'] == 0 && storeTo['y'] == 0) {
                swapValue('stopGame', to, storeTo);
            } else {
                swapValue('runGame', to, storeTo);
            }
            break;
        default:
            break;
    }
}

function snakeSpeed() {
    snake['x'] += (to['x'] * speed);
    snake['y'] += (to['y'] * speed);

    marginTopLeft = 0 - pz;
    marginBottomRight = cx + pz;

    if (snake['x'] <= marginTopLeft) {
        snake['x'] = marginBottomRight;
    } else if (snake['x'] >= marginBottomRight) {
        snake['x'] = marginTopLeft;
    } else if (snake['y'] <= marginTopLeft) {
        snake['y'] = marginBottomRight;
    } else if (snake['y'] >= marginBottomRight) {
        snake['y'] = marginTopLeft;
    }
}

function buildSnake() {
    snakeSpeed();

    for (let i = 0; i < trail.length; i++) {
        colorNumber = i % snakeColor.length;
        ctx.fillStyle = snakeColor[colorNumber];
        ctx.fillRect(trail[i].x, trail[i].y, pz - 1, pz - 1);
    }

    trail.push({
        x: snake['x'],
        y: snake['y']
    });

    while (trail.length > tail) {
        trail.shift();
    }
}

function foodCollition() {
    if ((food['x'] - pz < snake['x'] && food['x'] + pz > snake['x']) &&
        (food['y'] - pz < snake['y'] && food['y'] + pz > snake['y'])) {
        point += 10;
        tail++;
        food['ready'] = false;
    }
}

function getRandomize(c) {
    let val = Math.random() * c;
    let defaultNumber = pz * 2;

    if (val < defaultNumber) {
        val = defaultNumber;
    } else if (val > c) {
        val = c - defaultNumber;
    }

    return val;
}

function checkFoodReady() {
    if (!food['ready']) {
        food['x'] = getRandomize(cx);
        food['y'] = getRandomize(cy);
        food['ready'] = true;
    }
}

function getFood() {
    ctx.fillStyle = 'purple';
    ctx.fillRect(food['x'], food['y'], pz, pz);

    if (food['ready']) {
        foodCollition();
    } else {
        checkFoodReady();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, cx, cy);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cx, cy);
}

function updatePoint() {
    pointView.innerHTML = point;
}

function game() {
    clearCanvas();
    buildSnake();
    getFood();
    updatePoint();
}