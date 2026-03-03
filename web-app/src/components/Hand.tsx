import React from 'react';
import { useGameStore } from '../store/useGameStore';
import CardView from './CardView';

const Hand: React.FC = () => {
    const hand = useGameStore(state => state.hand);
    const hand_select_card = useGameStore(state => state.hand_select_card);

    return (
        <div className="flex gap-2 items-end h-full pt-8">
            {hand.map((cardObj, i) => (
                <div
                    key={i}
                    onClick={() => hand_select_card(i)}
                    className={`transition-transform duration-100 cursor-pointer ${cardObj.selected ? '-translate-y-8' : 'hover:-translate-y-2'}`}
                >
                    <CardView cardObj={cardObj} />
                </div>
            ))}
        </div>
    );
};

export default Hand;