if (Meteor.isClient) {

var mazeX, mazeY, gameX, gameY;
mazeX = 10;
mazeY = 10;
gameX = ((mazeY - 1) * 4 + 7) * 16 - 32;
gameY = ((mazeX - 1) * 2 + 3 ) * 16;


function preload() {
  game.load.image('wall', '/brick3.png');
  game.load.image('butt', '/dog_butt.png');
  game.load.image('head', '/dog_head.png');
    /*game.load.atlas('breakout', '/assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
    game.load.image('starfield', '/assets/misc/starfield.jpg');*/

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

function create() {
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
  var mazeString = display(maze(mazeX, mazeY));
  var butt = game.add.sprite(32, 0, 'butt');
  butt.scale.x = 320;
  butt.scale.y = 320;

  var head = game.add.sprite(32, 32, 'head');

  var wallX, wallY;

  var arr = [];
  var rowR = [];
  var row = 0;

  var rowLength = 7 + (4 * (mazeY - 1));
  var currentBlock = 0;
  var nextBlock = currentBlock + rowLength;

  console.log(mazeString.length);

  for (var scroll = 0; scroll < mazeString.length; scroll += rowLength) {
    
    console.log('scroll ' + scroll);
    console.log(currentBlock);
    console.log(nextBlock);


    rowR.push(mazeString.slice(currentBlock, nextBlock));
    currentBlock = nextBlock;
    nextBlock = currentBlock + rowLength;
  }
  console.log(rowR);
  for (var i = 0; i < rowR.length; i++) {
    for(var j = 0; j < rowR[i].length; j++) {
      if (rowR[i][j] !== ' ') {
        sX = 16 * j;
        sY = 16 * i;
        //game.add.sprite(sX, sY, 'wall', '/brick3.png');
      }
      //console.log(rowR[i][j]);
    }
  }
    /*rowR.push(scroll);
    arr.push(rowR);
    if (scroll % 43) {

      rowR.forEach(function(element, index, array) {
        wallX = index * 32;
        wallY = row * 16
        if (rowR[index] !== ' ') {
          console.log(scroll + ' X: ' + wallX + ' Y: ' + wallY);
          game.add.sprite(wallX, wallY, 'wall', '/brick3.png');
        }
      });
      rowR = [];
      row++;
    }*/

    /*var row = scroll / 43;
    
    if (scroll > 43) {
      wallX = (scroll / row ) + 32 * row;//10 * (scroll / (mazeY * 4)) * 32;
      wallY = (scroll / row ) + 16 * row;//(scroll / (mazeX * 2)) * 16;
    }
    else {
      wallX = 32 * scroll;
      wallY = 0;
    }
    if (mazeString[scroll] !== ' ') {
      console.log(scroll + ' X: ' + wallX + ' Y: ' + wallY);
      game.add.sprite(wallX, wallY, 'wall', '/brick3.png');
    }*/
  //}
  //console.log(arr);


/*
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  We check bounds collisions against all walls other than the bottom one
    game.physics.arcade.checkCollision.down = false;

    s = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    bricks = game.add.group();
    bricks.enableBody = true;
    bricks.physicsBodyType = Phaser.Physics.ARCADE;

    var brick;

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 15; x++)
        {
            brick = bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }

    paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
    paddle.anchor.setTo(0.5, 0.5);

    game.physics.enable(paddle, Phaser.Physics.ARCADE);

    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;
    
    scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
    ball.anchor.set(0.5);
    ball.checkWorldBounds = true;

    game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);

    ball.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false);

    ball.events.onOutOfBounds.add(ballLost, this);

    scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    livesText = game.add.text(680, 550, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
    introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
    introText.anchor.setTo(0.5, 0.5);

    game.input.onDown.add(releaseBall, this);
*/
}

function update () {

    //  Fun, but a little sea-sick inducing :) Uncomment if you like!
    // s.tilePosition.x += (game.input.speed.x / 2);
/*
    paddle.x = game.input.x;

    if (paddle.x < 24)
    {
        paddle.x = 24;
    }
    else if (paddle.x > game.width - 24)
    {
        paddle.x = game.width - 24;
    }

    if (ballOnPaddle)
    {
        ball.body.x = paddle.x;
    }
    else
    {
        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
    }
*/
}

var game = new Phaser.Game(gameX, gameY, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });


  Template.game.helpers({
    // game: function() {
    //   return game;
    // }
  });
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
