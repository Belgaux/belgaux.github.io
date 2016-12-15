var canvas = document.getElementById("canvas");
var snake;
var food;
var grid_size;
var grid_unit_x;
var grid_unit_y;
document.onkeydown = handleKeyPress;
window.onload = function() { init(); }

// temporary draw throttle
var now, last, dt, fpsInterval, fps;

// TODO: Convert `dir` property to an enum (if javscript has that)
// TODO: Find out how to do interpolation in js to remove draw throttling
// TODO: Maybe restrict food spawning positions.
// TODO: Fix food spawning inside snake.

function init()
{
    canvas.width = 800;
    canvas.height = 600;
    grid_size = 10;
    grid_unit_x = canvas.width / grid_size;
    grid_unit_y = canvas.height / grid_size;
    snake = {
        x: 0,
        y: grid_unit_y,
        dir: "right",
        tail: [],
    };
    food = {
        x: Math.floor((Math.random() * grid_size-1) + 1) * grid_unit_x,
        y: Math.floor((Math.random() * grid_size-1) + 1) * grid_unit_y,
    }
    console.log(food);
    last = Date.now();
    fps = 7;
    fpsInterval = 1000 / fps;
    window.requestAnimationFrame(draw);
}

function draw()
{
    now = Date.now();
    dt = now - last;
    if (dt > fpsInterval) {
        last = now - (dt % fpsInterval);

        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Snake
        if (snake.tail.length > 0) {
            // Update tail blocks
            for (var i = snake.tail.length-1; i >= 0; i--) {
                if (i == 0) {
                    snake.tail[i].x = snake.x;
                    snake.tail[i].y = snake.y;
                    snake.tail[i].dir = snake.dir;
                } else {
                    snake.tail[i].x = snake.tail[i-1].x;
                    snake.tail[i].y = snake.tail[i-1].y;
                    snake.tail[i].dir = snake.tail[i-1].dir
                }
            }
        }
        moveBlock(snake);

        // Draw all blocks
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.strokeRect(snake.x, snake.y, grid_unit_x, grid_unit_y);
        for (var i = 0; i < snake.tail.length; i++) {
            ctx.strokeRect(snake.tail[i].x, snake.tail[i].y, grid_unit_x, grid_unit_y);
        }

        // Food
        ctx.fillStyle = "rgb(0, 200, 0)";
        ctx.fillRect(food.x, food.y, grid_unit_x, grid_unit_y);
        // Eat food
        if (food.x === snake.x && food.y === snake.y) {
            food.x = Math.floor((Math.random() * grid_size-1) + 1) * grid_unit_x,
            food.y = Math.floor((Math.random() * grid_size-1) + 1) * grid_unit_y,
            addTailSegment();
        }

        // Death
        for (var i = 0; i < snake.tail.length; i++) {
            // Self intersection
            if (snake.x === snake.tail[i].x && snake.y === snake.tail[i].y) {
                init();
            }
        }
    }
    window.requestAnimationFrame(draw);
}

function moveBlock(block)
{
    // Movement
    if (block.dir === "right") {
        block.x += grid_unit_x;
    } else if (block.dir === "left") {
        block.x -= grid_unit_x;
    } else if (block.dir === "up") {
        block.y -= grid_unit_y;
    } else if (block.dir === "down") {
        block.y += grid_unit_y;
    }
    // Screen wrapping
    if (block.dir === "right" && block.x === canvas.width) {
        block.x = canvas.width - (block.x);
    } else if (block.dir === "left" && block.x === 0 - grid_unit_x) {
        block.x = canvas.width - grid_unit_x;
    } else if (block.dir === "up" && block.y === 0 - grid_unit_y) {
        block.y = canvas.height - grid_unit_y;
    } else if (block.dir === "down" && block.y === canvas.height) {
        block.y = canvas.height - (block.y);
    }
}

function handleKeyPress(e)
{
    if (e.key === "d" && snake.dir !== "left") {
        snake.dir = "right";
    } else if (e.key === "a" && snake.dir !== "right") {
        snake.dir = "left";
    } else if (e.key === "w" && snake.dir !== "down") {
        snake.dir = "up";
    } else if (e.key === "s" && snake.dir !== "up") {
        snake.dir = "down";
    }
}

function addTailSegment()
{
    new_tail_segment = { x: 0, y: 0, dir:"right"};
    snake.tail.push(new_tail_segment);
}
