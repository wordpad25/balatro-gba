import { useState, useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { GameState, HandType } from './types/game';
import { Card as CardComponent } from './components/Card';
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
    drawCard, resetGame
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
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
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
            onClick={() => { resetGame(); setGameState(GameState.PLAYING); }}
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

  if (gameState === GameState.LOSE) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-8xl font-black mb-8 text-balatro-red italic transform -rotate-2">GAME OVER</h1>
        <button
          onClick={() => { resetGame(); setGameState(GameState.MAIN_MENU); }}
          className="bg-neutral-800 px-12 py-4 rounded-lg font-bold hover:bg-neutral-700"
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
        <div className="bg-neutral-800 p-8 rounded-2xl border border-neutral-700 flex flex-col items-center gap-4">
          <div className="text-2xl">Final Score: <span className="font-mono font-bold text-balatro-yellow">{score.toLocaleString()}</span></div>
          <button
            onClick={() => { resetGame(); setGameState(GameState.PLAYING); }}
            className="bg-balatro-blue px-12 py-4 rounded-lg font-black text-xl hover:scale-105 transition-transform"
          >
            NEXT ROUND
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col p-4 select-none">
      {/* Top Bar: Jokers */}
      <div className="h-32 bg-neutral-800 rounded-xl mb-4 p-4 border border-neutral-700 flex gap-4">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="w-20 h-full border-2 border-dashed border-neutral-600 rounded-lg flex items-center justify-center text-neutral-600 text-[10px] text-center p-1 font-bold uppercase tracking-tighter">
            Empty Joker Slot
          </div>
        ))}
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left Side: Stats */}
        <div className="w-72 flex flex-col gap-4">
          <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-inner">
            <div className="text-xs text-neutral-400 font-bold mb-1">TARGET: {targetScore.toLocaleString()}</div>
            <div className="text-sm text-neutral-400 font-bold uppercase">SCORE</div>
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
          <div className="flex-1 bg-neutral-950 rounded-xl border-2 border-neutral-800 p-6 flex flex-col items-center justify-center gap-4">
            {selectedIds.length > 0 ? (
              <>
                <div className="text-balatro-yellow font-black text-2xl uppercase tracking-[0.2em] text-center leading-tight">
                  {bestHand.replace(/_/g, ' ')}
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-balatro-blue px-4 py-2 rounded-lg shadow-lg">
                    <span className="text-white text-4xl font-black">{baseValues.chips}</span>
                  </div>
                  <span className="text-3xl font-black text-neutral-500">X</span>
                  <div className="bg-balatro-red px-4 py-2 rounded-lg shadow-lg">
                    <span className="text-white text-4xl font-black">{baseValues.mult}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-neutral-600 font-bold italic text-center p-4">SELECT UP TO 5 CARDS</div>
            )}
          </div>
        </div>

        {/* Right Side: Playing Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Played Cards Area */}
          <div className="flex-1 bg-neutral-950/30 rounded-2xl border-4 border-dashed border-neutral-800 flex items-center justify-center gap-4 p-8">
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
          <div className="flex gap-6 justify-center h-20">
            <button
              onClick={handlePlay}
              disabled={selectedIds.length === 0 || handsRemaining === 0}
              className="bg-balatro-blue px-16 rounded-xl font-black text-2xl shadow-[0_6px_0_rgb(30,58,138)] active:translate-y-1 active:shadow-none hover:brightness-110 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
              PLAY HAND
            </button>
            <button
              onClick={handleDiscard}
              disabled={selectedIds.length === 0 || discardsRemaining === 0}
              className="bg-balatro-red px-16 rounded-xl font-black text-2xl shadow-[0_6px_0_rgb(153,27,27)] active:translate-y-1 active:shadow-none hover:brightness-110 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
              DISCARD
            </button>
          </div>

          {/* Hand Area */}
          <div className="h-56 bg-neutral-800/30 rounded-2xl p-6 flex items-center justify-center gap-2 overflow-x-auto border border-neutral-700/50 shadow-2xl">
            {hand.filter(c => !selectedIds.includes(c.id)).map(card => (
              <CardComponent
                key={card.id}
                rank={card.rank}
                suit={card.suit}
                onClick={() => toggleSelect(card.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
