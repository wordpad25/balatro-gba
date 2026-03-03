import React from 'react';
import { useGameStore } from '../store/useGameStore';

const Jokers: React.FC = () => {
    const jokers = useGameStore(state => state._owned_jokers_list);

    if (jokers.length === 0) {
        return <div className="text-slate-600 font-bold opacity-50 border-2 border-dashed border-slate-600 p-8 rounded-xl">NO JOKERS</div>;
    }

    return (
        <div className="flex gap-4">
            {jokers.map((j, i) => (
                <div key={i} className="w-24 h-36 bg-indigo-900 rounded-lg border-2 border-indigo-400 shadow-lg flex items-center justify-center text-indigo-200 font-bold">
                    Joker {j.id}
                </div>
            ))}
        </div>
    );
};

export default Jokers;