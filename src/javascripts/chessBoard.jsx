import React from 'react';
import { useState } from 'react';
import { Square } from './square';
import { Game } from './logic/game';
import { AiPlayer } from './ai/aiPlayer'

// magic board:
// -You can click on squares to highlight them.
// -If you click on another square it will check to see if moving from the previous highlighted square to there is a legal move. If it is, it will make the move.
// -Click the highlighted square to unhighlight it.
export function ChessBoard() {
    
    const [highlightedSquare, setHighlightedSquare] = useState([-1, -1]);
    const [orangeSquare, setOrangeSquare] = useState([-1, -1]);
    const [game] = useState(new Game(false));
    const [gameState, setGameState] = useState(game.grid.boardArray);
    

    // AI Player experiment

    const [opponent] = useState(new AiPlayer(game, setGameState, setOrangeSquare)); // setHighlightedSquare for display purposes only

    // end experiment

    const attemptMove = (fromPos, toPos) => {
        //check if there is a highlighted square at all
        if (fromPos[0] > -1) {
            if (game.isMoveLegal(fromPos, toPos)){
                makeMove(fromPos, toPos);
            }
        }
    }

    const makeMove = (fromPos, toPos) => {
        game.makeMove(game.movesDirectory[JSON.stringify([fromPos, toPos])]); //inform game model that move has been made
        setGameState(game.grid.boardArray);
        opponent.updateGame(game);
    }

    const toggleSquare = (rowIdx, colIdx) => {
        if (highlightedSquare[0] === rowIdx && highlightedSquare[1] === colIdx) {
            setHighlightedSquare([-1, -1]);
        } else {
            attemptMove(highlightedSquare, [rowIdx, colIdx]);
            setHighlightedSquare([rowIdx, colIdx]); 
        }
    }

    if (game.checkMate) {
        alert('Checkmate!');
    }
    
    return (
        <>
            <div
                className="chessboard"
                style={{
                    'height': '640px',
                    'width': '640px'
                }} 
            >
                {
                    gameState.map((row, rowIdx) => {
                        return row.map((symbol, colIdx) => {
                            return (
                                <Square 
                                    key={getUniqueKey(rowIdx, colIdx)}
                                    color={getSquareColor(rowIdx, colIdx)}
                                    symbol={symbol}
                                    highlighted={rowIdx === highlightedSquare[0] && colIdx === highlightedSquare[1]}
                                    orange={rowIdx === orangeSquare[0] && colIdx === orangeSquare[1]}
                                    // targeted={game.allEnemyTargets.map((target) => {
                                    //     return JSON.stringify(target[1])
                                    // }).includes(JSON.stringify([rowIdx, colIdx]))}
                                    toggleSquare={() => toggleSquare(rowIdx, colIdx)}
                                />
                            )
                        })
                    })
                }
            </div>
        </>
    );
}

function getSquareColor(rowIdx, colIdx) {
    return rowIdx%2 === 0 ? (
        colIdx%2 === 0 ? 'white' : 'black'
    ) : (
        colIdx%2 === 0 ? 'black' : 'white'
    );
}

function getUniqueKey(rowIdx, colIdx) {
    return parseInt(rowIdx.toString() + colIdx.toString());
}