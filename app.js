(function() {
   let canvas;
   let context2d;
   let wallSize = 10;
   let snake = [];


   function getRandomInt(max) {
      return Math.floor(Math.random() *max);
   }
   function drawRectRandomColor(x, y, width, height) {
      context2d.fillStyle = `rgb(${getRandomInt(255)}, 
      ${getRandomInt(255)}, 
      ${getRandomInt(255)})`;

      context2d.fillRect(x, y, width, height);


   }

   function clearCanvas() {
      context2d.fillStyle = "black";
      context2d.fillRect(0,0, canvas.width, canvas.height);
   }
   function makeSnake(snakeLength) {
      for(let i = 0; i < snakeLength; i++) {
         let x = canvas.width/2 + i * wallSize;
         let y = canvas.height/2;
         snake.push({x:x, y:y});
      }
   }

   function drawSnake() {
      snake.forEach(function(el) {
         context2d.strokeStyle = "red";
         context2d.lineWidth = 5;
         context2d.lineJoin = "bevel";
         context2d.strokeRect(el.x, el.y, wallSize, wallSize);
      });
   }

   function resetGame() {
      snake = [];
      makeSnake(5);
   }

   function startApp() {
      canvas = document.getElementById("canvas");
      context2d = canvas.getContext("2d");

      resetGame();

      setInterval(function() {
         clearCanvas();
         drawSnake();
         

      }, 100);

   }

   window.onload = startApp;
   
})();

