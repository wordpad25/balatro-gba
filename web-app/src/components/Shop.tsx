import { useGameStore } from '../store/useGameStore';
import { GameState } from '../types/game';
import { JOKER_REGISTRY, createJoker } from '../logic/jokers';

export function Shop() {
  const { money, jokers, setGameState } = useGameStore();

  // For demo, just show some available jokers
  const availableIds = [0, 1, 5, 15];

  const buyJoker = (id: number) => {
    const cost = JOKER_REGISTRY[id].value;
    if (money >= cost && jokers.length < 5) {
      useGameStore.setState(state => ({
        money: state.money - cost,
        jokers: [...state.jokers, createJoker(id)]
      }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 p-8">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-balatro-yellow italic tracking-tighter">SHOP</h2>
        <div className="bg-neutral-800 px-6 py-3 rounded-xl border-2 border-balatro-yellow">
          <span className="text-neutral-400 font-bold mr-4 uppercase">Balance:</span>
          <span className="text-3xl font-black text-balatro-yellow">${money}</span>
        </div>
      </div>

      <div className="flex-1 flex gap-8">
        <div className="flex-1 grid grid-cols-2 gap-6 h-fit">
          {availableIds.map(id => {
            const info = JOKER_REGISTRY[id];
            const canAfford = money >= info.value;
            const isFull = jokers.length >= 5;

            return (
              <div key={id} className="bg-neutral-800 rounded-2xl p-6 border-2 border-neutral-700 flex gap-6 items-center">
                <div className="w-20 h-28 bg-neutral-700 rounded-lg flex items-center justify-center font-black text-neutral-500 text-xs text-center p-2">
                  {info.name}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{info.name}</h3>
                  <div className="text-balatro-red font-black text-2xl mb-4">${info.value}</div>
                  <button
                    onClick={() => buyJoker(id)}
                    disabled={!canAfford || isFull}
                    className="w-full bg-balatro-blue py-2 rounded-lg font-bold disabled:opacity-30 hover:brightness-110"
                  >
                    {isFull ? 'FULL' : 'BUY'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-80 flex flex-col gap-6">
          <div className="bg-neutral-800 rounded-2xl p-6 border-2 border-neutral-700">
            <h4 className="text-sm text-neutral-400 font-bold uppercase mb-4 tracking-widest">Inventory</h4>
            <div className="flex gap-2 flex-wrap">
              {jokers.map((j, i) => (
                <div key={i} className="w-12 h-16 bg-balatro-blue rounded-md flex items-center justify-center text-[8px] font-bold text-center">
                  {j.name}
                </div>
              ))}
              {Array.from({ length: 5 - jokers.length }).map((_, i) => (
                <div key={i} className="w-12 h-16 border-2 border-dashed border-neutral-600 rounded-md" />
              ))}
            </div>
          </div>

          <button
            onClick={() => setGameState(GameState.BLIND_SELECT)}
            className="mt-auto bg-balatro-red py-6 rounded-2xl font-black text-2xl shadow-[0_6px_0_rgb(153,27,27)] active:translate-y-1 active:shadow-none transition-all"
          >
            NEXT ROUND
          </button>
        </div>
      </div>
    </div>
  );
}
