import { Game } from './game';

export const BLACK_PIECES = ['R','N','B','Q','K','P'];
export const WHITE_PIECES = ['r','n','b','q','k','p'];

//returns new array made from dumbMoves with illegal(check-causing) moves removed
export const purgeMoves = (dumbMoves, enemyTargets, grid, turn, inCheck, game) => {
    const moves = [];
    const kingSymbol = turn === 'black' ? 'K' : 'k';
    const targetDirectory = {}; // we'll populate this for searching in form of {stringifiedTargetSpace: enemyTarget} (and enemyTarget itself is in form [[originRow, originCol], [targetRow, targetCol]])
    enemyTargets.forEach((target) => {
        targetDirectory[JSON.stringify(target[1])] = target;
    });
    dumbMoves.forEach((move) => {
        let moveIsOk = true; // set this to false if we find a way that this move is check

        const origin = move[0];
        const dest = move[1];

        //check if we're moving a piece out of a target, potentially exposing our king
        const relevantTarget = targetDirectory[JSON.stringify(origin)];
        
        const shortRangePieces = ['p', 'P', 'k', 'K']; // no need to follow the path of these pieces
        if (relevantTarget && !shortRangePieces.includes(grid[relevantTarget[1][0]][relevantTarget[1][1]])) {
            const vectorToCheck = [relevantTarget[0][0] - origin[0], relevantTarget[0][1] - origin[1]];
            const dirY = vectorToCheck[0] === 0 ? 0 : (vectorToCheck[0] > 0 ? 1 : -1);
            const dirX = vectorToCheck[1] === 0 ? 0 : (vectorToCheck[1] > 0 ? 1 : -1);
            const dir = [dirY, dirX];
            //go looking in that direction
            let row = origin[0];
            let col = origin[1];
            while (true) {
                row += dir[0];
                col += dir[1];
                if (row > 7 || row < 0 || col > 7 || row < 0) {
                    break;
                }
                if (row === dest[0] && col === dest[1]) {
                    break;
                }
                const local = grid[row][col];
                if (local === kingSymbol) {
                    moveIsOk = false;
                    break;
                }
                if (local !== '-') {
                    break;
                }

            }
        }

        //see if we're moving our king
        if (grid[origin[0]][origin[1]] === kingSymbol) {
            if (targetDirectory[JSON.stringify([dest[0], dest[1]])]) { //moving king into check
                moveIsOk = false;
            }
        }

        //different story if we're already in check - create test game, make move, and populate basic data to see if we're still in check
        if (inCheck) {
            const testGame = new Game(true, {
                grid: JSON.parse(JSON.stringify(game.grid.boardArray)),
                turn: game.turn,
                whiteCanCastleKingSide: game.whiteCanCasteKingSide,
                whiteCanCastleQueenSide: game.whiteCanCastleQueenSide,
                blackCanCastleKingSide: game.blackCanCastleKingSide,
                blackCanCastleQueenSide: game.blackCanCastleQueenSide,
                enPassantMoves : game.enPassantMoves
            });

            testGame.testMove(origin, dest);
            if (testGame.check) {
                moveIsOk = false;
            }
        }

        if (moveIsOk) {
            moves.push(move);
        }
    });

    return moves;
}

export const checkForCheck = (grid, turn, targets) => {
    let answer = false;
    const kingSymbol = turn === 'black' ? 'K' : 'k';
    console.log(targets);
    targets.forEach((target) => {
        console.log(grid[target[1][0]][target[1][1]]);
        if (grid[target[1][0]][target[1][1]] === kingSymbol) {
            answer = true;
        }
    });
    return answer;
}

// !!!!!!!!!!!!!!!!!!!!TODO
export const getSpecialMoves = (game) => {
    return [];
}

// !!!!!!!!!!!!!!!!!!!!TODO
export const getSpecialTargets = (game) => {
    return [];
}

export const getDumbMoves = (symbol, grid, rowIdx, colIdx) => {
    if (symbol === 'r' || symbol === 'R') {
        return getDumbRookMoves(symbol, grid, rowIdx, colIdx);
    }
    if (symbol === 'n' || symbol === 'N') {
        return getDumbKnightMoves(symbol, grid, rowIdx, colIdx);
    }
    if (symbol === 'b' || symbol === 'B') {
        return getDumbBishopMoves(symbol, grid, rowIdx, colIdx);
    }
    if (symbol === 'q' || symbol === 'Q') {
        return getDumbQueenMoves(symbol, grid, rowIdx, colIdx);
    }
    if (symbol === 'k' || symbol === 'K') {
        return getDumbKingMoves(symbol, grid, rowIdx, colIdx);
    }
    if (symbol === 'p' || symbol === 'P') {
        return getDumbPawnMoves(symbol, grid, rowIdx, colIdx);
    }
}

export const getTargets = (symbol, grid, rowIdx, colIdx) => {
    if (symbol === 'p' || symbol === 'P') {
        return getPawnTargets(symbol, grid, rowIdx, colIdx);
    }
    return getDumbMoves(symbol, grid, rowIdx, colIdx);
}

