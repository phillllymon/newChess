import { BLACK_PIECES, WHITE_PIECES } from '../chessHelper';


export const getSpecialMoves = (game) => {
    const specialMoves = [];
    //get castle moves
    if (!game.check) {
        [
            [game.blackCanCastleKingSide, [], [[0, 5], [0, 6]], [[0, 4], [0, 6], 'castle']],  // [variable, [spaces that must be blank], [spaces that must be blank and not targets], castleMove]
            [game.blackCanCastleQueenSide, [[0, 1]], [[0, 2], [0, 3]], [[0, 4], [0, 2], 'castle']],
            [game.whiteCanCastleKingSide, [], [[7, 5], [7, 6]], [[7, 4], [7, 6], 'castle']],
            [game.whiteCanCastleQueenSide, [[7, 1]], [[7, 2], [7, 3]], [[7, 4], [7, 2], 'castle']]

        ].forEach((castle) => {
            
            let moveIsLegal = true; // set to false if fails any check
            if (!castle[0]) {
                moveIsLegal = false;
            }
            castle[1].forEach((space) => {
                if (!(game.grid.at(space) === '-')) {
                    moveIsLegal = false;
                }
            })
            castle[2].forEach((space) => {
                if (!(game.grid.at(space) === '-') || game.targetsDirectory[JSON.stringify(space)]) {
                    moveIsLegal = false;
                }
            });
            if (moveIsLegal) {
                specialMoves.push(castle[3]);
            }
        });
    }
    //get en passant moves
    let friendPawn = 'P';
    let enemyRowStart = 6;
    let enemyRowEnd = 4;
    if (game.turn === 'white') {
        friendPawn = 'p';
        enemyRowStart = 1;
        enemyRowEnd = 3;
    }
    const enemyPawn = friendPawn === 'P' ? 'p' : 'P';
    if (game.previousMove) { // if there was a previous move
        const previousOrigin = game.previousMove[0];
        const previousDest = game.previousMove[1];
        if (previousOrigin[0] === enemyRowStart && previousDest[0] === enemyRowEnd) { // if it was from the right row to the right row
            if (game.grid.at(previousDest) === enemyPawn) { // if it as an enemy pawn that moved
                [-1, 1].forEach((dir) => {  // check each possible position of a pawn that could perform the en passant
                    const friendPos = [enemyRowEnd, previousDest[1] + dir];
                    if (game.grid.at(friendPos) === friendPawn) {
                        specialMoves.push([friendPos, [game.turn === 'white' ? 2 : 5, previousDest[1]], 'enPassant']);
                    }
                });
            }
        }
    }
    //get pawn promotion moves
    const promotions = {
        'white': ['q', 'b', 'r', 'n'],
        'black': ['Q', 'B', 'R', 'N']
    };

    let dir = 1;
    let startRow = 6;
    friendPawn = 'P';
    let enemies = WHITE_PIECES;
    if (game.turn === 'white') {
        dir = -1;
        startRow = 1;
        friendPawn = 'p';
        enemies = BLACK_PIECES;
    }
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((col) => {
        if (game.grid.at([startRow, col]) === friendPawn) {
            //check ahead
            if (game.grid.at([startRow + dir, col]) === '-') {
                promotions[game.turn].forEach((promotion) => {
                    specialMoves.push([[startRow, col], [startRow + dir, col], 'promotion', promotion]);
                });
            }

            //check diagonals
            [-1, 1].forEach((colDir) => {
                const destination = [startRow + dir, col + colDir];
                if (enemies.includes(game.grid.at(destination))) {
                    promotions[game.turn].forEach((promotion) => {
                        specialMoves.push([[startRow, col], destination, 'promotion', promotion]);
                    });
                }
            });
        }
    });

    return specialMoves;
}