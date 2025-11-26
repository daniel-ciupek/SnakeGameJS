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
  function drawRectRandomColor(x, y, width, height) {
    context2d.fillStyle = `rgb(${getRandomInt(255)}, 
      ${getRandomInt(255)}, 
      ${getRandomInt(255)})`;

    context2d.fillRect(x, y, width, height);
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
  }

  function moveSnake(dx, dy) {
    let headX = snake[0].x + dx;
    let headY = snake[0].y + dy;
    snake.unshift({ x: headX, y: headY });
    snake.pop();
  }

  function keyDown(e) {
    if (pauseGame) pauseGame = false;
    switch (e.keyCode) {
      case 37: // left
      case 65: // a
        dy = 0;
        dx = -10;
        break;

      case 38: // up
      case 87: // w
        dy = -10;
        dx = 0;
        break;

      case 39: // right
      case 68: // d
        dy = 0;
        dx = 10;
        break;

      case 40: // down
      case 83: // s
        dy = 10;
        dx = 0;
        break;
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
    if (pauseGame) pauseGame = false;

    const touch = e.touches[0];
    let dxTouch = touch.clientX - touchStartX;
    let dyTouch = touch.clientY - touchStartY;

    if (Math.abs(dxTouch) > Math.abs(dyTouch)) {
      if (dxTouch > 0) {
        dx = 10; // RIGHT
        dy = 0;
      } else {
        dx = -10; // LEFT
        dy = 0;
      }
    } else {
      if (dyTouch > 0) {
        dx = 0;
        dy = 10; // DOWN
      } else {
        dx = 0;
        dy = -10; // UP
      }
    }

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

    e.preventDefault();
  }

  function randomFood() {
    function randomV(min, max) {
      return (
        Math.floor((Math.random() * (max - min) + min) / wallSize) * wallSize
      );
    }

    let colors = ["yellow", "silver", "white", "orange"];
    food.color = colors[Math.floor(Math.random() * colors.length)];

    food.x = randomV(20, canvas.width - 20);
    food.y = randomV(20, canvas.height - 20);
  }

  function drawFood() {
    context2d.fillStyle = food.color;
    context2d.fillRect(food.x, food.y, wallSize, wallSize);
  }

  function checkWallCollision() {
    snake.forEach(function (el) {
      if (el.x > canvas.width || el.x < 0 || el.y > canvas.height || el.y < 0)
        resetGame();
    });
  }

  function checkFoodCollision() {
    if (food.x == snake[0].x && food.y == snake[0].y) {
      snake.push(Object.assign({}, snake[snake.length - 1]));
      randomFood();
      points++;
    }
  }

  function drawPoints() {
    context2d.font = "20px Arial";
    context2d.fillStyle = "white";
    context2d.fillText("Points:" + points, 10, 20);
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
      canvas.addEventListener("touchstart", handleTouchStart);
      canvas.addEventListener("touchmove", handleTouchMove);
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
