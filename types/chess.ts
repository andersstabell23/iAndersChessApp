export type Color = 'white' | 'black';
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type GameMode = 'local' | 'ai' | 'online';

export interface Piece {
  type: PieceType;
  color: Color;
}

export interface Move {
  from: string;
  to: string;
  piece: PieceType;
  captured?: PieceType;
  promotion?: PieceType;
  san: string;
  fen: string;
  castle?: 'kingside' | 'queenside';
  enPassant?: boolean;
}

export interface GameState {
  board: Record<string, Piece>;
  activeColor: Color;
  castlingRights: {
    whiteKingside: boolean;
    whiteQueenside: boolean;
    blackKingside: boolean;
    blackQueenside: boolean;
  };
  enPassantSquare: string | null;
  halfMoveClock: number;
  fullMoveNumber: number;
  moveHistory: Move[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
}

export interface TimeControl {
  minutes: number;
  increment: number;
}

export interface Puzzle {
  id: string;
  fen: string;
  moves: string[];
  solution: string;
  theme: string;
  rating: number;
  description: string;
  sideToMove: Color;
}

export interface GameResult {
  winner: Color | 'draw';
  reason: 'checkmate' | 'stalemate' | 'resignation' | 'time' | 'draw';
  moves: Move[];
  pgn: string;
}