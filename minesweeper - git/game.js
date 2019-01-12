/**
	Classic minesweeper game created in p5.js

	author: Blaine Fourman


each box is 30 by 30
mine has a 20% chance to spawn in a tile
color switches between 2 grays to look better


	 TODO: 	  
		  TO FUNCTION:
		  put background draw into setup to reduce the amount of work (DONE)
		  mouse click for box (DONE)
		  display number of surrounding bombs (DoNE)
		  		calculate surrounding bombs(DONE)
		  display flag if left click (DONE)
		  

		  (DONE)
		  if bomb is clicked:
		  		show unclicked bombs in red tile
		  		keep flag position the same if correct
		  		if flag is wrong show a red X with a unique background

		  EXTRAS:
		  reset button
		  show time elapsed (DOne)
		  show number of bombs left to find (DONE)

**/
let bombArray = [];
let table = [];
let rowLength = 30;
let columnLength = 16;
let cSwitch = false;
let time = 0;
let totalBombs = 0;
let bombsLeft = 0;	

let font;
let currentSecond;

let gameOver = false;

function preload() {

	font = loadFont("assests/SourceSansPro-Regular.otf");
}

function setup() {

	
	// fits box size of 30 x 30 + plus an extra 200 pixels on the bottom for menu
	createCanvas(900, 680);
	background(0);
	
	// Creates array of the game board and generates which cell gets bombs (20%)
	for(var x = 0; x < rowLength; x++) {
		table[x] = [];
		for(var y = 0; y < columnLength; y ++) {
			
			// spawns bomb around 20% of the time
			var bomb = false;
			if(0.20 >= random(0,1)) {
				bomb = true;
				totalBombs ++;
				bombArray.push((createVector(x,y)));

			}

			table[x][y] = new cell(x,y,bomb);
			
		}
	}

	// calculate surround bombs
	for(var x = 0; x < rowLength; x++) {
		for(var y = 0; y < columnLength; y++) {
				table[x][y].setBombCount(countBombs(x,y));
		}
	}

	// Prints intial table w/ bombs shown to the screen
	for(var x = 0; x < rowLength; x++) {
		for(var y = 0; y < columnLength; y ++) {
			let current = table[x][y];

			// draws the box
			if(current.getColorS()) {
				fill(160,160,160); // was 216,216,216
				rect(x*30,y*30,30,30);
			}
			else {
				fill(160,160,160); // was 140,140,140
				rect(x*30,y*30,30,30);
			}

			// draws the bomb if there is one
			// if(current.getIsBomb()) {
			// 	fill(0);
			// 	ellipse((current.getX()*30) + 15, (current.getY()*30) + 15, 10);
			// }
		}
	}
	

	bombsLeft = totalBombs;
	currentSecond = second();
	textFont(font);
}

// updates time and bombs left
function draw() {
	
	// draws updated time/bombs left
	textSize(50);

	strokeWeight(7);
	stroke(0);
	fill(0);
	rect(0,480,900,200);

	if(!gameOver){
		if(currentSecond != second()) {
			currentSecond = second();
			time ++;
		}
	}

	// draws time elapsed
	stroke(255,255,255);
	strokeWeight(1);
	fill(255,255,255);
	text("Seconds: " + time , 75 , 580);
	

	// checks if all bombs have been flagged
	let bombsFlagged = 0;
	for(let i = 0; i < bombArray.length; i ++) {
		if(table[bombArray[i].x][bombArray[i].y].getFlagged()) {
			bombsFlagged++;
		}
	}
	if(bombsFlagged == totalBombs) {
		text("YOU WIN!" , 300, 300);
		gameOver = true;
	}

	// bombs left
	text("Flags left: " + bombsLeft, 600, 580);


	// reset stroke color and weight
	strokeWeight(1);
	stroke(0);
}

