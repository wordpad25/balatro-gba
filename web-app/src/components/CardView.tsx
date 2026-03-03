import React from 'react';
import type { CardObject } from '../logic/card';

// Quick lookup maps
const SUIT_CHARS = ['♦', '♣', '♥', '♠'];
const RANK_CHARS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUIT_COLORS = ['text-red-500', 'text-slate-800', 'text-red-500', 'text-slate-800'];

interface CardViewProps {
    cardObj: CardObject;
}

const CardView: React.FC<CardViewProps> = ({ cardObj }) => {
    const { suit, rank } = cardObj.card;

    return (
        <div className={`w-20 h-32 bg-white rounded-lg shadow flex flex-col justify-between p-2 border-2 ${cardObj.selected ? 'border-blue-400' : 'border-transparent'}`}>
            <div className={`text-lg font-bold ${SUIT_COLORS[suit]} leading-none`}>
                {RANK_CHARS[rank]}
            </div>
            <div className={`text-3xl self-center ${SUIT_COLORS[suit]}`}>
                {SUIT_CHARS[suit]}
            </div>
            <div className={`text-lg font-bold self-end rotate-180 ${SUIT_COLORS[suit]} leading-none`}>
                {RANK_CHARS[rank]}
            </div>
        </div>
    );
};

export default CardView;