import { selectMove } from './ai';

// make a new player for every game
export class AiPlayer {
    constructor(game, setGameState, setOrangeSquare, color = 'black') {
        this.game = game;
        this.setGameState = setGameState; // call this with game.grid.boardArray after making a move
        this.color = color;

        // call this from outside to tell AI that game has been updated and request a move
        this.updateGame = (game) => {
            if (game.turn === this.color) {
                this.makeMove();
            }
        }

        this.makeMove = () => {
            const moveToMake = selectMove(this.game);
            game.makeMove(moveToMake);
            setOrangeSquare(moveToMake[1]);
        }
    }
}