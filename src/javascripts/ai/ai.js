export const selectMove = (game) => {
    const allMoves = game.allMoves;
    if (allMoves.length < 1) {
        return null;
    }
    return allMoves[Math.floor(Math.random()*allMoves.length)];
}