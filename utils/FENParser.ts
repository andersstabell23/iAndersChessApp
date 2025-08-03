import { GameState, Piece, Color, PieceType } from '@/types/chess';

export class FENParser {
  static parse(fen: string): GameState {
    const parts = fen.split(' ');
    
    if (parts.length !== 6) {
      throw new Error('Invalid FEN string');
    }
    
    const [boardPart, activeColorPart, castlingPart, enPassantPart, halfMoveClockPart, fullMoveNumberPart] = parts;
    
    // Parse board
    const board: Record<string, Piece> = {};
    const ranks = boardPart.split('/');
    
    ranks.forEach((rank, rankIndex) => {
      let fileIndex = 0;
      
      for (const char of rank) {
        if (isNaN(parseInt(char))) {
          const file = String.fromCharCode(97 + fileIndex);
          const rankNum = 8 - rankIndex;
          const square = `${file}${rankNum}`;
          
          const color: Color = char === char.toUpperCase() ? 'white' : 'black';
          const type = this.charToPieceType(char.toLowerCase());
          
          board[square] = { type, color };
          fileIndex++;
        } else {
          fileIndex += parseInt(char);
        }
      }
    });
    
    // Parse castling rights
    const castlingRights = {
      whiteKingside: castlingPart.includes('K'),
      whiteQueenside: castlingPart.includes('Q'),
      blackKingside: castlingPart.includes('k'),
      blackQueenside: castlingPart.includes('q'),
    };
    
    return {
      board,
      activeColor: activeColorPart as Color,
      castlingRights,
      enPassantSquare: enPassantPart === '-' ? null : enPassantPart,
      halfMoveClock: parseInt(halfMoveClockPart),
      fullMoveNumber: parseInt(fullMoveNumberPart),
      moveHistory: [],
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
    };
  }

  static generate(state: GameState): string {
    let fen = '';
    
    // Generate board part
    for (let rank = 8; rank >= 1; rank--) {
      let emptyCount = 0;
      
      for (let file = 0; file < 8; file++) {
        const square = `${String.fromCharCode(97 + file)}${rank}`;
        const piece = state.board[square];
        
        if (piece) {
          if (emptyCount > 0) {
            fen += emptyCount.toString();
            emptyCount = 0;
          }
          
          const pieceChar = this.pieceTypeToChar(piece.type);
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
    
    // Add other parts
    fen += ` ${state.activeColor[0]}`;
    fen += ` ${this.getCastlingRightsString(state.castlingRights)}`;
    fen += ` ${state.enPassantSquare || '-'}`;
    fen += ` ${state.halfMoveClock}`;
    fen += ` ${state.fullMoveNumber}`;
    
    return fen;
  }

  private static charToPieceType(char: string): PieceType {
    const mapping: Record<string, PieceType> = {
      'k': 'king',
      'q': 'queen',
      'r': 'rook',
      'b': 'bishop',
      'n': 'knight',
      'p': 'pawn',
    };
    
    return mapping[char] || 'pawn';
  }

  private static pieceTypeToChar(type: PieceType): string {
    const mapping: Record<PieceType, string> = {
      'king': 'k',
      'queen': 'q',
      'rook': 'r',
      'bishop': 'b',
      'knight': 'n',
      'pawn': 'p',
    };
    
    return mapping[type] || 'p';
  }

  private static getCastlingRightsString(rights: GameState['castlingRights']): string {
    let result = '';
    if (rights.whiteKingside) result += 'K';
    if (rights.whiteQueenside) result += 'Q';
    if (rights.blackKingside) result += 'k';
    if (rights.blackQueenside) result += 'q';
    return result || '-';
  }
}