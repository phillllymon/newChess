import React from 'react';
import { Piece } from './piece';

export function Square(props) {
    
    const className = props.color === 'white' ? 'white_square' : 'black_square';
    
    return (
        <div className={`square ${props.highlighted ? 'highlighted' : className}`} onClick={props.toggleSquare} style={props.targeted ? {
            'backgroundColor': 'red'
        } : {}}>
            <Piece symbol={props.symbol} />
        </div>
    );
}