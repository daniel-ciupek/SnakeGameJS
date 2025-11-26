(function () {
  let canvas;
  let context2d;
  let wallSize = 10;
  let snake = [];
  let dx = 0;
  let dy = 0;
  let pauseGame = true;
  let food = { x: 0, y: 0, color: "white" };
  let points = 0;

  function getStep() {
    return Math.max(5, Math.floor(canvas.width / 60));
  }

  function resizeCanvas() {
    const maxSize = 600; 
    const screenWidth = window.innerWidth * 0.95; 
    const canvasSize = Math.min(maxSize, screenWidth);
    canvas.width = canvasSize;
    canvas.height = canvasSize;
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function clearCanvas() {
    context2d.fillStyle = "black";
    context2d.fillRect(0, 0, canvas.width, canvas.height);
  }

  function makeSnake(snakeLength) {
    for (let i = 0; i < snakeLength; i++) {
      let x = canvas.width / 2 + i * wallSize;
      let y = canvas.height / 2;
      snake.push({ x: x, y: y });
    }
  }

  function drawSnake() {
    snake.forEach(function (el) {
      context2d.strokeStyle = "red";
      context2d.lineWidth = 5;
      context2d.lineJoin = "bevel";
      context2d.strokeRect(el.x, el.y, wallSize, wallSize);
    });
  }

  function checkSelfCollision() {
    let head = snake[0];
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        resetGame();
        break;
      }
    }
  }

  function resetGame() {
    snake = [];
    makeSnake(5);
    randomFood();
    pauseGame = true;
    points = 0;
    dx = 0;
    dy = 0;
  }

  function moveSnake(dx, dy) {
    let headX = snake[0].x + dx;
    let headY = snake[0].y + dy;
    snake.unshift({ x: headX, y: headY });
    snake.pop();
  }

  function keyDown(e) {
    const step = getStep();
    if (pauseGame) pauseGame = false;
    switch (e.keyCode) {
      case 37: case 65: dx = -step; dy = 0; break;
      case 38: case 87: dx = 0; dy = -step; break;
      case 39: case 68: dx = step; dy = 0; break;
      case 40: case 83: dx = 0; dy = step; break;
    }
  }

  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }

  function handleTouchMove(e) {
    const step = getStep();
    const touch = e.touches[0];
    let dxTouch = touch.clientX - touchStartX;
    let dyTouch = touch.clientY - touchStartY;

    if (pauseGame) pauseGame = false;

    if (Math.abs(dxTouch) > Math.abs(dyTouch)) {
      dx = dxTouch > 0 ? step : -step;
      dy = 0;
    } else {
      dx = 0;
      dy = dyTouch > 0 ? step : -step;
    }

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    e.preventDefault();
  }

  function randomFood() {
    function randomV(min, max) {
      return Math.floor(Math.random() * (max - min) / wallSize) * wallSize;
    }
    let colors = ["yellow", "silver", "white", "orange"];
    food.color = colors[Math.floor(Math.random() * colors.length)];
    food.x = randomV(0, canvas.width - wallSize);
    food.y = randomV(0, canvas.height - wallSize);
  }

  function drawFood() {
    context2d.fillStyle = food.color;
    context2d.fillRect(food.x, food.y, wallSize, wallSize);
  }

  function checkWallCollision() {
    snake.forEach(function (el) {
      if (el.x < 0 || el.y < 0 || el.x >= canvas.width || el.y >= canvas.height)
        resetGame();
    });
  }

  function checkFoodCollision() {
    const head = snake[0];
    if (
        head.x < food.x + wallSize &&
        head.x + wallSize > food.x &&
        head.y < food.y + wallSize &&
        head.y + wallSize > food.y
    ) {
        snake.push(Object.assign({}, snake[snake.length - 1]));
        randomFood();
        points++;
    }
  }

  function drawPoints() {
    context2d.font = "20px Arial";
    context2d.fillStyle = "white";
    context2d.fillText("Points: " + points, 10, 20);
  }

  function startApp() {
    canvas = document.getElementById("canvas");
    context2d = canvas.getContext("2d");

    resizeCanvas(); 
    window.addEventListener("resize", resizeCanvas);

    document.addEventListener("keydown", keyDown);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);

    resetGame();

    setInterval(function () {
      clearCanvas();
      checkWallCollision();
      checkFoodCollision();
      checkSelfCollision();
      if (!pauseGame) moveSnake(dx, dy);
      drawPoints();
      drawFood();
      drawSnake();
    }, 100);
  }

  window.onload = startApp;
})();
