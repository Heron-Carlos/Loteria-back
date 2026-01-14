export interface Bet {
  id: string;
  playerName: string;
  gameType: 'Mega' | 'Quina';
  selectedNumbers: number[];
  isPaid: boolean;
  partnerId: string;
  deletedAt?: Date | null;
}

