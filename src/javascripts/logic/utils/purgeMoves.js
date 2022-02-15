import { Game } from '../game';

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

            testGame.testMove([origin, dest]);
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