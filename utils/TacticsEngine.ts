import { Puzzle, Color } from '@/types/chess';

export class TacticsEngine {
  private puzzles: Puzzle[] = [
    {
      id: 'puzzle-1',
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      moves: ['Ng5', 'f6', 'Qh5+'],
      solution: 'Qh5+',
      theme: 'Fork',
      rating: 1200,
      description: 'White to move and win material',
      sideToMove: 'white',
    },
    {
      id: 'puzzle-2',
      fen: 'rnbqkbnr/ppp2ppp/3p4/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
      moves: ['Nxe5'],
      solution: 'Nxe5',
      theme: 'Pin',
      rating: 1000,
      description: 'White can win the e5 pawn safely',
      sideToMove: 'white',
    },
    {
      id: 'puzzle-3',
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 5',
      moves: ['Bxf7+'],
      solution: 'Bxf7+',
      theme: 'Discovered Attack',
      rating: 1400,
      description: 'White has a powerful discovered attack',
      sideToMove: 'white',
    },
    {
      id: 'puzzle-4',
      fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      moves: ['Ng5', 'd6', 'Nxf7'],
      solution: 'Ng5',
      theme: 'Fork',
      rating: 1300,
      description: 'Knight fork wins material',
      sideToMove: 'white',
    },
    {
      id: 'puzzle-5',
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 4 4',
      moves: ['d4'],
      solution: 'd4',
      theme: 'Opening',
      rating: 900,
      description: 'Best move to gain central control',
      sideToMove: 'white',
    },
  ];

  getNextPuzzle(playerRating: number): Puzzle {
    // Filter puzzles by rating range
    const suitablePuzzles = this.puzzles.filter(
      puzzle => puzzle.rating >= playerRating - 200 && puzzle.rating <= playerRating + 200
    );
    
    if (suitablePuzzles.length === 0) {
      return this.puzzles[Math.floor(Math.random() * this.puzzles.length)];
    }
    
    return suitablePuzzles[Math.floor(Math.random() * suitablePuzzles.length)];
  }

  checkSolution(puzzle: Puzzle, from: string, to: string, promotion?: string): boolean {
    const moveString = this.formatMove(from, to, promotion);
    return puzzle.solution === moveString || puzzle.moves.includes(moveString);
  }

  private formatMove(from: string, to: string, promotion?: string): string {
    // Simplified move notation for puzzle checking
    let move = from + to;
    if (promotion) {
      move += promotion;
    }
    return move;
  }

  getTotalPuzzles(): number {
    return this.puzzles.length;
  }

  getPuzzlesByTheme(theme: string): Puzzle[] {
    return this.puzzles.filter(puzzle => puzzle.theme.toLowerCase() === theme.toLowerCase());
  }

  getAvailableThemes(): string[] {
    const themes = new Set(this.puzzles.map(puzzle => puzzle.theme));
    return Array.from(themes);
  }
}