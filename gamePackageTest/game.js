if (Meteor.isClient) {


var blockWidth = 32, blockHeight = 32;

var mazeX, mazeY, gameX, gameY;
mazeX = 10;
mazeY = 10;
gameX = ((mazeY - 1) * 4 + 7) * blockWidth - (2 * blockWidth);
gameY = ((mazeX - 1) * 2 + 3 ) * blockHeight + blockHeight;

var cursors;
var player;
var wallGroup;

var game;

//States

loadState = {
		  preload: function () {
		    game.load.image('wall', '/brick3.png');
		    game.load.image('butt', '/dog_butt.png');
		    game.load.image('head', '/dog_head.png');
		      /*game.load.atlas('breakout', '/assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
		      game.load.image('starfield', '/assets/misc/starfield.jpg');*/
		    game.state.start('maze');
		  }
		}

  function maze(x,y) {
    var n=x*y-1;
    if (n<0) {alert("illegal maze dimensions");return;}
    var horiz =[]; for (var j= 0; j<x+1; j++) horiz[j]= [],
        verti =[]; for (var j= 0; j<x+1; j++) verti[j]= [],
        here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)],
        path = [here],
        unvisited = [];
    for (var j = 0; j<x+2; j++) {
      unvisited[j] = [];
      for (var k= 0; k<y+1; k++)
        unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
    }
    while (0<n) {
      var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
          [here[0]-1, here[1]], [here[0],here[1]-1]];
      var neighbors = [];
      for (var j = 0; j < 4; j++)
        if (unvisited[potential[j][0]+1][potential[j][1]+1])
          neighbors.push(potential[j]);
      if (neighbors.length) {
        n = n-1;
        next= neighbors[Math.floor(Math.random()*neighbors.length)];
        unvisited[next[0]+1][next[1]+1]= false;
        if (next[0] == here[0])
          horiz[next[0]][(next[1]+here[1]-1)/2]= true;
        else 
          verti[(next[0]+here[0]-1)/2][next[1]]= true;
        path.push(here = next);
      } else 
        here = path.pop();
    }
    return {x: x, y: y, horiz: horiz, verti: verti};
  }
   
  function display(m) {
    var text= [];
    for (var j= 0; j<m.x*2+1; j++) {
      var line= [];
      if (0 == j%2)
        for (var k=0; k<m.y*4+1; k++)
          if (0 == k%4) 
            line[k]= '+';
          else
            if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
              line[k]= ' ';
            else
              line[k]= '-';
      else
        for (var k=0; k<m.y*4+1; k++)
          if (0 == k%4)
            if (k>0 && m.horiz[(j-1)/2][k/4-1])
              line[k]= ' ';
            else
              line[k]= '|';
          else
            line[k]= ' ';
      if (0 == j) line[1]= line[2]= line[3]= ' ';
      if (m.x*2-1 == j) line[4*m.y]= ' ';
      text.push(line.join('')+'\r\n');
    }
    return text.join('');
  }

  function loadMaze() {
    var mazeString = display(maze(mazeX, mazeY));

    wallGroup = game.add.physicsGroup();
    
    var wallX, wallY;

    var arr = [];
    var rowR = [];
    var row = 0;

    var rowLength = 7 + (4 * (mazeY - 1));
    var currentBlock = 0;
    var nextBlock = currentBlock + rowLength;

    console.log(mazeString.length);

     var previousSlot, nextSlot, thisSlot;
     var stillEmpty = false;
     var emptyCount = 0;
     var newMazeString = '';
     //Filter out triple wides
    for (var scroll = 0; scroll < mazeString.length; scroll ++) {
      
      // console.log('scroll ' + scroll);
      // console.log(currentBlock);
      // console.log(nextBlock);
      console.log(mazeString[scroll]);
      
      if (mazeString[scroll] == ' ') {
        emptyCount++;
        stillEmpty = true;
        if (emptyCount == 3) {
          if (mazeString[scroll + 1] != ' ') {
            console.log('things?')
            //triple wide. Close it in
           
            newMazeString += ' ';

            stillEmpty = false;
            emptyCount = 0;
          }
        } else if ( (emptyCount - 1) % 3 == 0) { //if long space row
          if (stillEmpty) {
            console.log('anomoly');
            newMazeString += ' ';
          }
        }
      } else {
        emptyCount = 0;
        stillEmpty = false;
        newMazeString += mazeString[scroll];
      }

       if (previousSlot == ' '  && nextSlot == ' ' && thisSlot == ' ') {
            //Fill in previous
            rowR[i][j-1] = '+';
            sX = blockWidth * (j - 1);
            sY = blockHeight * i + blockHeight;
            //game.add.sprite(sX, sY, 'wall', '/brick3.png');
            // var wall = wallGroup.create(sX, sY, 'wall', '/brick3.png');
            // wall.body.immovable = true;
            //Fill in next
            //rowR[i][j+1] = '+';
            // sX = blockWidth * (j + 1);
            // sY = blockHeight * i + blockHeight;
            // //game.add.sprite(sX, sY, 'wall', '/brick3.png');
            // var wall = wallGroup.create(sX, sY, 'wall', '/brick3.png');
            // wall.body.immovable = true;
          } 
    }
    console.log(mazeString);
    console.log(newMazeString);
    //add to array
    for (var scroll = 0; scroll < mazeString.length; scroll += rowLength) {
      


      rowR.push(mazeString.slice(currentBlock, nextBlock));
      currentBlock = nextBlock;
      nextBlock = currentBlock + rowLength;
    }

    console.log(rowR);

   

    for (var i = 0; i < rowR.length; i++) {
      for(var j = 0; j < rowR[i].length; j++) {
        if (rowR[i][j] !== ' ') {
          sX = blockWidth * j;
          sY = blockHeight * i + blockHeight;

          var wall = wallGroup.create(sX, sY, 'wall', '/brick3.png');
          wall.body.immovable = true;
        }

        // else if (rowR[i][j] == ' ') {
        //   previousSlot = rowR[i][j - 1];
        //   nextSlot = rowR[i][j + 1];
        //   console.log('previous slot: ' + previousSlot);
        //   console.log('current slot: ' + rowR[i][j]);
        //   console.log('next slot: ' + nextSlot);

         
        // }

      }
    }
  }

  function collisionHandler() {
    return true;
  }

  function processHandler() {
    return true;
  }

  mazeState = {

  create: function() {
    /*game.add examples */
    //
    //scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    //ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
    //

    //1 - 7, ... 9 - 39, 10 - 43, 11 - 47
    //x.length = 7 + 4y
    //1 - 3, ... 8 - 17, 9 - 19, 10 - 21
    //y.length = 3 + 2x

    //width = 32, height = 16
    
    loadMaze();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    var butt = game.add.sprite(0, 0, 'butt');
    butt.scale.setTo(.05);

    player = game.add.sprite(32, 16, 'head');
    player.moving = false;

    player.scale.setTo(.05);
    player.anchor.setTo(.5, .5);

    game.physics.arcade.enable(player);



    cursors = game.input.keyboard.createCursorKeys();

  },

  update: function () {
      if (game.physics.arcade.collide(player, wallGroup, collisionHandler, processHandler, this))
      {
          console.log('boom');
      }

      player.body.velocity.x = 0;
      player.body.velocity.y = 0;

      if (cursors.left.isDown)
      {
      	player.moving = !player.moving;
          //player.x -= 32;
          //player.body.velocity.x = -200;
          player.angle = 180;
          player.scale.y = -Math.abs(player.scale.y);

      }
      else if (cursors.right.isDown)
      {
      	player.moving = !player.moving;
          //player.x += 32;
          //player.body.velocity.x = 200;
          player.angle = 0;
          player.scale.y = Math.abs(player.scale.y);
      }

      if (cursors.up.isDown)
      {
          player.moving = !player.moving;
          //player.y -= 32;
          //player.body.velocity.y = -200;
          player.angle = 270;
          // player.scale.y = Math.abs(player.scale.y);

      }
      else if (cursors.down.isDown)
      {
         player.moving = !player.moving;
      	 //player.y += 32;
          //player.body.velocity.y = 200;
          player.angle = 90;
          // player.scale.y = Math.abs(player.scale.y);
      }

      if (player.moving) {
      	switch (player.angle) {
      		case 0: //	straight/right
      			player.x += 32;
      		break;
      		case 90: // down
      			player.y += 32;
      		break;
      		case 180: // left
      			player.x -= 32;
      		break;
      		case 270: // up
      			player.y -= 32;
      		break;
      	}
      	player.moving = false;
      }

      if (player.x >= gameX - 32) {
        if (player.y >= gameY - 64) {
          finText = game.add.text(32, 550, 'Maze Cleared!', { font: "20px Arial", fill: "#ffffff", align: "left" });

        }
      }


  }
  }

//END States

//var game = new Phaser.Game(gameX, gameY, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });
game = new Phaser.Game(gameX, gameY, Phaser.CANVAS, 'phaser-example');
game.state.add('load', loadState);
game.state.add('maze', mazeState);

game.state.start('load');

}
