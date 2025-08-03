import { Move, GameResult } from '@/types/chess';

export class PGNParser {
  static parse(pgnString: string): GameResult | null {
    try {
      const lines = pgnString.trim().split('\n');
      const headers: Record<string, string> = {};
      let moveText = '';
      
      // Parse headers
      for (const line of lines) {
        if (line.startsWith('[') && line.endsWith(']')) {
          const match = line.match(/\[(\w+)\s+"([^"]+)"\]/);
          if (match) {
            headers[match[1]] = match[2];
          }
        } else if (line.trim() && !line.startsWith('[')) {
          moveText += line + ' ';
        }
      }
      
      // Parse moves
      const moves = this.parseMoves(moveText.trim());
      
      // Determine result
      const result = headers.Result || '*';
      let winner: 'white' | 'black' | 'draw';
      let reason: 'checkmate' | 'stalemate' | 'resignation' | 'time' | 'draw';
      
      if (result === '1-0') {
        winner = 'white';
        reason = 'checkmate';
      } else if (result === '0-1') {
        winner = 'black';
        reason = 'checkmate';
      } else {
        winner = 'draw';
        reason = 'draw';
      }
      
      return {
        winner,
        reason,
        moves,
        pgn: pgnString,
      };
    } catch (error) {
      console.error('Error parsing PGN:', error);
      return null;
    }
  }

  static generate(moves: Move[], headers?: Record<string, string>): string {
    let pgn = '';
    
    // Add headers
    const defaultHeaders = {
      Event: 'Casual Game',
      Site: 'Chess App',
      Date: new Date().toISOString().split('T')[0],
      Round: '1',
      White: 'Player 1',
      Black: 'Player 2',
      Result: '*',
    };
    
    const allHeaders = { ...defaultHeaders, ...headers };
    
    for (const [key, value] of Object.entries(allHeaders)) {
      pgn += `[${key} "${value}"]\n`;
    }
    
    pgn += '\n';
    
    // Add moves
    for (let i = 0; i < moves.length; i++) {
      if (i % 2 === 0) {
        pgn += `${Math.floor(i / 2) + 1}. `;
      }
      pgn += moves[i].san + ' ';
      
      if ((i + 1) % 12 === 0) {
        pgn += '\n';
      }
    }
    
    pgn += allHeaders.Result;
    
    return pgn.trim();
  }

  private static parseMoves(moveText: string): Move[] {
    const moves: Move[] = [];
    
    // Remove move numbers and result
    const cleanText = moveText
      .replace(/\d+\./g, '')
      .replace(/[01\/2-]+-[01\/2-]+|\*/g, '')
      .trim();
    
    const moveTokens = cleanText.split(/\s+/).filter(token => token.length > 0);
    
    for (const token of moveTokens) {
      if (token && !token.match(/^[01\/2-]+-[01\/2-]+|\*$/)) {
        // This is a simplified move object for PGN parsing
        moves.push({
          from: '',
          to: '',
          piece: 'pawn',
          san: token,
          fen: '',
        });
      }
    }
    
    return moves;
  }
}