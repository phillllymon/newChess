import { BLACK_PIECES, WHITE_PIECES } from './chessHelper';
import { purgeMoves } from './utils/purgeMoves';
import { checkForCheck } from './utils/checkForCheck';
import { getSpecialMoves } from './utils/getSpecialMoves';
import { getDumbMoves } from './utils/getDumbMoves';
import { getTargets } from './utils/getTargets';

const POINTS = {
    'R': 5,
    'N': 3,
    'B': 3,
    'Q': 9,
    'P': 1,
    'K': 0,
    'r': 5,
    'n': 3,
    'b': 3,
    'q': 9,
    'p': 1,
    'k': 0,
};

//for brand new game (Game can also be instantiated for an in-progress game by defining gameConfig)
const DEFAULT_GAME_CONFIG = {
    grid: [
        ['R','N','B','Q','K','B','N','R'],
        ['P','P','P','P','P','P','P','P'],
        ['-','-','-','-','-','-','-','-'],
        ['-','-','-','-','-','-','-','-'],
        ['-','-','-','-','-','-','-','-'],
        ['-','-','-','-','-','-','-','-'],
        ['p','p','p','p','p','p','p','p'],
        ['r','n','b','q','k','b','n','r']
        // ['-','-','-','-','Q','-','-','-'],
        // ['-','-','-','-','-','-','-','-'],
        // ['-','-','-','-','-','-','-','-'],
        // ['-','-','-','-','-','-','-','-'],
        // ['-','-','-','-','-','-','-','-'],
        // ['-','-','-','-','-','-','-','-'],
        // ['-','-','-','-','-','-','-','-'],
        // ['-','-','-','-','k','-','-','-']
    ],
    turn: 'white',
    whiteCanCastleKingSide : true,
    whiteCanCastleQueenSide : true,
    blackCanCastleKingSide : true,
    blackCanCastleQueenSide : true,
    previousMove : null
}

