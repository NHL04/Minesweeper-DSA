
let ArrayOfBoards = [];
let minesCount = 5;
let minesLocation = []; // "2-2", "3-4", "2-1"

let flagEnabled = false;

let gameOver = false;
let gameWin = false;

window.onload = function () { //similar to Main()
    let rows = 8;
    let columns = 8;
    startGame(rows, columns);
}

function startGame(rowNum, colNum) {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    document.getElementById("undo-button").addEventListener("click", undoBoard);
    document.getElementById("easy-button").addEventListener("click", startEasy);
    document.getElementById("medium-button").addEventListener("click", startMedium);
    document.getElementById("hard-button").addEventListener("click", startHard);
    let board = [];
    for (let r = 0; r < rowNum; r++) {
        let row = [];
        for (let c = 0; c < colNum; c++) {
            //         coord x     -       coord y       -    clicked  - mine  -  flagged  - content
            let tile = r.toString() + "-" + c.toString() + "-" + 0 + "-" + 0 + "-" + 0 + "-" + 11;
            row.push(tile);        //<div id ="2-2-1-0-0-5"></div> 
        }                          //x:2-y:2-clicked:true-mine:false-flagged:false-Render:num5
        board.push(row);
    }
    ArrayOfBoards.push(board);
    setMines(rowNum, colNum);
    drawBoard();

}

function startEasy() {
    ArrayOfBoards = [];
    minesLocation = [];
    allChangingTile = [];
    minesCount = 5;
    gameOver = false;
    gameWin = false;
    document.getElementById('board').style.width = '397px';
    document.getElementById('board').style.height = '400px';
    startGame(8, 8);
}

function startMedium() {
    ArrayOfBoards = [];
    minesLocation = [];
    allChangingTile = [];
    minesCount = 10;
    gameOver = false;
    gameWin = false;
    document.getElementById('board').style.width = '496px';
    document.getElementById('board').style.height = '500px';
    startGame(10, 10);
}

function startHard() {
    ArrayOfBoards = [];
    minesLocation = [];
    allChangingTile = [];
    minesCount = 20;
    gameOver = false;
    gameWin = false;
    document.getElementById('board').style.width = '596px';
    document.getElementById('board').style.height = '250px';
    startGame(5, 12);
}


function setMines(rowNum, colNum) {
    //hard code for testing only
    // minesLocation.push("2-2");
    // minesLocation.push("2-3");
    // minesLocation.push("5-6");
    // minesLocation.push("3-4");
    // minesLocation.push("1-1");

    // random the mines location -> using while loop to avoid generate the same mine id
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rowNum);
        let c = Math.floor(Math.random() * colNum);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }

    }
}

