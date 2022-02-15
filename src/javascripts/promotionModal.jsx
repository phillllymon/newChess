import React from 'react';
import { Square } from './square';
import { Piece } from './piece';

export function PromotionModal(props) {

    const selectPromotion = (piece) => {
        const moveToMake = [...props.move, piece];
        props.makePromotionMove(moveToMake);
        props.setShouldShowPromotionModal(false);
    }

    return (
        <div className="modal_container">
            <div className="modal_background">
            </div>
            <div className="promotion_modal">
                {
                    props.pieceOptions.map((piece, i) => {
                        return (
                            <div key={i} onClick={() => selectPromotion(piece)}>
                                <Square symbol={piece} color="white"/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}
