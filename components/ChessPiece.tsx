import React from 'react';
import { Text, StyleSheet, useColorScheme } from 'react-native';
import { PieceType, Color } from '@/types/chess';

interface ChessPieceProps {
  type: PieceType;
  color: Color;
  size?: number;
}

export function ChessPiece({ type, color, size = 36 }: ChessPieceProps) {
  const colorScheme = useColorScheme();

  const getPieceSymbol = () => {
    const pieces = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙',
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟',
      },
    };
    
    return pieces[color][type];
  };

  const styles = StyleSheet.create({
    piece: {
      fontSize: size,
      textAlign: 'center',
      textShadowColor: colorScheme === 'dark' ? '#000' : '#666',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
  });

  return <Text style={styles.piece}>{getPieceSymbol()}</Text>;
}