// catches the mouse event 
function mouseReleased() {

	if(!gameOver) {
		onContextMenu = false;

		// get box released on
		var boxX = int(mouseX/30);
		var boxY = int(mouseY/30);

		let cell = table[boxX][boxY];

		// for testing
		if(cell.getIsBomb()) {
			console.log("Is a bomb")
		}
		else {
		console.log(cell.getBombCount());

		}

		
		// process what event to do based on the which button is clicked
		if(mouseButton === RIGHT) {
			if(bombsLeft > 0 && !cell.getIsShown()) {	
				// top corner of the box
				let cornerX = cell.getX()*30;
				let cornerY = cell.getY()*30;

				if(cell.getFlagged()) {

					fill(160,160,160); // was 140,140,140
					rect(cornerX,cornerY,30,30);

					cell.setUnFlagged();
					bombsLeft++;
				}
				else {

					fill(110,255,210);

					//               top corner           bottom corner       point of the flag         
					triangle(cornerX + 17,cornerY+5, cornerX+17,cornerY+15, cornerX+7, cornerY+10);
					rect(cornerX+17,cornerY+5,2,20);
					bombsLeft--;

					cell.setFlagged();
				}
			}
		}
		else { // process the left. either revels number/open space(DONE) or makes all bombs red(DONE)
			
			if(cell.getIsBomb()) { // if the cell is a bomb
				for(var x = 0; x < rowLength; x ++) {
					for(var y = 0; y < columnLength; y++) {

						if(table[x][y].getIsBomb()) {
							
							fill(255,0,0);
							rect(table[x][y].getX()*30,table[x][y].getY()*30,30,30);

							fill(0,0,0);
							ellipse(table[x][y].getX()*30 + 15, table[x][y].getY()*30 +15, 10);
						}

					}
				}

				gameOver = true;
			}
			else { // the cell is not a bomb

				// paints the current square
				paintSquare(cell.getX(),cell.getY());

				
			}

		}

		console.log("Mouse Button: " + mouseButton);
	}
}

