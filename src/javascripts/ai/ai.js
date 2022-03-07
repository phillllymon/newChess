import { Game } from '../logic/game';

export const selectMove = (game) => {

    const testGame = new Game(false, {
        grid: deepCopyArray(game.grid.boardArray),
        turn: game.turn,
        whiteCanCastleKingSide: game.whiteCanCastleKingSide,
        whiteCanCastleQueenSide: game.whiteCanCastleQueenSide,
        blackCanCastleKingSide: game.blackCanCastleKingSide,
        blackCanCastleQueenSide: game.blackCanCastleQueenSide,
        previousMove: deepCopyArray(game.previousMove)
    })

    const root = new TreeNode(testGame, 4);
    return root.bestMove;
}

class TreeNode {
    constructor (game, altitude, move = null) {

        this.game = game;
        this.altitude = altitude;
        this.move = move;
        if (this.move) {
            this.game.makeMove(move);
        } else {
            this.game.populateBasicData();
            this.game.populateHeavyData();
        }

        this.score = this.game.whitePoints - this.game.blackPoints;
        // this.score = this.game.blackPoints - this.game.whitePoints;

        if (this.game.staleMate) {
            this.score = 0;
        }
        if (this.game.checkMate) {
            this.score = this.game.turn === 'white' ? -1000 : 1000;
        }

        this.children = [];

        if (!this.game.checkMate && !this.game.staleMate && this.altitude > 1) {
            this.game.allMoves.forEach((newMove, i) => {

                // temporary
                if (altitude === 4) {
                    const thisMove = i + 1;
                    // console.log('Analyzing move ' + thisMove + ' of ' + this.game.allMoves.length);
                }
                // end temp

                this.children.push(new TreeNode(new Game(false, {
                    grid: deepCopyArray(this.game.grid.boardArray),
                    turn: this.game.turn,
                    whiteCanCastleKingSide: this.game.whiteCanCastleKingSide,
                    whiteCanCastleQueenSide: this.game.whiteCanCastleQueenSide,
                    blackCanCastleKingSide: this.game.blackCanCastleKingSide,
                    blackCanCastleQueenSide: this.game.blackCanCastleQueenSide,
                    previousMove: deepCopyArray(this.game.previousMove)
                }), this.altitude - 1, deepCopyArray(newMove)));
            });
        }

        this.result = this.score;

        if (this.children.length === 0) {   //either altitude is 1 or game is over
            this.bestMove = this.game.allMoves[Math.floor(Math.random()*this.game.allMoves.length)];
        } else {
            const possibleResults = this.children.map((child) => {
                return child.result;
            });
            const bestResult = this.game.turn === 'white' ? Math.max(...possibleResults) : Math.min(...possibleResults);
            this.result = bestResult;
            const bestMoves = [];
            this.children.forEach((child) => {
                if (child.result === bestResult) {
                    bestMoves.push(child.move);
                }
            });
            this.bestMove = bestMoves[Math.floor(Math.random()*bestMoves.length)];
        }
    }


}

const deepCopyArray = (arr) => {
    if (!arr) {
        return null;
    }
    const answer = [];
    arr.forEach((ele) => {
        if (Array.isArray(ele)) {
            answer.push(deepCopyArray(ele));
        } else {
            answer.push(ele);
        }
    });
    return answer;
};