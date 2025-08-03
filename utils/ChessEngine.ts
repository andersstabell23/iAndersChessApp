import { GameState, Move, Piece, Color, PieceType } from '@/types/chess';

export class ChessEngine {
  private state: GameState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): GameState {
    const initialBoard: Record<string, Piece> = {};
    
    // Setup initial position
    const pieceOrder: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    
    // Place pieces
    pieceOrder.forEach((piece, index) => {
      const file = String.fromCharCode(97 + index);
      initialBoard[`${file}1`] = { type: piece, color: 'white' };
      initialBoard[`${file}8`] = { type: piece, color: 'black' };
    });
    
    // Place pawns
    for (let i = 0; i < 8; i++) {
      const file = String.fromCharCode(97 + i);
      initialBoard[`${file}2`] = { type: 'pawn', color: 'white' };
      initialBoard[`${file}7`] = { type: 'pawn', color: 'black' };
    }

    return {
      board: initialBoard,
      activeColor: 'white',
      castlingRights: {
        whiteKingside: true,
        whiteQueenside: true,
        blackKingside: true,
        blackQueenside: true,
      },
      enPassantSquare: null,
      halfMoveClock: 0,
      fullMoveNumber: 1,
      moveHistory: [],
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  loadState(state: GameState): void {
    this.state = { ...state };
  }

  makeMove(from: string, to: string, promotion?: string): { success: boolean; isCheckmate: boolean; isStalemate: boolean } {
    const piece = this.state.board[from];
    if (!piece || piece.color !== this.state.activeColor) {
      return { success: false, isCheckmate: false, isStalemate: false };
    }

    if (!this.isValidMove(from, to)) {
      return { success: false, isCheckmate: false, isStalemate: false };
    }

    // Make the move
    const newBoard = { ...this.state.board };
    const capturedPiece = newBoard[to];
    
    newBoard[to] = newBoard[from];
    delete newBoard[from];

    // Handle pawn promotion
    if (piece.type === 'pawn' && (to[1] === '8' || to[1] === '1')) {
      newBoard[to] = { 
        type: (promotion as PieceType) || 'queen', 
        color: piece.color 
      };
    }

    // Handle castling
    if (piece.type === 'king' && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 2) {
      const isKingside = to.charCodeAt(0) > from.charCodeAt(0);
      const rookFrom = isKingside ? `h${from[1]}` : `a${from[1]}`;
      const rookTo = isKingside ? `f${from[1]}` : `d${from[1]}`;
      
      newBoard[rookTo] = newBoard[rookFrom];
      delete newBoard[rookFrom];
    }

    // Handle en passant
    if (piece.type === 'pawn' && to === this.state.enPassantSquare) {
      const capturedPawnSquare = `${to[0]}${piece.color === 'white' ? '5' : '4'}`;
      delete newBoard[capturedPawnSquare];
    }

    // Create move object
    const move: Move = {
      from,
      to,
      piece: piece.type,
      captured: capturedPiece?.type,
      promotion: promotion as PieceType,
      san: this.generateSAN(from, to, piece, capturedPiece, promotion),
      fen: this.generateFEN(newBoard),
    };

    // Update state
    this.state.board = newBoard;
    this.state.activeColor = this.state.activeColor === 'white' ? 'black' : 'white';
    this.state.moveHistory.push(move);
    this.state.halfMoveClock = capturedPiece || piece.type === 'pawn' ? 0 : this.state.halfMoveClock + 1;
    if (this.state.activeColor === 'white') {
      this.state.fullMoveNumber++;
    }

    // Update en passant square
    this.state.enPassantSquare = null;
    if (piece.type === 'pawn' && Math.abs(parseInt(from[1]) - parseInt(to[1])) === 2) {
      const enPassantRank = piece.color === 'white' ? '3' : '6';
      this.state.enPassantSquare = `${from[0]}${enPassantRank}`;
    }

    // Check for check, checkmate, stalemate
    const isCheck = this.isInCheck(this.state.activeColor);
    const hasLegalMoves = this.hasLegalMoves(this.state.activeColor);
    
    this.state.isCheck = isCheck;
    this.state.isCheckmate = isCheck && !hasLegalMoves;
    this.state.isStalemate = !isCheck && !hasLegalMoves;

    return {
      success: true,
      isCheckmate: this.state.isCheckmate,
      isStalemate: this.state.isStalemate,
    };
  }

  private isValidMove(from: string, to: string): boolean {
    const piece = this.state.board[from];
    if (!piece) return false;

    // Basic piece movement validation
    switch (piece.type) {
      case 'pawn':
        return this.isValidPawnMove(from, to, piece.color);
      case 'rook':
        return this.isValidRookMove(from, to);
      case 'bishop':
        return this.isValidBishopMove(from, to);
      case 'queen':
        return this.isValidQueenMove(from, to);
      case 'king':
        return this.isValidKingMove(from, to, piece.color);
      case 'knight':
        return this.isValidKnightMove(from, to);
      default:
        return false;
    }
  }

  private isValidPawnMove(from: string, to: string, color: Color): boolean {
    const direction = color === 'white' ? 1 : -1;
    const startRank = color === 'white' ? 2 : 7;
    
    const fromFile = from.charCodeAt(0);
    const fromRank = parseInt(from[1]);
    const toFile = to.charCodeAt(0);
    const toRank = parseInt(to[1]);
    
    const rankDiff = toRank - fromRank;
    const fileDiff = Math.abs(toFile - fromFile);
    
    // Forward move
    if (fileDiff === 0 && !this.state.board[to]) {
      if (rankDiff === direction) return true;
      if (fromRank === startRank && rankDiff === 2 * direction) return true;
    }
    
    // Capture
    if (fileDiff === 1 && rankDiff === direction) {
      if (this.state.board[to] && this.state.board[to].color !== color) return true;
      if (to === this.state.enPassantSquare) return true;
    }
    
    return false;
  }

  private isValidRookMove(from: string, to: string): boolean {
    const fromFile = from.charCodeAt(0);
    const fromRank = parseInt(from[1]);
    const toFile = to.charCodeAt(0);
    const toRank = parseInt(to[1]);
    
    if (fromFile !== toFile && fromRank !== toRank) return false;
    
    return this.isPathClear(from, to);
  }

  private isValidBishopMove(from: string, to: string): boolean {
    const fromFile = from.charCodeAt(0);
    const fromRank = parseInt(from[1]);
    const toFile = to.charCodeAt(0);
    const toRank = parseInt(to[1]);
    
    if (Math.abs(fromFile - toFile) !== Math.abs(fromRank - toRank)) return false;
    
    return this.isPathClear(from, to);
  }

  private isValidQueenMove(from: string, to: string): boolean {
    return this.isValidRookMove(from, to) || this.isValidBishopMove(from, to);
  }

  private isValidKingMove(from: string, to: string, color: Color): boolean {
    const fromFile = from.charCodeAt(0);
    const fromRank = parseInt(from[1]);
    const toFile = to.charCodeAt(0);
    const toRank = parseInt(to[1]);
    
    const fileDiff = Math.abs(fromFile - toFile);
    const rankDiff = Math.abs(fromRank - toRank);
    
    // Normal king move
    if (fileDiff <= 1 && rankDiff <= 1) return true;
    
    // Castling
    if (rankDiff === 0 && fileDiff === 2) {
      return this.canCastle(from, to, color);
    }
    
    return false;
  }

  private isValidKnightMove(from: string, to: string): boolean {
    const fromFile = from.charCodeAt(0);
    const fromRank = parseInt(from[1]);
    const toFile = to.charCodeAt(0);
    const toRank = parseInt(to[1]);
    
    const fileDiff = Math.abs(fromFile - toFile);
    const rankDiff = Math.abs(fromRank - toRank);
    
    return (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);
  }

  private isPathClear(from: string, to: string): boolean {
    const fromFile = from.charCodeAt(0);
    const fromRank = parseInt(from[1]);
    const toFile = to.charCodeAt(0);
    const toRank = parseInt(to[1]);
    
    const fileStep = toFile > fromFile ? 1 : toFile < fromFile ? -1 : 0;
    const rankStep = toRank > fromRank ? 1 : toRank < fromRank ? -1 : 0;
    
    let currentFile = fromFile + fileStep;
    let currentRank = fromRank + rankStep;
    
    while (currentFile !== toFile || currentRank !== toRank) {
      const square = `${String.fromCharCode(currentFile)}${currentRank}`;
      if (this.state.board[square]) return false;
      
      currentFile += fileStep;
      currentRank += rankStep;
    }
    
    return true;
  }

  private canCastle(from: string, to: string, color: Color): boolean {
    const isKingside = to.charCodeAt(0) > from.charCodeAt(0);
    const rights = this.state.castlingRights;
    
    if (color === 'white') {
      if (isKingside && !rights.whiteKingside) return false;
      if (!isKingside && !rights.whiteQueenside) return false;
    } else {
      if (isKingside && !rights.blackKingside) return false;
      if (!isKingside && !rights.blackQueenside) return false;
    }
    
    if (this.isInCheck(color)) return false;
    
    return this.isPathClear(from, to);
  }

  private isInCheck(color: Color): boolean {
    const kingSquare = this.findKing(color);
    if (!kingSquare) return false;
    
    return this.isSquareAttacked(kingSquare, color === 'white' ? 'black' : 'white');
  }

  private findKing(color: Color): string | null {
    for (const [square, piece] of Object.entries(this.state.board)) {
      if (piece.type === 'king' && piece.color === color) {
        return square;
      }
    }
    return null;
  }

  private isSquareAttacked(square: string, byColor: Color): boolean {
    for (const [pieceSquare, piece] of Object.entries(this.state.board)) {
      if (piece.color === byColor && this.isValidMove(pieceSquare, square)) {
        return true;
      }
    }
    return false;
  }

  private hasLegalMoves(color: Color): boolean {
    for (const [from, piece] of Object.entries(this.state.board)) {
      if (piece.color === color) {
        for (let file = 0; file < 8; file++) {
          for (let rank = 1; rank <= 8; rank++) {
            const to = `${String.fromCharCode(97 + file)}${rank}`;
            if (this.isValidMove(from, to)) {
              // Check if move leaves king in check
              const originalTo = this.state.board[to];
              this.state.board[to] = this.state.board[from];
              delete this.state.board[from];
              
              const stillInCheck = this.isInCheck(color);
              
              // Restore position
              this.state.board[from] = this.state.board[to];
              if (originalTo) {
                this.state.board[to] = originalTo;
              } else {
                delete this.state.board[to];
              }
              
              if (!stillInCheck) return true;
            }
          }
        }
      }
    }
    return false;
  }

  private generateSAN(from: string, to: string, piece: Piece, captured?: Piece, promotion?: string): string {
    let san = '';
    
    if (piece.type === 'king' && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 2) {
      return to.charCodeAt(0) > from.charCodeAt(0) ? 'O-O' : 'O-O-O';
    }
    
    if (piece.type !== 'pawn') {
      san += piece.type.charAt(0).toUpperCase();
    }
    
    if (captured || (piece.type === 'pawn' && from[0] !== to[0])) {
      if (piece.type === 'pawn') {
        san += from[0];
      }
      san += 'x';
    }
    
    san += to;
    
    if (promotion) {
      san += '=' + promotion.charAt(0).toUpperCase();
    }
    
    return san;
  }

  private generateFEN(board: Record<string, Piece>): string {
    let fen = '';
    
    for (let rank = 8; rank >= 1; rank--) {
      let emptyCount = 0;
      
      for (let file = 0; file < 8; file++) {
        const square = `${String.fromCharCode(97 + file)}${rank}`;
        const piece = board[square];
        
        if (piece) {
          if (emptyCount > 0) {
            fen += emptyCount.toString();
            emptyCount = 0;
          }
          
          const pieceChar = piece.type === 'knight' ? 'n' : piece.type[0];
          fen += piece.color === 'white' ? pieceChar.toUpperCase() : pieceChar;
        } else {
          emptyCount++;
        }
      }
      
      if (emptyCount > 0) {
        fen += emptyCount.toString();
      }
      
      if (rank > 1) fen += '/';
    }
    
    fen += ` ${this.state.activeColor[0]}`;
    fen += ` ${this.getCastlingRightsString()}`;
    fen += ` ${this.state.enPassantSquare || '-'}`;
    fen += ` ${this.state.halfMoveClock}`;
    fen += ` ${this.state.fullMoveNumber}`;
    
    return fen;
  }

  private getCastlingRightsString(): string {
    let rights = '';
    if (this.state.castlingRights.whiteKingside) rights += 'K';
    if (this.state.castlingRights.whiteQueenside) rights += 'Q';
    if (this.state.castlingRights.blackKingside) rights += 'k';
    if (this.state.castlingRights.blackQueenside) rights += 'q';
    return rights || '-';
  }

  getPossibleMoves(square: string): string[] {
    const moves: string[] = [];
    
    for (let file = 0; file < 8; file++) {
      for (let rank = 1; rank <= 8; rank++) {
        const to = `${String.fromCharCode(97 + file)}${rank}`;
        if (this.isValidMove(square, to)) {
          moves.push(to);
        }
      }
    }
    
    return moves;
  }
}