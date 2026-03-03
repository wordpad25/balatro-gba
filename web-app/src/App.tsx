import { useState, useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { GameState, HandType } from './types/game';
import { Card as CardComponent } from './components/Card';
import { BlindSelect } from './components/BlindSelect';
import { Shop } from './components/Shop';
import { analyzeHand, getBestHand } from './logic/handAnalysis';

const HAND_BASE_VALUES: Record<HandType, { chips: number, mult: number }> = {
  [HandType.NONE]: { chips: 0, mult: 0 },
  [HandType.HIGH_CARD]: { chips: 5, mult: 1 },
  [HandType.PAIR]: { chips: 10, mult: 2 },
  [HandType.TWO_PAIR]: { chips: 20, mult: 2 },
  [HandType.THREE_OF_A_KIND]: { chips: 30, mult: 3 },
  [HandType.STRAIGHT]: { chips: 30, mult: 4 },
  [HandType.FLUSH]: { chips: 35, mult: 4 },
  [HandType.FULL_HOUSE]: { chips: 40, mult: 4 },
  [HandType.FOUR_OF_A_KIND]: { chips: 60, mult: 7 },
  [HandType.STRAIGHT_FLUSH]: { chips: 100, mult: 8 },
  [HandType.ROYAL_FLUSH]: { chips: 100, mult: 8 },
  [HandType.FIVE_OF_A_KIND]: { chips: 120, mult: 12 },
  [HandType.FLUSH_HOUSE]: { chips: 140, mult: 14 },
  [HandType.FLUSH_FIVE]: { chips: 160, mult: 16 },
};

function App() {
  const {
    gameState, setGameState, hand, money, score, targetScore,
    handsRemaining, discardsRemaining, playHand, discardHand,
    drawCard, resetGame, jokers, cashOut
  } = useGameStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Initial draw
  useEffect(() => {
    if (gameState === GameState.PLAYING && hand.length === 0) {
      for (let i = 0; i < 8; i++) drawCard();
    }
  }, [gameState, hand.length, drawCard]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : (prev.length < 5 ? [...prev, id] : prev)
    );
  };

  const handlePlay = () => {
    if (selectedIds.length === 0) return;
    playHand(selectedIds);
    setSelectedIds([]);
  };

  const handleDiscard = () => {
    if (selectedIds.length === 0) return;
    discardHand(selectedIds);
    setSelectedIds([]);
  };

  const selectedCards = hand.filter(c => selectedIds.includes(c.id));
  const currentAnalysis = analyzeHand(selectedCards);
  const bestHand = getBestHand(currentAnalysis);
  const baseValues = HAND_BASE_VALUES[bestHand];

  if (gameState === GameState.MAIN_MENU) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-8xl font-black mb-8 text-balatro-red italic transform -rotate-2 drop-shadow-2xl">BALATRO WEB</h1>
        <div className="flex flex-col gap-4 w-64">
          <button
            onClick={() => { resetGame(); setGameState(GameState.BLIND_SELECT); }}
            className="bg-balatro-blue text-white font-black text-2xl py-6 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            NEW RUN
          </button>
          <button className="bg-neutral-700 text-white font-bold py-4 rounded-lg shadow-lg opacity-50 cursor-not-allowed">
            COLLECTION
          </button>
          <button className="bg-neutral-700 text-white font-bold py-4 rounded-lg shadow-lg opacity-50 cursor-not-allowed">
            OPTIONS
          </button>
        </div>
      </div>
    );
  }

  if (gameState === GameState.BLIND_SELECT) {
    return <BlindSelect />;
  }

  if (gameState === GameState.SHOP) {
    return <Shop />;
  }

  if (gameState === GameState.LOSE) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-8xl font-black mb-4 text-balatro-red italic transform -rotate-2">GAME OVER</h1>
        <div className="text-2xl text-neutral-400 mb-12">No more hands remaining!</div>
        <button
          onClick={() => { resetGame(); setGameState(GameState.MAIN_MENU); }}
          className="bg-neutral-800 px-12 py-4 rounded-lg font-bold hover:bg-neutral-700 transition-colors"
        >
          BACK TO MENU
        </button>
      </div>
    );
  }

  if (gameState === GameState.ROUND_END) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-8xl font-black mb-8 text-balatro-blue italic transform -rotate-2">ROUND DEFEATED</h1>
        <div className="bg-neutral-800 p-12 rounded-3xl border-4 border-balatro-blue flex flex-col items-center gap-8 shadow-2xl">
          <div className="text-3xl">Final Score: <span className="font-mono font-black text-balatro-yellow">{score.toLocaleString()}</span></div>
          <div className="text-xl text-neutral-400">Reward Breakdown:</div>
          <div className="w-full flex flex-col gap-2 font-bold uppercase tracking-wider">
            <div className="flex justify-between border-b border-neutral-700 pb-2">
              <span>Blind Base</span>
              <span className="text-balatro-yellow">$5</span>
            </div>
            <div className="flex justify-between border-b border-neutral-700 pb-2">
              <span>Hands Left ({handsRemaining})</span>
              <span className="text-balatro-yellow">${handsRemaining}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest</span>
              <span className="text-balatro-yellow">${Math.min(5, Math.floor(money / 5))}</span>
            </div>
          </div>
          <button
            onClick={cashOut}
            className="w-full bg-balatro-blue px-12 py-6 rounded-xl font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_6px_0_rgb(30,58,138)]"
          >
            CASH OUT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col p-4 select-none">
      {/* Top Bar: Jokers */}
      <div className="h-36 bg-neutral-800 rounded-xl mb-4 p-4 border border-neutral-700 flex gap-4 overflow-x-auto shadow-inner">
        {jokers.map((joker, i) => (
          <div key={i} className="w-24 h-full bg-balatro-blue border-2 border-white/20 rounded-lg flex flex-col items-center justify-center p-2 text-center shadow-lg relative group">
            <div className="text-[10px] font-black uppercase leading-tight mb-1">{joker.name}</div>
            <div className="text-[8px] text-white/60 italic">
              {joker.id === 0 && "+4 Mult"}
              {joker.id === 1 && "Diamonds +3 Mult"}
              {joker.id === 5 && "Pair +8 Mult"}
              {joker.id === 15 && "<=3 cards +20 Mult"}
            </div>
          </div>
        ))}
        {Array.from({ length: 5 - jokers.length }).map((_, i) => (
          <div key={i} className="w-24 h-full border-2 border-dashed border-neutral-600 rounded-lg flex items-center justify-center text-neutral-600 text-[10px] text-center p-2 font-bold uppercase tracking-tighter">
            Empty Slot
          </div>
        ))}
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left Side: Stats */}
        <div className="w-72 flex flex-col gap-4">
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-inner">
            <div className="text-xs text-neutral-400 font-bold mb-1 tracking-widest uppercase">Target: {targetScore.toLocaleString()}</div>
            <div className="text-sm text-neutral-400 font-bold uppercase tracking-widest">Current Score</div>
            <div className="text-4xl font-mono font-black text-white">{score.toLocaleString()}</div>
          </div>
          <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 flex justify-between items-center shadow-md">
            <div>
              <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Hands</div>
              <div className="text-4xl text-balatro-blue font-black">{handsRemaining}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Discards</div>
              <div className="text-4xl text-balatro-red font-black">{discardsRemaining}</div>
            </div>
          </div>
          <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 shadow-md">
            <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Money</div>
            <div className="text-3xl text-balatro-yellow font-black">${money}</div>
          </div>

          {/* Active Hand Info */}
          <div className="flex-1 bg-neutral-950 rounded-xl border-2 border-neutral-800 p-6 flex flex-col items-center justify-center gap-4 shadow-2xl relative overflow-hidden">
            {selectedIds.length > 0 ? (
              <>
                <div className="text-balatro-yellow font-black text-2xl uppercase tracking-[0.2em] text-center leading-tight drop-shadow-md">
                  {bestHand.replace(/_/g, ' ')}
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-balatro-blue px-6 py-3 rounded-xl shadow-[0_4px_0_rgb(30,58,138)]">
                    <span className="text-white text-4xl font-black">{baseValues.chips}</span>
                  </div>
                  <span className="text-3xl font-black text-neutral-600 italic">X</span>
                  <div className="bg-balatro-red px-6 py-3 rounded-xl shadow-[0_4px_0_rgb(153,27,27)]">
                    <span className="text-white text-4xl font-black">{baseValues.mult}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-neutral-700 font-black italic text-center p-4 text-xl uppercase tracking-tighter opacity-50">
                Pick up to 5 cards
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Playing Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Played Cards Area */}
          <div className="flex-1 bg-neutral-950/30 rounded-2xl border-4 border-dashed border-neutral-800 flex items-center justify-center gap-4 p-8 relative overflow-hidden">
            <div className="absolute top-4 left-4 text-[10px] font-bold text-neutral-700 uppercase tracking-widest">Scoring Zone</div>
            {selectedIds.map(id => {
              const card = hand.find(c => c.id === id);
              if (!card) return null;
              return (
                <CardComponent
                  key={id}
                  rank={card.rank}
                  suit={card.suit}
                  isSelected={true}
                  onClick={() => toggleSelect(id)}
                />
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-8 justify-center h-24">
            <button
              onClick={handlePlay}
              disabled={selectedIds.length === 0 || handsRemaining === 0}
              className="bg-balatro-blue px-20 rounded-2xl font-black text-3xl shadow-[0_8px_0_rgb(30,58,138)] active:translate-y-1 active:shadow-none hover:brightness-110 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
              PLAY
            </button>
            <button
              onClick={handleDiscard}
              disabled={selectedIds.length === 0 || discardsRemaining === 0}
              className="bg-balatro-red px-20 rounded-2xl font-black text-3xl shadow-[0_8px_0_rgb(153,27,27)] active:translate-y-1 active:shadow-none hover:brightness-110 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
              DISCARD
            </button>
          </div>

          {/* Hand Area */}
          <div className="h-64 bg-neutral-800/40 rounded-3xl p-8 flex items-center justify-center gap-1 overflow-x-auto border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            {hand.filter(c => !selectedIds.includes(c.id)).map(card => (
              <div key={card.id} className="hover:-translate-y-2 transition-transform duration-200 h-fit">
                <CardComponent
                  rank={card.rank}
                  suit={card.suit}
                  onClick={() => toggleSelect(card.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
