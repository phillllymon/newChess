import React from 'react';
import { Piece } from './piece';

export function Square(props) {
    
    let className = 'square';
    className = props.color === 'white' ? className + ' white_square' : className + ' black_square';
    if (props.highlighted) {
        className = className + ' highlighted';
    }
    if (props.orange) {
        className = className + ' highlighted_orange';
    }
    
    return (
        <div className={className} onClick={props.toggleSquare} style={props.targeted ? {
            'backgroundColor': 'red'
        } : {}}>
            <Piece symbol={props.symbol} />
        </div>
    );
}