/**
* Given an x,y of  acell in the table, paints the square based
* on how manu bombs are adjacent to it.
	
  If the square is empty paints the surrounding squares

*/
function paintSquare(x,y) {
	
	console.log("Current cell: " + x + "," + y);

	
	fill(200,200,200);
	rect(table[x][y].getX()*30,table[x][y].getY()*30,30,30);

	let cellBombCount = table[x][y].getBombCount();
			if(cellBombCount == 1) {
				// blue
				fill(25,28,232);
				//stroke(25,28,232);
				textSize(20);
				text("1",table[x][y].getX()*30+10,table[x][y].getY()*30+22);

				if(table[x][y].getFlagged()) {
					table[x][y].setUnFlagged();
					bombsLeft++;
				}

			}
			else if(cellBombCount == 2) {
				// cyan
				fill(89,204,249);
				//stroke(89,204,249);
				textSize(20);
				text("2",table[x][y].getX()*30+10,table[x][y].getY()*30+22);

				if(table[x][y].getFlagged()) {
					table[x][y].setUnFlagged();
					bombsLeft++;
				}
			}
			else if(cellBombCount == 3) {
				// green
				fill(80,244,66);
				//stroke(80,244,66);
				textSize(20);
				text("3",table[x][y].getX()*30+10,table[x][y].getY()*30+22);

				if(table[x][y].getFlagged()) {
					table[x][y].setUnFlagged();
					bombsLeft++;
				}
			}
			else if(cellBombCount == 4) {
				// yellow
				fill(245,255,58);
				//stroke(245,255,58);
				textSize(20);
				text("4",table[x][y].getX()*30+10,table[x][y].getY()*30+22);

				if(table[x][y].getFlagged()) {
					table[x][y].setUnFlagged();
					bombsLeft++;
				}
			}
			else if(cellBombCount == 5) {
				// orange
				fill(249,180,19);
				//stroke(249,180,19);
				textSize(20);
				text("5",table[x][y].getX()*30+10,table[x][y].getY()*30+22);

				if(table[x][y].getFlagged()) {
					table[x][y].setUnFlagged();
					bombsLeft++;
				}
			}
			else if(cellBombCount == 6) {
				//red
				fill(249,54,19);
				//stroke(249,54,19);
				textSize(20);
				text("6",table[x][y].getX()*30+10,table[x][y].getY()*30+22);

				if(table[x][y].getFlagged()) {
					table[x][y].setUnFlagged();
					bombsLeft++;
				}
			}
			else if(cellBombCount == 7) {
				// pink
				fill(255,48,196);
				//stroke(255,48,196);
				textSize(20);
				text("7",table[x][y].getX()*30+10,table[x][y].getY()*30+22);

				if(table[x][y].getFlagged()) {
					table[x][y].setUnFlagged();
					bombsLeft++;
				}
			}
			else if(cellBombCount == 8) {
				// purple
				fill(164,32,247);
				//stroke(164,32,247);
				textSize(20);
				text("8",table[x][y].getX()*30+10,table[x][y].getY()*30+22);

				if(table[x][y].getFlagged()) {
					table[x][y].setUnFlagged();
					bombsLeft++;
				}
			}
			else { // no surrounding bombs, or is a bomb
				if(table[x][y].getFlagged()) {
					table[x][y].setUnFlagged();
					bombsLeft++;
				}


				if(x == 0) {
					if(y == 0) { // upper left corner
			

						if(!table[x+1][y].getIsBomb() 	&& !table[x+1][y].getIsShown()) {table[x+1][y].setIsShown(); paintSquare(x+1,y)};
						if(!table[x][y+1].getIsBomb() 	&& !table[x][y+1].getIsShown()) {table[x][y+1].setIsShown(); paintSquare(x,y+1)};
						if(!table[x+1][y+1].getIsBomb() && !table[x+1][y+1].getIsShown()) {table[x+1][y+1].setIsShown(); paintSquare(x+1,y+1)};

					}
					else if(y == 15) { // lower left corner
						if(!table[x][y-1].getIsBomb() 	&& !table[x][y-1].getIsShown()) {table[x][y-1].setIsShown(); paintSquare(x,y-1)};
						if(!table[x+1][y-1].getIsBomb() && !table[x+1][y-1].getIsShown()) {table[x+1][y-1].setIsShown(); paintSquare(x+1,y-1)};
						if(!table[x+1][y].getIsBomb() 	&& !table[x+1][y].getIsShown()) {table[x+1][y].setIsShown(); paintSquare(x+1,y)};
					}
					else {
						if(!table[x][y-1].getIsBomb() 	&& !table[x][y-1].getIsShown()) {table[x][y-1].setIsShown(); paintSquare(x,y-1)};
						if(!table[x+1][y-1].getIsBomb() && !table[x+1][y-1].getIsShown()) {table[x+1][y-1].setIsShown(); paintSquare(x+1,y-1)};
						if(!table[x+1][y].getIsBomb() 	&& !table[x+1][y].getIsShown()) {table[x+1][y].setIsShown(); paintSquare(x+1,y)};
						if(!table[x][y+1].getIsBomb() 	&& !table[x][y+1].getIsShown()) {table[x][y+1].setIsShown(); paintSquare(x,y+1)};
						if(!table[x+1][y+1].getIsBomb() && !table[x+1][y+1].getIsShown()) {table[x+1][y+1].setIsShown(); paintSquare(x+1,y+1)};
		
					}
				} 
				// right hand side
				else if (x == 29) {
					//upper right corner
					if(y == 0) {
						if(!table[x-1][y].getIsBomb() 	&& !table[x-1][y].getIsShown()) {table[x-1][y].setIsShown(); paintSquare(x-1,y)};
						if(!table[x-1][y+1].getIsBomb() && !table[x-1][y+1].getIsShown()) {table[x-1][y+1].setIsShown(); paintSquare(x-1,y+1)};
						if(!table[x][y+1].getIsBomb() 	&& !table[x][y+1].getIsShown()) {table[x][y+1].setIsShown(); paintSquare(x,y+1)};
					}
					// lower right corner
					else if (y == 15) {
						if(!table[x-1][y].getIsBomb() 	&& !table[x-1][y].getIsShown()) {table[x-1][y].setIsShown(); paintSquare(x-1,y)};
						if(!table[x-1][y-1].getIsBomb() && !table[x-1][y-1].getIsShown()) {table[x-1][y-1].setIsShown(); paintSquare(x-1,y-1)};
						if(!table[x][y-1].getIsBomb() 	&& !table[x][y-1].getIsShown()) {table[x][y-1].setIsShown(); paintSquare(x,y-1)};
					}
					else {
						if(!table[x][y-1].getIsBomb() 	&& !table[x][y-1].getIsShown()) {table[x][y-1].setIsShown(); paintSquare(x,y-1)};
						if(!table[x-1][y-1].getIsBomb() && !table[x-1][y-1].getIsShown()) {table[x-1][y-1].setIsShown(); paintSquare(x-1,y-1)};
						if(!table[x-1][y].getIsBomb() 	&& !table[x-1][y].getIsShown()) {table[x-1][y].setIsShown(); paintSquare(x-1,y)};
						if(!table[x-1][y+1].getIsBomb() && !table[x-1][y+1].getIsShown()) {table[x-1][y+1].setIsShown(); paintSquare(x-1,y+1)};
						if(!table[x][y+1].getIsBomb() 	&& !table[x][y+1].getIsShown()) {table[x][y+1].setIsShown(); paintSquare(x,y+1)};	
					}
				}
				// all other boxes: x does not limit these boxs, y still does 
				else {
					if(y == 0) { // top row excpet corners
						if(!table[x-1][y].getIsBomb() 	&& !table[x-1][y].getIsShown()) {table[x-1][y].setIsShown(); paintSquare(x-1,y)};
						if(!table[x+1][y].getIsBomb() 	&& !table[x+1][y].getIsShown()) {table[x+1][y].setIsShown(); paintSquare(x+1,y)};
						if(!table[x-1][y+1].getIsBomb() && !table[x-1][y+1].getIsShown()) {table[x-1][y+1].setIsShown(); paintSquare(x-1,y+1)};
						if(!table[x][y+1].getIsBomb() 	&& !table[x][y+1].getIsShown()) {table[x][y+1].setIsShown(); paintSquare(x,y+1)};
						if(!table[x+1][y+1].getIsBomb() && !table[x+1][y+1].getIsShown()) {table[x+1][y+1].setIsShown(); paintSquare(x+1,y+1)};	
					}
					else if (y == 15) { // bottom row except corners
						if(!table[x-1][y].getIsBomb() 	&& !table[x-1][y].getIsShown()) {table[x-1][y].setIsShown(); paintSquare(x-1,y)};
						if(!table[x-1][y-1].getIsBomb() && !table[x-1][y-1].getIsShown()) {table[x-1][y-1].setIsShown(); paintSquare(x-1,y-1)};
						if(!table[x][y-1].getIsBomb() 	&& !table[x][y-1].getIsShown()) {table[x][y-1].setIsShown(); paintSquare(x,y-1)};
						if(!table[x+1][y-1].getIsBomb() && !table[x+1][y-1].getIsShown()) {table[x+1][y-1].setIsShown(); paintSquare(x+1,y-1)};
						if(!table[x+1][y].getIsBomb() 	&& !table[x+1][y].getIsShown()) {table[x+1][y].setIsShown(); paintSquare(x+1,y)};	
					}
					else { // rest of the boxes
						if(!table[x-1][y-1].getIsBomb() && !table[x-1][y-1].getIsShown()) {table[x-1][y-1].setIsShown(); paintSquare(x-1,y-1)};
						if(!table[x][y-1].getIsBomb() 	&& !table[x][y-1].getIsShown()) {table[x][y-1].setIsShown(); paintSquare(x,y-1)};
						if(!table[x+1][y-1].getIsBomb() && !table[x+1][y-1].getIsShown()) {table[x+1][y-1].setIsShown(); paintSquare(x+1,y-1)};
						if(!table[x-1][y].getIsBomb() 	&& !table[x-1][y].getIsShown()) {table[x-1][y].setIsShown(); paintSquare(x-1,y)};
						if(!table[x+1][y].getIsBomb() 	&& !table[x+1][y].getIsShown()) {table[x+1][y].setIsShown(); paintSquare(x+1,y)};	
						if(!table[x-1][y+1].getIsBomb() && !table[x-1][y+1].getIsShown()) {table[x-1][y+1].setIsShown(); paintSquare(x-1,y+1)};
						if(!table[x][y+1].getIsBomb() 	&& !table[x][y+1].getIsShown()) {table[x][y+1].setIsShown(); paintSquare(x,y+1)};
						if(!table[x+1][y+1].getIsBomb() && !table[x+1][y+1].getIsShown()) {table[x+1][y+1].setIsShown(); paintSquare(x+1,y+1)};
					}
				}

				// fill for the current empty cell
				fill(200,200,200);
				stroke(0);
				rect(x*30,y*30,30,30);
			}
					
}

