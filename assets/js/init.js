let c = document.getElementById('canvas'),
    ctx = c.getContext('2d'),
    point_view = document.querySelector('#point'),
    cx = c.width,
    cy = c.height,
    game_start = true,
    food_color = 'purple',
    snake_color = ['white', 'red'],
    pz = 15,
    tail = 40,
    speed = 15,
    point = 0,
    trail = [],
    to = {
        x: 0,
        y: 0
    },
    store_to = {
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
    document.addEventListener('keydown', event_listener);
    setInterval(game, 1000 / 15);
}

function assignValue(destination, x, y) {
    destination['x'] = x;
    destination['y'] = y;
}

function swapValue(destination, to, store_to) {
    switch (destination) {
        case 'stopGame':
            assignValue(store_to, to['x'], to['y']);
            assignValue(to, 0, 0);
            game_start = false;
            break;
        case 'runGame':
            game_start = true;
            assignValue(to, store_to['x'], store_to['y']);
            assignValue(store_to, 0, 0);
            break;
        default:
            break;
    }
}

function event_listener(ev) {
    console.log(ev.key);
    switch (ev.key) {
        case 'ArrowUp':
            if(to['x'] == 0 && to['y'] == 0 && game_start) assignValue(to, 0, -1);
            if(to['x'] != 0 && to['y'] != 1) assignValue(to, 0, -1);
            break;
        case 'ArrowDown':
            if(to['x'] == 0 && to['y'] == 0 && game_start) assignValue(to, 0, 1);
            if(to['x'] != 0 && to['y'] != -1) assignValue(to, 0, 1);
            break;
        case 'ArrowLeft':
            if(to['x'] == 0 && to['y'] == 0 && game_start) assignValue(to, -1, 0);
            if(to['x'] != 1 && to['y'] != 0) assignValue(to, -1, 0);
            break;
        case 'ArrowRight':
            if(to['x'] == 0 && to['y'] == 0 && game_start) assignValue(to, 1, 0);
            if(to['x'] != -1 && to['y'] != 0) assignValue(to, 1, 0);
            break;
        case ' ':
            if (store_to['x'] == 0 && store_to['y'] == 0) swapValue('stopGame', to, store_to);
            else swapValue('runGame', to, store_to);
            break;
        default:
            break;
    }
}

function snakeSpeed() {
    snake['x'] += (to['x'] * speed);
    snake['y'] += (to['y'] * speed);

    let margin_top_left = 0 - pz;
    let margin_bottom_right = cx + pz;

    if (snake['x'] <= margin_top_left) snake['x'] = margin_bottom_right;
    else if (snake['x'] >= margin_bottom_right) snake['x'] = margin_top_left;
    else if (snake['y'] <= margin_top_left) snake['y'] = margin_bottom_right;
    else if (snake['y'] >= margin_bottom_right) snake['y'] = margin_top_left;
}

function buildSnake() {
    snakeSpeed();

    for (let i = 0; i < trail.length; i++) {
        let number_of_color = i % snake_color.length;
        ctx.fillStyle = snake_color[number_of_color];
        ctx.fillRect(trail[i].x, trail[i].y, pz - 1, pz - 1);
    }

    trail.push({
        x: snake['x'],
        y: snake['y']
    });

    while (trail.length > tail) trail.shift();
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
    let default_number = pz * 2;

    if (val < default_number) val = default_number;
    else if (val > c) val = c - default_number;

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
    ctx.fillStyle = food_color;
    ctx.fillRect(food['x'], food['y'], pz, pz);

    if (food['ready']) foodCollition();
    else checkFoodReady();
}

function clearCanvas() {
    ctx.clearRect(0, 0, cx, cy);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cx, cy);
}

function updatePoint() {
    point_view.innerHTML = point;
}

function game() {
    clearCanvas();
    buildSnake();
    getFood();
    updatePoint();
}
