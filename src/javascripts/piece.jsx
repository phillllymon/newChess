import React from 'react';

const SYMBOL_MAP = {
    R: (<div className="piece">&#9820;</div>),
    N: (<div className="piece">&#9822;</div>),
    B: (<div className="piece">&#9821;</div>),
    Q: (<div className="piece">&#9819;</div>),
    K: (<div className="piece">&#9818;</div>),
    P: (<div className="piece">&#9823;</div>),
    r: (<div className="piece">&#9814;</div>),
    n: (<div className="piece">&#9816;</div>),
    b: (<div className="piece">&#9815;</div>),
    q: (<div className="piece">&#9813;</div>),
    k: (<div className="piece">&#9812;</div>),
    p: (<div className="piece">&#9817;</div>)
}

export function Piece(props) {
    if (!SYMBOL_MAP[props.symbol]) {
        return null;
    }

    return SYMBOL_MAP[props.symbol];
}