import { getDumbMoves } from './getDumbMoves';
import { BLACK_PIECES, WHITE_PIECES } from '../chessHelper';

export const getTargets = (symbol, grid, rowIdx, colIdx) => {
    if (symbol === 'p' || symbol === 'P') {
        return getPawnTargets(symbol, rowIdx, colIdx);
    }
    return getDumbMoves(symbol, grid, rowIdx, colIdx);
}

const getPawnTargets = (symbol, rowIdx, colIdx) => {
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