export class Game {
    constructor(testGame, gameConfig = {
        grid: [
            ['R','N','B','Q','K','B','N','R'],
            ['P','P','P','P','P','P','P','P'],
            ['-','-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-','-'],
            ['-','-','-','-','-','-','-','-'],
            ['p','p','p','p','p','p','p','p'],
            ['r','n','b','q','k','b','n','r']
            // ['-','-','-','R','K','-','-','-'],
            // ['-','-','-','-','-','-','-','-'],
            // ['-','-','-','-','-','-','-','-'],
            // ['-','-','-','-','-','-','-','-'],
            // ['-','-','-','-','-','-','-','-'],
            // ['-','-','-','-','-','-','-','-'],
            // ['-','-','-','-','-','-','-','-'],
            // ['-','-','-','r','k','-','-','-']
        ],
        turn: 'white',
        whiteCanCastleKingSide : true,
        whiteCanCastleQueenSide : true,
        blackCanCastleKingSide : true,
        blackCanCastleQueenSide : true,
        previousMove : null
    }) {
        this.grid = new ChessGrid(gameConfig.grid);

        // --game variables--
        this.turn = gameConfig.turn;
        this.whiteCanCastleKingSide = gameConfig.whiteCanCastleKingSide; // more specifically: hasn't yet moved king or rook
        this.whiteCanCastleQueenSide = gameConfig.whiteCanCastleQueenSide;
        this.blackCanCastleKingSide = gameConfig.blackCanCastleKingSide;
        this.blackCanCastleQueenSide = gameConfig.blackCanCastleQueenSide;
        this.previousMove = gameConfig.previousMove; // for determining enPassant

        // --util data--
        this.allEnemyTargets = []; // spots in other player's pieces' sights; we can't move our king into these spots & it will help with checking for check (form of [[enemyRow, enemyCol], [targetRow, targetCol], ])
        this.allDumbMoves = []; // all moves player could make without checking if they put you in check
        this.allMoves = []; // all moves for current player in form of [[fromRow, fromCol], [toRow, toCol]]
        this.check = false; // if the person whose turn it is happens to be in check currently
        this.checkMate = false;
        this.staleMate = false;
        this.whitePoints = 0; // total of points for all remaining white pieces
        this.blackPoints = 0;
        this.targetsDirectory = {};
        this.movesDirectory = {}; // allMoves with moves JSON.stringified (used for checking if a given move is in the list)

        // **run this function before asking for legal moves
        this.populateBasicData = () => {
            const ourPieces = this.turn === 'black' ? BLACK_PIECES : WHITE_PIECES;
            const dumbMoves = [];
            const enemyTargets = [];
            this.grid.boardArray.forEach((row, rowIdx) => {
                row.forEach((symbol, colIdx) => {
                    //see what kind of piece it is
                    if (symbol !== '-') {
                        this.addPoints(symbol);
                        if (ourPieces.includes(symbol)) {
                            dumbMoves.push(...getDumbMoves(symbol, this.grid.boardArray, rowIdx, colIdx));
                        } else {
                            enemyTargets.push(...getTargets(symbol, this.grid.boardArray, rowIdx, colIdx));
                        }
                    }
                });
            });
            dumbMoves.push(...getSpecialMoves(this));
            // set allEnemyTargets and targetsDirectory
            this.allEnemyTargets = enemyTargets;
            enemyTargets.forEach((target) => {
                this.targetsDirectory[JSON.stringify(target[1])] = target; // form of { stringified danger space: [origin, dangerSpace] }
            });
            // set allDumbMoves
            this.allDumbMoves = dumbMoves;
            // see if we're in check
            this.check = checkForCheck(this.grid.boardArray, this.turn, this.allEnemyTargets);
        };

        this.populateHeavyData = () => {
            this.allMoves = purgeMoves(this.allDumbMoves, this.allEnemyTargets, this.grid.boardArray, this.turn, this.check, this);
            // use allMoves to get movesDirectory
            this.allMoves.forEach((move) => {
                this.movesDirectory[JSON.stringify([move[0], move[1]])] = move;
            });
            this.checkMate = this.check && this.allMoves.length === 0;
            this.staleMate = !this.check && this.allMoves.length === 0;
            
            if (this.grid.at([0, 4]) !== 'K') {
                this.blackCanCastleKingSide = false;
                this.blackCanCastleQueenSide = false;
            }
            if (this.grid.at([0, 7]) !== 'R') {
                this.blackCanCastleKingSide = false;
            }
            if (this.grid.at([0, 0]) !== 'R') {
                this.blackCanCastleQueenSide = false;
            }
            if (this.grid.at([7, 4]) !== 'k') {
                this.whiteCanCastleKingSide = false;
                this.whiteCanCastleQueenSide = false;
            }
            if (this.grid.at([7, 7]) !== 'r') {
                this.whiteCanCastleKingSide = false;
            }
            if (this.grid.at([7, 0]) !== 'r') {
                this.whiteCanCastleQueenSide = false;
            }
        };

        this.resetData = () => {
            this.allEnemyTargets = [];
            this.allDumbMoves = [];
            this.allMoves = [];
            this.check = false;
            this.checkMate = false;
            this.whitePoints = 0; // total of points for all remaining white pieces
            this.blackPoints = 0;
            this.movesDirectory = {};
            this.targetsDirectory = {};
        }

        this.addPoints = (symbol) => {
            if (BLACK_PIECES.includes(symbol)) {
                this.blackPoints += POINTS[symbol];
            } else {
                this.whitePoints += POINTS[symbol];
            }
        }

        this.isMoveLegal = (fromPos, toPos) => {
            const desiredMove = JSON.stringify([fromPos, toPos]);
            if (this.movesDirectory[desiredMove]) {
                return true;
            }
            console.log('********************');
            console.log('illegal move');
            console.log('********************');
            return false;
        }

        this.makeMove = (move) => {
            if (move[2]) {
                this.grid.makeSpecialMove(move);
            } else {
                this.grid.makeMove(move[0], move[1]);
            }
            this.turn = this.turn === 'white' ? 'black' : 'white';
            this.resetData();
            this.previousMove = move;
            this.populateBasicData();
            this.populateHeavyData();
        }

        // used only when the game object has been created to test legality of a single move
        this.testMove = (move) => {
            if (move[2]) {
                this.grid.makeSpecialMove(move);
            } else {
                this.grid.makeMove(move[0], move[1]);
            }
            // want to keep same turn (see if the move you just "made" results in YOU being in check)
            // this.turn = this.turn === 'white' ? 'black' : 'white';
            this.resetData();
            this.previousMove = move;
            this.populateBasicData();
        }

        //starting sequence
        if (!testGame) {
            this.populateBasicData();
            this.populateHeavyData();
        }
    }
}

//fancy array that can take array to index into it
class ChessGrid {
    constructor(gridArray) {
        this.boardArray = gridArray;

        this.at = (posArr) => {
            return this.boardArray[posArr[0]][posArr[1]];
        };

        this.makeMove = (fromPos, toPos) => {
            this.boardArray[toPos[0]][toPos[1]] = this.boardArray[fromPos[0]][fromPos[1]];
            this.boardArray[fromPos[0]][fromPos[1]] = '-';
        };

        this.makeSpecialMove = (move) => {
            if (move[2] === 'castle') {
                this.makeMove(move[0], move[1]);
                const row = move[0][0];
                const startCol = move[1][1] - move[0][1] > 0 ? 7 : 0;
                const endCol = startCol === 0 ? 3 : 5;
                this.makeMove(
                    [row, startCol],
                    [row, endCol]
                );
            }
            if (move[2] === 'enPassant') {
                this.makeMove(move[0], move[1]);
                this.boardArray[move[0][0]][move[1][1]] = '-';
            }
            if (move[2] === 'promotion') {
                this.boardArray[move[0][0]][move[0][1]] = '-';
                this.boardArray[move[1][0]][move[1][1]] = move[3];
            }
        };
    }
}