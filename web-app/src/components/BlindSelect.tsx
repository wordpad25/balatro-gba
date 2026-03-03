import { BlindType } from '../types/game';
import { getBlindRequirement, BLIND_INFO } from '../logic/blinds';
import { useGameStore } from '../store/useGameStore';

export function BlindSelect() {
  const { ante, selectBlind } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 p-8">
      <h2 className="text-4xl font-black text-white mb-12 tracking-tighter uppercase">Select Blind - Ante {ante}</h2>

      <div className="flex gap-8">
        {[BlindType.SMALL, BlindType.BIG, BlindType.BOSS].map((type) => {
          const info = BLIND_INFO[type];
          const req = getBlindRequirement(type, ante);

          return (
            <div
              key={type}
              className="w-64 bg-neutral-800 border-2 border-neutral-700 rounded-2xl p-6 flex flex-col items-center hover:border-balatro-blue transition-colors cursor-pointer group"
              onClick={() => selectBlind(type)}
            >
              <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center text-2xl font-black
                ${type === BlindType.SMALL ? 'bg-neutral-600' : type === BlindType.BIG ? 'bg-balatro-red' : 'bg-balatro-blue animate-pulse'}`}>
                {info.name[0]}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{info.name}</h3>
              <div className="text-neutral-400 text-sm mb-4 italic">Score Required:</div>
              <div className="text-3xl font-mono font-black text-balatro-yellow mb-6">{req.toLocaleString()}</div>
              <div className="mt-auto bg-neutral-700 w-full text-center py-2 rounded-lg font-bold group-hover:bg-balatro-blue transition-colors">
                SELECT
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
