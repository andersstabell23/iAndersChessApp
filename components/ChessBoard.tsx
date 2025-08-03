import React, { useState, useRef } from 'react';
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
}

export function ChessBoard({
  position,
  onMove,
  activeColor,
  lastMove,
  isFlipped = false,
  showCoordinates = true,
  legalMoves = [],
}: ChessBoardProps) {
  const colorScheme = useColorScheme();
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const dragPosition = useRef(new Animated.ValueXY()).current;

  // Convert FEN or position object to board state
  const getBoardFromPosition = () => {
    if (typeof position === 'string') {
      // Parse FEN
      const [boardPart] = position.split(' ');
      const board: Record<string, { type: PieceType; color: Color }> = {};
      
      const ranks = boardPart.split('/');
      ranks.forEach((rank, rankIndex) => {
        let fileIndex = 0;
        for (const char of rank) {
          if (isNaN(parseInt(char))) {
            const file = String.fromCharCode(97 + fileIndex); // 'a' + fileIndex
            const rankNum = 8 - rankIndex;
            const square = `${file}${rankNum}`;
            
            const color: Color = char === char.toUpperCase() ? 'white' : 'black';
            const type = char.toLowerCase() as PieceType;
            
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
  };

  const board = getBoardFromPosition();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const file = Math.floor(locationX / SQUARE_SIZE);
      const rank = Math.floor(locationY / SQUARE_SIZE);
      
      const actualFile = isFlipped ? 7 - file : file;
      const actualRank = isFlipped ? rank + 1 : 8 - rank;
      
      const square = `${String.fromCharCode(97 + actualFile)}${actualRank}`;
      
      if (board[square] && board[square].color === activeColor) {
        setSelectedSquare(square);
        setDraggedPiece(square);
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
      const file = Math.floor(locationX / SQUARE_SIZE);
      const rank = Math.floor(locationY / SQUARE_SIZE);
      
      const actualFile = isFlipped ? 7 - file : file;
      const actualRank = isFlipped ? rank + 1 : 8 - rank;
      
      const targetSquare = `${String.fromCharCode(97 + actualFile)}${actualRank}`;
      
      if (selectedSquare && targetSquare !== selectedSquare) {
        onMove(selectedSquare, targetSquare);
      }
      
      setSelectedSquare(null);
      setDraggedPiece(null);
      dragPosition.setValue({ x: 0, y: 0 });
      dragPosition.setOffset({ x: 0, y: 0 });
    },
  });

  const handleSquarePress = (square: string) => {
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
      } else {
        onMove(selectedSquare, square);
        setSelectedSquare(null);
      }
    } else if (board[square] && board[square].color === activeColor) {
      setSelectedSquare(square);
    }
  };

  const renderSquare = (file: number, rank: number) => {
    const actualFile = isFlipped ? 7 - file : file;
    const actualRank = isFlipped ? rank + 1 : 8 - rank;
    const square = `${String.fromCharCode(97 + actualFile)}${actualRank}`;
    
    const isLight = (file + rank) % 2 === 0;
    const isSelected = selectedSquare === square;
    const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
    const piece = board[square];

    return (
      <Square
        key={square}
        square={square}
        isLight={isLight}
        isSelected={isSelected}
        isLastMove={isLastMove}
        onPress={() => handleSquarePress(square)}
        showCoordinates={showCoordinates && ((file === 0 && rank === 7) || (file === 7 && rank === 0))}
        file={actualFile}
        rank={actualRank}
      >
        {piece && draggedPiece !== square && (
          <ChessPiece type={piece.type} color={piece.color} />
        )}
      </Square>
    );
  };

  const styles = StyleSheet.create({
    container: {
      width: BOARD_SIZE,
      height: BOARD_SIZE,
      borderWidth: 2,
      borderColor: colorScheme === 'dark' ? '#666' : '#8B4513',
      borderRadius: 8,
    },
    board: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    draggedPiece: {
      position: 'absolute',
      width: SQUARE_SIZE,
      height: SQUARE_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.board} {...panResponder.panHandlers}>
        {Array.from({ length: 8 }, (_, rank) =>
          Array.from({ length: 8 }, (_, file) => renderSquare(file, rank))
        )}
      </View>
      
      {draggedPiece && (
        <Animated.View
          style={[styles.draggedPiece, { transform: dragPosition.getTranslateTransform() }]}
          pointerEvents="none"
        >
          <ChessPiece
            type={board[draggedPiece].type}
            color={board[draggedPiece].color}
          />
        </Animated.View>
      )}
      
      {showCoordinates && <ChessCoordinates isFlipped={isFlipped} />}
    </View>
  );
}