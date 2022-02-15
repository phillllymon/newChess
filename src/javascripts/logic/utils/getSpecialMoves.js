// !!!!!!!!!!!!!!!!!!!!TODO
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
                if (!(game.grid.at(space) === '-') || game.targetsDirectory.has(space)) {
                    moveIsLegal = false;
                }
            });
            if (moveIsLegal) {
                specialMoves.push(castle[3]);
            }
        });
    }
    //get en passant moves

    //get pawn promotion moves

    return specialMoves;
}