import React from 'react';
import { useGameStore } from './store/useGameStore';

function App() {
  const { hand, playedCards, score, money, hands, discards, toggleCardSelection, playHand, discardCards, drawCards, deck } = useGameStore();

  React.useEffect(() => {
    if (hand.length < 8 && deck.length > 0) {
      drawCards(8 - hand.length);
    }
  }, [hand, deck, drawCards]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-red-500">Balatro Web</h1>

      <div className="flex gap-8 mb-8">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-sm text-slate-400">Score</p>
          <p className="text-2xl font-mono">{score}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-sm text-slate-400">Money</p>
          <p className="text-2xl font-mono text-yellow-500">${money}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-sm text-slate-400">Hands</p>
          <p className="text-2xl font-mono text-blue-400">{hands}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-sm text-slate-400">Discards</p>
          <p className="text-2xl font-mono text-orange-400">{discards}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        {hand.map((card) => {
          const isSelected = playedCards.find(c => c.id === card.id);
          return (
            <button
              key={card.id}
              onClick={() => toggleCardSelection(card.id)}
              className={`
                w-24 h-36 rounded-lg flex flex-col items-center justify-center text-xl font-bold border-2 transition-transform
                ${isSelected ? 'translate-y-[-20px] border-blue-500 bg-slate-700' : 'border-slate-600 bg-slate-800 hover:border-slate-400'}
              `}
            >
              <span className={card.suit < 2 ? 'text-red-500' : 'text-slate-100'}>
                {['2','3','4','5','6','7','8','9','10','J','Q','K','A'][card.rank]}
              </span>
              <span className={card.suit < 2 ? 'text-red-500' : 'text-slate-100'}>
                {['♥','♦','♣','♠'][card.suit]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={playHand}
          disabled={playedCards.length === 0 || hands === 0}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-8 py-3 rounded-full font-bold transition-colors"
        >
          Play Hand
        </button>
        <button
          onClick={discardCards}
          disabled={playedCards.length === 0 || discards === 0}
          className="bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 px-8 py-3 rounded-full font-bold transition-colors"
        >
          Discard
        </button>
      </div>
    </div>
  );
}

export default App;
