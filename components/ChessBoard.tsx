import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  useColorScheme,
} from 'react-native';
import { ChessPiece } from './ChessPiece';
import { Square } from './Square';
import { ChessCoordinates } from './ChessCoordinates';
import { Color, PieceType } from '@/types/chess';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 32, 400);
const SQUARE_SIZE = BOARD_SIZE / 8;

interface ChessBoardProps {
  position: string | Record<string, { type: PieceType; color: Color }>;
  onMove: (from: string, to: string, promotion?: string) => void;
  activeColor: Color;
  lastMove?: { from: string; to: string };
  isFlipped?: boolean;
  showCoordinates?: boolean;
  legalMoves?: string[];
  highlightedSquares?: string[];
  disabled?: boolean;
}

export function ChessBoard({
  position,
  onMove,
  activeColor,
  lastMove,
  isFlipped = false,
  showCoordinates = true,
  legalMoves = [],
  highlightedSquares = [],
  disabled = false,
}: ChessBoardProps) {
  const colorScheme = useColorScheme();
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const dragPosition = useRef(new Animated.ValueXY()).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Convert FEN or position object to board state
  const getBoardFromPosition = useCallback(() => {
    if (typeof position === 'string') {
      // Parse FEN
      const [boardPart] = position.split(' ');
      const board: Record<string, { type: PieceType; color: Color }> = {};
      
      const ranks = boardPart.split('/');
      ranks.forEach((rank, rankIndex) => {
        let fileIndex = 0;
        for (const char of rank) {
          if (isNaN(parseInt(char))) {
            const file = String.fromCharCode(97 + fileIndex);
            const rankNum = 8 - rankIndex;
            const square = `${file}${rankNum}`;
            
            const color: Color = char === char.toUpperCase() ? 'white' : 'black';
            const pieceTypeMap: Record<string, PieceType> = {
              'k': 'king', 'q': 'queen', 'r': 'rook', 
              'b': 'bishop', 'n': 'knight', 'p': 'pawn'
            };
            const type = pieceTypeMap[char.toLowerCase()] || 'pawn';
            
            board[square] = { type, color };
            fileIndex++;
          } else {
            fileIndex += parseInt(char);
          }
        }
      });
      
      return board;
    }
    return position;
  }, [position]);

  const board = getBoardFromPosition();

  const getSquareFromCoordinates = useCallback((x: number, y: number) => {
    const file = Math.floor(x / SQUARE_SIZE);
    const rank = Math.floor(y / SQUARE_SIZE);
    
    if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
    
    const actualFile = isFlipped ? 7 - file : file;
    const actualRank = isFlipped ? rank + 1 : 8 - rank;
    
    return `${String.fromCharCode(97 + actualFile)}${actualRank}`;
  }, [isFlipped]);

  const animateSelection = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder: () => !disabled,
    
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const square = getSquareFromCoordinates(locationX, locationY);
      
      if (square && board[square] && board[square].color === activeColor) {
        setSelectedSquare(square);
        setDraggedPiece(square);
        setPossibleMoves(getLegalMovesForSquare(square));
        animateSelection();
        
        dragPosition.setOffset({
          x: locationX - SQUARE_SIZE / 2,
          y: locationY - SQUARE_SIZE / 2,
        });
      }
    },
    
    onPanResponderMove: Animated.event(
      [null, { dx: dragPosition.x, dy: dragPosition.y }],
      { useNativeDriver: false }
    ),
    
    onPanResponderRelease: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const targetSquare = getSquareFromCoordinates(locationX, locationY);
      
      if (selectedSquare && targetSquare && targetSquare !== selectedSquare) {
        handleMove(selectedSquare, targetSquare);
      }
      
      resetDragState();
    },
  });

  const resetDragState = useCallback(() => {
    setSelectedSquare(null);
    setDraggedPiece(null);
    setPossibleMoves([]);
    dragPosition.setValue({ x: 0, y: 0 });
    dragPosition.setOffset({ x: 0, y: 0 });
  }, [dragPosition]);

  const getLegalMovesForSquare = useCallback((square: string): string[] => {
    // Simplified legal move calculation - in a real app, this would use the chess engine
    const piece = board[square];
    if (!piece) return [];
    
    const moves: string[] = [];
    
    // Basic move generation for demonstration
    for (let file = 0; file < 8; file++) {
      for (let rank = 1; rank <= 8; rank++) {
        const targetSquare = `${String.fromCharCode(97 + file)}${rank}`;
        if (targetSquare !== square) {
          moves.push(targetSquare);
        }
      }
    }
    
    return moves.slice(0, 8); // Limit for performance
  }, [board]);

  const handleMove = useCallback((from: string, to: string) => {
    const piece = board[from];
    
    // Check for pawn promotion
    if (piece?.type === 'pawn' && (to[1] === '8' || to[1] === '1')) {
      // For now, auto-promote to queen - could show promotion dialog
      onMove(from, to, 'queen');
    } else {
      onMove(from, to);
    }
  }, [board, onMove]);

  const handleSquarePress = useCallback((square: string) => {
    if (disabled) return;
    
    if (selectedSquare) {
      if (selectedSquare === square) {
        resetDragState();
      } else {
        handleMove(selectedSquare, square);
        resetDragState();
      }
    } else if (board[square] && board[square].color === activeColor) {
      setSelectedSquare(square);
      setPossibleMoves(getLegalMovesForSquare(square));
      animateSelection();
    }
  }, [selectedSquare, board, activeColor, disabled, handleMove, resetDragState, getLegalMovesForSquare, animateSelection]);

  const renderSquare = useCallback((file: number, rank: number) => {
    const actualFile = isFlipped ? 7 - file : file;
    const actualRank = isFlipped ? rank + 1 : 8 - rank;
    const square = `${String.fromCharCode(97 + actualFile)}${actualRank}`;
    
    const isLight = (file + rank) % 2 === 0;
    const isSelected = selectedSquare === square;
    const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
    const isPossibleMove = possibleMoves.includes(square);
    const isHighlighted = highlightedSquares.includes(square);
    const piece = board[square];

    return (
      <Square
        key={square}
        square={square}
        isLight={isLight}
        isSelected={isSelected}
        isLastMove={isLastMove}
        isPossibleMove={isPossibleMove}
        isHighlighted={isHighlighted}
        onPress={() => handleSquarePress(square)}
        showCoordinates={showCoordinates && ((file === 0 && rank === 7) || (file === 7 && rank === 0))}
        file={actualFile}
        rank={actualRank}
      >
        {piece && draggedPiece !== square && (
          <Animated.View style={{ transform: [{ scale: isSelected ? scaleAnim : 1 }] }}>
            <ChessPiece type={piece.type} color={piece.color} />
          </Animated.View>
        )}
      </Square>
    );
  }, [
    isFlipped, selectedSquare, lastMove, possibleMoves, highlightedSquares, 
    board, draggedPiece, showCoordinates, handleSquarePress, scaleAnim
  ]);

  const styles = StyleSheet.create({
    container: {
      width: BOARD_SIZE,
      height: BOARD_SIZE,
      borderWidth: 3,
      borderColor: colorScheme === 'dark' ? '#8B4513' : '#654321',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    board: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderRadius: 8,
      overflow: 'hidden',
    },
    draggedPiece: {
      position: 'absolute',
      width: SQUARE_SIZE,
      height: SQUARE_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.board} {...panResponder.panHandlers}>
        {Array.from({ length: 8 }, (_, rank) =>
          Array.from({ length: 8 }, (_, file) => renderSquare(file, rank))
        )}
      </View>
      
      {draggedPiece && board[draggedPiece] && (
        <Animated.View
          style={[styles.draggedPiece, { transform: dragPosition.getTranslateTransform() }]}
          pointerEvents="none"
        >
          <ChessPiece
            type={board[draggedPiece].type}
            color={board[draggedPiece].color}
            size={40}
          />
        </Animated.View>
      )}
      
      {showCoordinates && <ChessCoordinates isFlipped={isFlipped} />}
    </View>
  );
}