// counts the adjacent bombs for a given cell in the table
function countBombs(x,y) {
	let count = 0;
	console.log(x,y);

	// left hand side
	if(x == 0) {
		if(y == 0) { // upper left corner
			
			if(table[x+1][y].getIsBomb()) {count ++};
			if(table[x][y+1].getIsBomb()) {count ++};
			if(table[x+1][y+1].getIsBomb()) {count ++};

		}
		else if(y == 15) { // lower left corner
			if(table[x][y-1].getIsBomb()) {count ++};
			if(table[x+1][y-1].getIsBomb()) {count ++};
			if(table[x+1][y].getIsBomb()) {count ++};
		}
		else {

			if(table[x][y-1].getIsBomb()) {count ++};
			if(table[x+1][y-1].getIsBomb()) {count ++};
			if(table[x+1][y].getIsBomb()) {count ++};
			if(table[x][y+1].getIsBomb()) {count ++};
			if(table[x+1][y+1].getIsBomb()) {count ++};
	
		}
	} 
	// right hand side
	else if (x == 29) {
		//upper right corner
		if(y == 0) {
			if(table[x-1][y].getIsBomb()) {count ++};
			if(table[x-1][y+1].getIsBomb()) {count ++};
			if(table[x][y+1].getIsBomb()) {count ++};
		}
		// lower right corner
		else if (y == 15) {
			if(table[x-1][y].getIsBomb()) {count ++};
			if(table[x-1][y-1].getIsBomb()) {count ++};
			if(table[x][y-1].getIsBomb()) {count ++};
		}
		else {
			if(table[x][y-1].getIsBomb()) {count ++};
			if(table[x-1][y-1].getIsBomb()) {count ++};
			if(table[x-1][y].getIsBomb()) {count ++};
			if(table[x-1][y+1].getIsBomb()) {count ++};
			if(table[x][y+1].getIsBomb()) {count ++};	
		}
	}
	// all other boxes: x does not limit these boxs, y still does 
	else {
		if(y == 0) { // top row excpet corners
			if(table[x-1][y].getIsBomb()) {count ++};
			if(table[x+1][y].getIsBomb()) {count ++};
			if(table[x-1][y+1].getIsBomb()) {count ++};
			if(table[x][y+1].getIsBomb()) {count ++};
			if(table[x+1][y+1].getIsBomb()) {count ++};	
		}
		else if (y == 15) { // bottom row except corners
			if(table[x-1][y].getIsBomb()) {count ++};
			if(table[x-1][y-1].getIsBomb()) {count ++};
			if(table[x][y-1].getIsBomb()) {count ++};
			if(table[x+1][y-1].getIsBomb()) {count ++};
			if(table[x+1][y].getIsBomb()) {count ++};	
		}
		else { // rest of the boxes
			if(table[x-1][y-1].getIsBomb()) {count ++};
			if(table[x][y-1].getIsBomb()) {count ++};
			if(table[x+1][y-1].getIsBomb()) {count ++};
			if(table[x-1][y].getIsBomb()) {count ++};
			if(table[x+1][y].getIsBomb()) {count ++};	
			if(table[x-1][y+1].getIsBomb()) {count ++};
			if(table[x][y+1].getIsBomb()) {count ++};
			if(table[x+1][y+1].getIsBomb()) {count ++};
		}
	}

	return count;
}

// class that represents the different values for each box(cell) in the table
class cell {
	
	constructor(x, y,isBomb) {
		this.x = x;
		this.y = y;
		this.adjacent = 0;
		this.isBomb = isBomb;
		this.isShown = false;
		this.flagged = false;

		this.bombCount = 0;
	}
	

	// -------------------- Setter Methods --------------------------------
	setBombCount(bCount) {
		this.bombCount = bCount;
	}

	setIsShown() {
		this.isShown = true;
	}

	setFlagged() {
		this.flagged = true;
	}

	setUnFlagged() {
		this.flagged = false;
	}


	// -------------------- Getter Methods --------------------------------
	getColorS() {
		return this.colorSwitch;
	}

	getIsBomb() {
		return this.isBomb;
	}

	getX() {
		return this.x;
	}
	getY() {
		return this.y;
	}

	getBombCount() {
		return this.bombCount;
	}

	getIsShown() {
		return this.isShown;
	}

	getFlagged() {
		return this.flagged;
	}
}

