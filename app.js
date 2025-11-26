(function () {
  let canvas;
  let context2d;
  let wallSize = 10;
  let snake = [];
  let dx = 0;
  let dy = 0;
  let pauseGame = true;

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

  function resetGame() {
    snake = [];
    makeSnake(5);
    pauseGame = true;
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

  function startApp() {
    canvas = document.getElementById("canvas");
    context2d = canvas.getContext("2d");
    document.addEventListener("keydown", keyDown);

    resetGame();

    setInterval(function () {
      clearCanvas();
      if (!pauseGame) moveSnake(dx, dy);
      drawSnake();
    }, 100);
  }

  window.onload = startApp;
})();
