import { Rank, Suit } from '../types/game';

const RANK_LABELS: Record<Rank, string> = {
  [Rank.TWO]: '2',
  [Rank.THREE]: '3',
  [Rank.FOUR]: '4',
  [Rank.FIVE]: '5',
  [Rank.SIX]: '6',
  [Rank.SEVEN]: '7',
  [Rank.EIGHT]: '8',
  [Rank.NINE]: '9',
  [Rank.TEN]: '10',
  [Rank.JACK]: 'J',
  [Rank.QUEEN]: 'Q',
  [Rank.KING]: 'K',
  [Rank.ACE]: 'A',
};

const SUIT_ICONS: Record<Suit, string> = {
  [Suit.DIAMONDS]: '♦',
  [Suit.CLUBS]: '♣',
  [Suit.HEARTS]: '♥',
  [Suit.SPADES]: '♠',
};

const SUIT_COLORS: Record<Suit, string> = {
  [Suit.DIAMONDS]: 'text-red-500',
  [Suit.CLUBS]: 'text-neutral-300',
  [Suit.HEARTS]: 'text-red-500',
  [Suit.SPADES]: 'text-neutral-300',
};

interface CardProps {
  rank: Rank;
  suit: Suit;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Card({ rank, suit, isSelected, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        w-16 h-24 rounded-lg bg-white border-2 flex flex-col items-center justify-between p-2 cursor-pointer transition-transform
        ${isSelected ? '-translate-y-4 border-balatro-yellow' : 'border-neutral-400 hover:-translate-y-2'}
      `}
    >
      <div className={`text-lg font-bold self-start ${SUIT_COLORS[suit]}`}>
        {RANK_LABELS[rank]}
      </div>
      <div className={`text-2xl ${SUIT_COLORS[suit]}`}>
        {SUIT_ICONS[suit]}
      </div>
      <div className={`text-lg font-bold self-end rotate-180 ${SUIT_COLORS[suit]}`}>
        {RANK_LABELS[rank]}
      </div>
    </div>
  );
}
