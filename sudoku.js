example = [0,0,3,9,0,0,0,5,1,5,4,6,0,1,8,3,0,0,0,0,0,0,0,7,4,2,0,0,0,9,0,5,0,0,3,0,2,0,0,6,0,3,0,0,4,0,8,0,0,7,0,2,0,0,0,9,7,3,0,0,0,0,0,0,0,1,8,2,0,9,4,7,8,5,0,0,0,4,6,0,0];
puzzle = [[0,0,3,9,0,0,0,5,1],[5,4,6,0,1,8,3,0,0],[0,0,0,0,0,7,4,2,0],
[0,0,9,0,5,0,0,3,0],[2,0,0,6,0,3,0,0,4],[0,8,0,0,7,0,2,0,0],
[0,9,7,3,0,0,0,0,0],[0,0,1,8,2,0,9,4,7],[8,5,0,0,0,4,6,0,0]];

puzzle3 = [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];
puzzle2 = [[9,4,1,6,5,3,2,7,8],[2,5,8,4,9,7,6,3,1],[3,6,7,1,8,2,5,4,9],
[1,3,2,9,6,8,4,5,7],[4,7,9,5,0,1,8,6,2],[5,8,6,7,2,4,9,1,3],
[8,2,4,3,7,6,1,9,5],[6,9,3,2,1,5,7,8,4],[7,1,5,8,4,9,3,2,6]];



function initialize() {
  table = "";
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      table += "<div ";
      table += (puzzle[i][j] === 0 ? "class=\"changeable\" contentEditable=true " : "");
      table+= "id=c" + i + "" + j + ">" + (puzzle[i][j] != 0 ? puzzle[i][j] : "") + "</div>";
      console.log(i);
    }
   }
   $("#main").append(table);
   colorFixed(fixedCells(puzzle));
   drawGrid();

   listenToInput();
}

function listenToInput() {
  $('.changeable').focusout(function() {
    var id = this.id;
    var value = parseInt($("#" + id).text());
    console.log(typeof value)
    puzzle[id.charAt(1)][id.charAt(2)] = (value % 1 === 0 ? value : 0);
  });
}

function fixedCells(p) {
  var fixed = [];

  for (var i = 0; i < p.length; i++) {
    fixed[i] = [];
    for (var j = 0; j < p[0].length; j++) {
      if (p[i][j] != 0)
        fixed[i][j] = true;
      else
        fixed[i][j] = false;
    }
  }

  return fixed;
}

function colorFixed(fixed) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (fixed[i][j]) {
        cell = "#c" + i + "" + j;
        $(cell).css("background-color", "lavender");
      }

    }
  }
}

function drawGrid() {
  //$("#main").css("box-shadow", "-3px -3px 2px #000, 3px 3px 2px #000, -10px -10px 10px grey, 10px 10px 10px grey");
  $("#main").css("box-shadow", "0px 0px 30px 3px black"); /*any color you want*/
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      cell = "#c" + i + "" + j;
      // if (i == 0)
      //   $(cell).css("box-shadow", "0 -3px 2px #000");
      // if (i == 8)
      //   $(cell).css("box-shadow", "0 3px 2px #000");
      // if (j == 0)
      //   $(cell).css("box-shadow", "-3px 0 2px #000");
      // if (j == 8)
      //   $(cell).css("box-shadow", "3px 0 2px #000");

      if (i == 3 || i == 6)
        $(cell).css("box-shadow", "0 -3px 0 #000");
      if (j == 3 || j == 6)
        $(cell).css("box-shadow", "-3px 0 0 #000");
      if ((i == 3 || i == 6) && (j == 3 || j == 6))
        $(cell).css("box-shadow", "0 -3px 0 #000, -3px 0 0 #000");
    }
  }
}

function update() {
  console.log("updating")
   table = "";
   for (var i = 0; i < 9; i++) {
     for (var j = 0; j < 9; j++) {
       table += "<div contentEditable=true id=c" + i + "" + j + ">" + puzzle[i][j] + "</div>";
       cell = "#c" + i + "" + j;
       $(cell).text(puzzle[i][j]);
     }
   }
    //$("#main").html(table);

}

function solve() {
  solved = bruteforce(puzzle);

  if (solved) {
    $('#solve').text('done');
    $('#solve').css("background-color", "lightgreen");
  }
  else {
    $('#solve').text('invalid');
    $('#solve').css("background-color", "red");
  }
}

function bruteforce(p) {
  var empty = findEmptyCell(p);

  if (empty[0] == 10 || empty[1] == 10) {
    //update(puzzle);
    puzzle = p;
    return true;

  }

  var row = empty[0];
  var col = empty[1];

  numbers = shuffle();
  for (var i = 0; i < 9; i++) {
    num = numbers[i];
    if(isValidChoice(p, row, col, num)) {
      p[row][col] = num;
      // name = "c" + row + "" + col;
      // $("#" + name).text(num);
      if (bruteforce(p)) return true;
      p[row][col] = 0;
      // $("#" + name).text("0");
    }
  }

  return false;
}

function shuffle() {
  var numbers = [1,2,3,4,5,6,7,8,9];
  var counter = numbers.length;

  // fisher-yates shuffle
  while (counter > 0) {
    var index = Math.floor(Math.random() * counter);

    counter--;

    var tmp = numbers[counter];
    numbers[counter] = numbers[index];
    numbers[index] = tmp;
  }

  return numbers;
}

function findEmptyCell(puzzle) {
  var row = 10;
  var col = 10;

  for (var i = 0; i < puzzle.length; i++) {
    for (var j = 0; j < puzzle[0].length; j++) {
      if (puzzle[i][j] == 0)
        return [i, j];
    }
  }

  return [row, col];
}

function isValidChoice(puzzle, row, col, num) {
  if (numInRow(puzzle, num, row))
    return false;

  if (numInCol(puzzle, num, col))
    return false;

  if (!checkSubgrid(puzzle, num, row, col))
    return false;

  return true;
}

function checkSubgrid(puzzle, num, row, col) {
  var startx = row - (row%3);
  var starty = col - (col%3);

  for (var i = startx; i < startx+3; i++) {
    for (var j = starty; j < starty+3; j++) {
      if (puzzle[i][j] == num)
        return false;

    }
  }
  return true;
}

function numInRow(puzzle, num, row) {
  for (var j = 0; j < puzzle[row].length; j++) {
    if (puzzle[row][j] == num)
      return true;
  }

  return false;
}

function numInCol(puzzle, num, col) {
  for (var i = 0; i < puzzle.length; i++) {
    if (puzzle[i][col] == num)
      return true;
  }

  return false;
}
