import { BLACK_PIECES, WHITE_PIECES } from '../chessHelper';

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