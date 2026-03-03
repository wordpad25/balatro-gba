import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { GameState } from '../logic/game';
import GameStats from './GameStats';
import Hand from './Hand';
import Jokers from './Jokers';

const Dashboard: React.FC = () => {
    const game_state = useGameStore(state => state.game_state);
    const game_init = useGameStore(state => state.game_init);

    if (game_state === GameState.GAME_STATE_MAIN_MENU) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-8">
                <h1 className="text-5xl font-bold text-red-500">Balatro Web</h1>
                <button
                    onClick={game_init}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-xl font-bold rounded shadow-lg transition-colors"
                >
                    PLAY
                </button>
            </div>
        );
    }

    if (game_state === GameState.GAME_STATE_LOSE) {
        return (
            <div className="min-h-screen bg-red-900 text-white flex flex-col items-center justify-center space-y-8">
                <h1 className="text-6xl font-bold">GAME OVER</h1>
                <button onClick={game_init} className="px-6 py-3 bg-white text-red-900 font-bold rounded">NEW RUN</button>
            </div>
        );
    }

    if (game_state === GameState.GAME_STATE_ROUND_END || game_state === GameState.GAME_STATE_WIN) {
        return (
            <div className="min-h-screen bg-green-900 text-white flex flex-col items-center justify-center space-y-8">
                <h1 className="text-5xl font-bold">ROUND CLEARED!</h1>
                <button onClick={() => useGameStore.setState({ game_state: GameState.GAME_STATE_PLAYING, round: useGameStore.getState().round + 1 })} className="px-6 py-3 bg-white text-green-900 font-bold rounded">NEXT ROUND</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-800 text-white flex flex-col p-4 font-mono select-none">
            <div className="flex-1 flex gap-4 max-w-6xl mx-auto w-full">

                {/* Left Sidebar: Game Stats */}
                <div className="w-64 bg-slate-900/80 p-4 rounded-lg shadow-xl flex flex-col gap-4">
                    <GameStats />
                </div>

                {/* Main Play Area */}
                <div className="flex-1 flex flex-col">

                    {/* Top: Jokers */}
                    <div className="h-40 bg-slate-900/40 rounded-lg flex items-center justify-center p-4">
                        <Jokers />
                    </div>

                    <div className="flex-1"></div>

                    {/* Bottom: Hand and Controls */}
                    <div className="flex flex-col gap-4 relative">
                         {/* Action Buttons */}
                        <div className="absolute -top-16 left-0 flex gap-2">
                             <button onClick={() => useGameStore.getState().sort_hand_by_rank()} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-bold shadow">Sort Rank</button>
                             <button onClick={() => useGameStore.getState().sort_hand_by_suit()} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-bold shadow">Sort Suit</button>
                        </div>
                        <div className="absolute -top-16 right-0 flex gap-2">
                            <button
                                onClick={() => useGameStore.getState().game_playing_execute_play_hand()}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold shadow-lg shadow-blue-500/20"
                            >
                                Play Hand
                            </button>
                            <button
                                onClick={() => useGameStore.getState().game_playing_execute_discard()}
                                className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded font-bold shadow-lg shadow-red-500/20"
                            >
                                Discard
                            </button>
                        </div>

                        {/* Hand Display */}
                        <div className="h-48 bg-slate-900/60 rounded-lg p-4 flex items-center justify-center">
                            <Hand />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;