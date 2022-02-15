export const checkForCheck = (grid, turn, targets) => {
    let answer = false;
    const kingSymbol = turn === 'black' ? 'K' : 'k';
    targets.forEach((target) => {
        if (grid[target[1][0]][target[1][1]] === kingSymbol) {
            answer = true;
        }
    });
    return answer;
}