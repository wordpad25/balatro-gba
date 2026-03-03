import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { blind_get_requirement } from '../logic/blind';
import { hand_base_values } from '../logic/game';

const GameStats: React.FC = () => {
    const score = useGameStore(state => state.score);
    const chips = useGameStore(state => state.chips);
    const mult = useGameStore(state => state.mult);
    const money = useGameStore(state => state.money);
    const hands = useGameStore(state => state.hands);
    const discards = useGameStore(state => state.discards);
    const ante = useGameStore(state => state.ante);
    const round = useGameStore(state => state.round);
    const current_blind = useGameStore(state => state.current_blind);
    const hand_type = useGameStore(state => state.hand_type);

    const requiredScore = blind_get_requirement(current_blind, ante);
    const currentHandName = hand_base_values[hand_type]?.display_name || "";

    return (
        <div className="flex flex-col gap-6 h-full text-sm">
            {/* Score Box */}
            <div className="bg-red-900/50 p-4 rounded border-2 border-red-500/30 text-center shadow-inner">
                <div className="text-red-300 font-bold mb-1 uppercase tracking-wider text-xs">Score / Req</div>
                <div className="text-xl font-bold text-white mb-1">
                    {score.toLocaleString()}
                </div>
                <div className="text-red-400 font-semibold">
                    {requiredScore.toLocaleString()}
                </div>
            </div>

            {/* Current Selection Box */}
            <div className="bg-slate-800 p-4 rounded border-2 border-slate-600">
                <div className="text-center font-bold text-slate-300 mb-3 h-5">{currentHandName}</div>
                <div className="flex justify-between items-center gap-2">
                    <div className="flex-1 bg-blue-900/40 text-blue-400 font-bold py-2 rounded text-center border border-blue-500/30">
                        {chips}
                    </div>
                    <div className="text-slate-500 font-bold px-1">X</div>
                    <div className="flex-1 bg-red-900/40 text-red-400 font-bold py-2 rounded text-center border border-red-500/30">
                        {mult}
                    </div>
                </div>
            </div>

            <div className="flex-1"></div>

            {/* Game Info */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between bg-slate-800 p-2 rounded">
                    <span className="text-slate-400">Money</span>
                    <span className="text-yellow-400 font-bold">${money}</span>
                </div>
                <div className="flex justify-between bg-slate-800 p-2 rounded">
                    <span className="text-slate-400">Ante</span>
                    <span className="font-bold text-slate-200">{ante} / 8</span>
                </div>
                <div className="flex justify-between bg-slate-800 p-2 rounded">
                    <span className="text-slate-400">Round</span>
                    <span className="font-bold text-slate-200">{round}</span>
                </div>
            </div>

            {/* Resources */}
            <div className="flex gap-2">
                <div className="flex-1 bg-slate-800 p-3 rounded text-center border border-blue-900/50">
                    <div className="text-blue-400 font-bold text-lg">{hands}</div>
                    <div className="text-slate-500 text-xs font-bold uppercase mt-1">Hands</div>
                </div>
                <div className="flex-1 bg-slate-800 p-3 rounded text-center border border-red-900/50">
                    <div className="text-red-400 font-bold text-lg">{discards}</div>
                    <div className="text-slate-500 text-xs font-bold uppercase mt-1">Discards</div>
                </div>
            </div>
        </div>
    );
};

export default GameStats;