const getPawnTargets = (symbol, grid, rowIdx, colIdx) => {
    const color = BLACK_PIECES.includes(symbol) ? 'black' : 'white';
    const dir = color === 'black' ? 1 : -1;
    const moves = [];
    [1, -1].forEach((colDir) => {
        const row = rowIdx + dir;
        const col = colIdx + colDir;
        if (row > -1 && row < 8 && col > -1 && col < 8) {
            moves.push([[rowIdx, colIdx], [row, col]]);
        }
    });
    return moves;
}

const getDumbRookMoves = (symbol, grid, rowIdx, colIdx) => {
    const friends = BLACK_PIECES.includes(symbol) ? BLACK_PIECES : WHITE_PIECES;
    const moves = [];
    [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach((dir) => {
        let row = rowIdx;
        let col = colIdx;
        while(true) {
            row += dir[0];
            col += dir[1];
            if (row < 0 || row > 7 || col < 0 || col > 7) {
                break; // off the board
            }
            const local = grid[row][col]; // current inhabitant of square we're exploring
            if (local === '-'){
                moves.push([[rowIdx, colIdx], [row, col]])
            } else { // encountered a piece
                if (!friends.includes(local)) {
                    moves.push([[rowIdx, colIdx], [row, col]]);
                }
                break;
            }
        }
    });
    return moves;
}

const getDumbBishopMoves = (symbol, grid, rowIdx, colIdx) => {
    const friends = BLACK_PIECES.includes(symbol) ? BLACK_PIECES : WHITE_PIECES;
    const moves = [];
    [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach((dir) => {
        let row = rowIdx;
        let col = colIdx;
        while(true) {
            row += dir[0];
            col += dir[1];
            if (row < 0 || row > 7 || col < 0 || col > 7) {
                break; // off the board
            }
            const local = grid[row][col]; // current inhabitant of square we're exploring
            if (local === '-'){
                moves.push([[rowIdx, colIdx], [row, col]])
            } else { // encountered a piece
                if (!friends.includes(local)) {
                    moves.push([[rowIdx, colIdx], [row, col]]);
                }
                break;
            }
        }
    });
    return moves;
}

const getDumbQueenMoves = (symbol, grid, rowIdx, colIdx) => {
    const friends = BLACK_PIECES.includes(symbol) ? BLACK_PIECES : WHITE_PIECES;
    const moves = [];
    [[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]].forEach((dir) => {
        let row = rowIdx;
        let col = colIdx;
        while(true) {
            row += dir[0];
            col += dir[1];
            if (row < 0 || row > 7 || col < 0 || col > 7) {
                break; // off the board
            }
            const local = grid[row][col]; // current inhabitant of square we're exploring
            if (local === '-'){
                moves.push([[rowIdx, colIdx], [row, col]])
            } else { // encountered a piece
                if (!friends.includes(local)) {
                    moves.push([[rowIdx, colIdx], [row, col]]);
                }
                break;
            }
        }
    });
    return moves;
}

const getDumbKingMoves = (symbol, grid, rowIdx, colIdx) => {
    const friends = BLACK_PIECES.includes(symbol) ? BLACK_PIECES : WHITE_PIECES;
    const moves = [];
    [[1, 1], [-1, 1], [-1, -1], [1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]].forEach((step) => {
        const row = rowIdx + step[0];
        const col = colIdx + step[1];
        if (row > -1 && row < 8 && col > -1 && col < 8) {
            const local = grid[row][col]; // current inhabitant of square we're exploring
            if (!friends.includes(local)) {
                moves.push([[rowIdx, colIdx], [row, col]]);
            }
        }
    });
    return moves;
}

const getDumbKnightMoves = (symbol, grid, rowIdx, colIdx) => {
    const friends = BLACK_PIECES.includes(symbol) ? BLACK_PIECES : WHITE_PIECES;
    const moves = [];
    [[2, 1], [2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2], [-2, 1], [-2, -1]].forEach((step) => {
        const row = rowIdx + step[0];
        const col = colIdx + step[1];
        if (row > -1 && row < 8 && col > -1 && col < 8) {
            const local = grid[row][col]; // current inhabitant of square we're exploring
            if (!friends.includes(local)) {
                moves.push([[rowIdx, colIdx], [row, col]]);
            }
        }
    });
    return moves;
}

const getDumbPawnMoves = (symbol, grid, rowIdx, colIdx) => {
    const color = BLACK_PIECES.includes(symbol) ? 'black' : 'white';
    const dir = color === 'black' ? 1 : -1;
    const startRow = color === 'black' ? 1 : 6;
    const enemies = color === 'black' ? WHITE_PIECES : BLACK_PIECES;
    const moves = [];
    //check ahead
    if (rowIdx < 7 && rowIdx > 0 && grid[rowIdx + dir][colIdx] === '-') {
        moves.push([[rowIdx, colIdx], [rowIdx + dir, colIdx]]);
        //check two ahead
        if (rowIdx === startRow && grid[rowIdx + (2*dir)][colIdx] === '-') {
            moves.push([[rowIdx, colIdx], [rowIdx + (2*dir), colIdx]]);
        }
    }
    //check diagonals
    [1, -1].forEach((colDir) => {
        const row = rowIdx + dir;
        const col = colIdx + colDir;
        if (row > -1 && row < 8 && col > -1 && col < 8) {
            if (enemies.includes(grid[row][col])) {
                moves.push([[rowIdx, colIdx], [row, col]]);
            }
        }
    });
    return moves;
}