function drawBoard() {
    let currBoard = JSON.parse(JSON.stringify(ArrayOfBoards[ArrayOfBoards.length - 1]));

    //remove current tile in HTML
    const boardHTML = document.getElementById("board");
    while (boardHTML.hasChildNodes()) {
        boardHTML.removeChild(boardHTML.firstChild);
    }

    //draw all tiles 
    let board_RowNum = currBoard.length;
    let board_ColNum = currBoard[0].length;
    for (let r = 0; r < board_RowNum; r++) {
        for (let c = 0; c < board_ColNum; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", handle_clickedTile);
            let content = convert_tileInfo_format(currBoard[r][c])[5];

            switch (content) {
                case "0":
                    tile.innerText = "";
                    tile.style.backgroundColor = "darkgrey";
                    break;
                case "1":
                    tile.innerText = "1";
                    tile.style.color = "blue"
                    tile.style.backgroundColor = "darkgrey";
                    break;
                case "2":
                    tile.innerText = "2";
                    tile.style.color = "green"
                    tile.style.backgroundColor = "darkgrey";
                    break;
                case "3":
                    tile.innerText = "3";
                    tile.style.color = "red"
                    tile.style.backgroundColor = "darkgrey";
                    break;
                case "4":
                    tile.innerText = "4";
                    tile.style.color = "navy"
                    tile.style.backgroundColor = "darkgrey";
                    break;
                case "5":
                    tile.innerText = "5";
                    tile.style.color = "brown"
                    tile.style.backgroundColor = "darkgrey";
                    break;
                case "6":
                    tile.innerText = "6";
                    tile.style.color = "teal"
                    tile.style.backgroundColor = "darkgrey";
                    break;
                case "7":
                    tile.innerText = "7";
                    tile.style.color = "black"
                    tile.style.backgroundColor = "darkgrey";
                    break;
                case "8":
                    tile.innerText = "8";
                    tile.style.color = "grey"
                    tile.style.backgroundColor = "darkgrey";
                    break;
                case "9":
                    tile.innerText = "💣";
                    tile.style.backgroundColor = "red";
                    break;
                case "10":
                    tile.innerText = "🚩";
                    tile.style.backgroundColor = "lightgray";
                    break;
                case "11":
                    tile.innerText = "";
                    tile.style.backgroundColor = "lightgray";
                    break;

                default:
                    tile.innerText = "";
                    tile.style.backgroundColor = "black";
                    console.log("case 0 -> something wrong");
            }
            document.getElementById("board").append(tile);
        }
    }
    checkWin();
    console.log("All boards: ", ArrayOfBoards);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function handle_clickedTile() {
    let tile = this;
    let checkBoard = JSON.parse(JSON.stringify(ArrayOfBoards[ArrayOfBoards.length - 1]));
    let checkboard_RowNum = checkBoard.length;
    let checkboard_ColNum = checkBoard[0].length;

    if (gameWin == true || gameOver == true || this.style.backgroundColor == "darkgrey" || gameOver == true && this.style.backgroundColor == "lightgray") {
        return;
    }

    for (let r = 0; r < checkboard_RowNum; r++) {
        for (let c = 0; c < checkboard_ColNum; c++) {
            let checkTileCoord = convert_tileInfo_toCoord(checkBoard[r][c]);
            let checkTileInfo = convert_tileInfo_format(checkBoard[r][c]);

            if (tile.id == checkTileCoord && checkTileInfo[2] == "1") {
                return; //if this happen -> nothing below run for this tile - no checkMine, no recursion
            }

        }
    }

    //if flag button is enable
    if (flagEnabled) {
        let currBoard = JSON.parse(JSON.stringify(ArrayOfBoards[ArrayOfBoards.length - 1]));
        let board_RowNum = currBoard.length;
        let board_ColNum = currBoard[0].length;

        for (let r = 0; r < board_RowNum; r++) {
            for (let c = 0; c < board_ColNum; c++) {
                let tileInfo = convert_tileInfo_format(currBoard[r][c]);
                let tileCoords = convert_tileInfo_toCoord(currBoard[r][c]);

                if (tile.id == tileCoords) {
                    if (tileInfo[4] == "0" && tileInfo[5] != "10") {
                        tileInfo[4] = "1";    //flagged = true
                        tileInfo[5] = "10";   //10 -> indicate Flag image
                    }
                    else if (tileInfo[4] == "1" && tileInfo[5] == "10") {
                        tileInfo[4] = "0";    //flagged = true
                        tileInfo[5] = "11";   //0 -> indicate no image
                    }

                    let tileNewInfo = tileInfo[0] + "-" + tileInfo[1] + "-" + tileInfo[2] + "-" + tileInfo[3] + "-" + tileInfo[4] + "-" + tileInfo[5];
                    let index = currBoard[r].indexOf(currBoard[r][c]);
                    if (index !== -1) {
                        currBoard[r][index] = tileNewInfo;
                    }
                }

            }
        }
        ArrayOfBoards.push(currBoard);
        drawBoard();
        return;
    }

    //if clicked on mine  
    if (minesLocation.includes(tile.id)) {
        // console.log("Game over");

        revealMines();
        drawBoard();
        document.getElementById("noti").innerText = "You suck!";
        document.getElementById("noti").style.color = "red";
        return;
    }

    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
    create_FinalBoardForm_Of_Move();
    drawBoard();

}

function undoBoard() {

    if (gameOver == true) {
        gameOver = false;
    }
    if (gameWin == true) {
        gameWin = false;
    }

    if (ArrayOfBoards.length == 1) {
        return;
    }
    else {
        ArrayOfBoards.pop();
        drawBoard();
    }
}


function revealMines() {
    let currBoard = JSON.parse(JSON.stringify(ArrayOfBoards[ArrayOfBoards.length - 1]));
    let board_RowNum = currBoard.length;
    let board_ColNum = currBoard[0].length;

    for (let r = 0; r < board_RowNum; r++) {
        for (let c = 0; c < board_ColNum; c++) {
            let tileInfo = convert_tileInfo_format(currBoard[r][c]);
            let tileCoord = convert_tileInfo_toCoord(currBoard[r][c]);
            if (minesLocation.includes(tileCoord)) {
                tileInfo[2] = "1";
                tileInfo[3] = "1";
                tileInfo[5] = "9";
                let tileNewInfo = tileInfo[0] + "-" + tileInfo[1] + "-" + tileInfo[2] + "-" + tileInfo[3] + "-" + tileInfo[4] + "-" + tileInfo[5];
                let index = currBoard[r].indexOf(currBoard[r][c]);
                if (index !== -1) {
                    currBoard[r][index] = tileNewInfo;
                }
            }
        }
    }
    gameOver = true;
    ArrayOfBoards.push(currBoard);
}


function checkMine(r, c) {
    let currBoard = JSON.parse(JSON.stringify(ArrayOfBoards[ArrayOfBoards.length - 1]));
    let board_RowNum = currBoard.length;
    let board_ColNum = currBoard[0].length;
    // console.log("R: ", board_RowNum, "C: ", board_ColNum);

    if (r < 0 || r >= board_RowNum || c < 0 || c >= board_ColNum) {
        return; // out of bound -> no mine
    }

    let tileInfo = convert_tileInfo_format(currBoard[r][c]);
    tileInfo[2] = "1";
    tileInfo[5] = "0";
    let minesFound = 0;

    //top 3
    minesFound += checkTile(r - 1, c - 1);  //top left
    minesFound += checkTile(r - 1, c);      //top 
    minesFound += checkTile(r - 1, c + 1);  //top right

    //left and right
    minesFound += checkTile(r, c - 1);      //left
    minesFound += checkTile(r, c + 1);      //right

    //bottom 3
    minesFound += checkTile(r + 1, c - 1);  //bottom left
    minesFound += checkTile(r + 1, c);      //bottom 
    minesFound += checkTile(r + 1, c + 1);  //bottom right

    if (minesFound > 0) {   //normal case for a tile next to mine -> no recursion
        tileInfo[5] = minesFound.toString();
        let tileNewInfo = tileInfo[0] + "-" + tileInfo[1] + "-" + tileInfo[2] + "-" + tileInfo[3] + "-" + tileInfo[4] + "-" + tileInfo[5];

        if (!allChangingTile.includes(tileNewInfo)) {
            allChangingTile.push(tileNewInfo);
        }
        return;
    }

    if (minesFound == 0) {  //tile not next to mine -> recursion checking                         
        let tileInfo = convert_tileInfo_format(currBoard[r][c]);
        let tileCoord = convert_tileInfo_toCoord(currBoard[r][c]);
        for (let i = 0; i < allChangingTile.length; i++) {
            if (tileCoord == convert_tileInfo_toCoord(allChangingTile[i])) {
                // console.log("Check Changing tile: ", allChangingTile);
                return;         //if this tile already in temp array -> avoid dupplicate checking or bug
            }
        }

        let tileNewInfo = tileInfo[0] + "-" + tileInfo[1] + "-" + tileInfo[2] + "-" + tileInfo[3] + "-" + tileInfo[4] + "-" + 0;
        if (!allChangingTile.includes(tileNewInfo)) {
            allChangingTile.push(tileNewInfo);
        }

        //top 3
        checkMine(r - 1, c - 1);     //top left
        checkMine(r - 1, c);         //top 
        checkMine(r - 1, c + 1);     //top right

        //left and right
        checkMine(r, c - 1);         //left
        checkMine(r, c + 1);         //right

        //bottom 3
        checkMine(r + 1, c - 1);     //bottom left
        checkMine(r + 1, c);         //bottom 
        checkMine(r + 1, c + 1);     //bottom right
    }
}

function checkTile(r, c) {
    let currBoard = JSON.parse(JSON.stringify(ArrayOfBoards[ArrayOfBoards.length - 1]));
    let board_RowNum = currBoard.length;
    let board_ColNum = currBoard[0].length;
    // console.log("R: ", board_RowNum, "C: ", board_ColNum);

    if (r < 0 || r >= board_RowNum || c < 0 || c >= board_ColNum) {
        return 0; //no mine out of bound
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

let allChangingTile = [];

function create_FinalBoardForm_Of_Move() {
    let currBoard = JSON.parse(JSON.stringify(ArrayOfBoards[ArrayOfBoards.length - 1]));
    let board_RowNum = currBoard.length;
    let board_ColNum = currBoard[0].length;

    for (let r = 0; r < board_RowNum; r++) {
        for (let c = 0; c < board_ColNum; c++) {
            let tileCoord = convert_tileInfo_toCoord(currBoard[r][c]);
            for (let i = 0; i < allChangingTile.length; i++) {
                let changingtileCoord = convert_tileInfo_toCoord(allChangingTile[i])
                if (tileCoord == changingtileCoord) {
                    currBoard[r][c] = allChangingTile[i];
                }
            }
        }
    }
    ArrayOfBoards.push(currBoard);
    allChangingTile = []; //clear this temp array for next move
}

function checkWin() {
    let currBoard = JSON.parse(JSON.stringify(ArrayOfBoards[ArrayOfBoards.length - 1]));
    let board_RowNum = currBoard.length;
    let board_ColNum = currBoard[0].length;
    let clickedTilesCount = 0;

    for (let r = 0; r < board_RowNum; r++) {
        for (let c = 0; c < board_ColNum; c++) {
            if (document.getElementById(r.toString() + "-" + c.toString()).style.backgroundColor == "darkgrey") {
                clickedTilesCount += 1;
            }
        }
    }

    if (clickedTilesCount == board_RowNum * board_ColNum - minesCount) {
        gameOver = true;
        gameWin = true;
        document.getElementById("noti").innerText = "You win!";
        document.getElementById("noti").style.color = "green";
        // console.log("Win ", "gameWin: ", gameWin, "gameOver: ", gameOver);
    }
    else {
        gameWin = false;
        document.getElementById("noti").innerText = "";
        // console.log("Not win yet ", "gameWin: ", gameWin, "gameOver: ", gameOver);
    }
}

function convert_tileInfo_format(stringId) {
    // "2-2-1-0-0-5" -> return ["2", "2", "1", "0", "0", "5"]
    let result = stringId.split("-");
    return result;
}

function convert_tileInfo_toCoord(stringId) {
    // "2-2-1-0-0-5" -> ["2", "2", "1", "0", "0", "5"] -> return: "2-2"
    let tileIdArray = stringId.split("-");
    let x = parseInt(tileIdArray[0]);
    let y = parseInt(tileIdArray[1]);
    let tileCoord = x.toString() + "-" + y.toString();
    return tileCoord;
}