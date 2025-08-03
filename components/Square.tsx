import React from 'react';
import { TouchableOpacity, StyleSheet, useColorScheme, Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 32, 400);
const SQUARE_SIZE = BOARD_SIZE / 8;

interface SquareProps {
  square: string;
  isLight: boolean;
  isSelected: boolean;
  isLastMove: boolean;
  isPossibleMove?: boolean;
  isHighlighted?: boolean;
  onPress: () => void;
  showCoordinates?: boolean;
  file: number;
  rank: number;
  children?: React.ReactNode;
}

export function Square({
  square,
  isLight,
  isSelected,
  isLastMove,
  isPossibleMove = false,
  isHighlighted = false,
  onPress,
  children,
}: SquareProps) {
  const colorScheme = useColorScheme();

  const getSquareColor = () => {
    if (isSelected) {
      return '#4a90e2';
    }
    if (isLastMove) {
      return colorScheme === 'dark' ? '#7a7a00' : '#ffff99';
    }
    if (isHighlighted) {
      return colorScheme === 'dark' ? '#8B0000' : '#FFB6C1';
    }
    if (isLight) {
      return colorScheme === 'dark' ? '#f0d9b5' : '#f0d9b5';
    }
    return colorScheme === 'dark' ? '#b58863' : '#b58863';
  };

  const styles = StyleSheet.create({
    square: {
      width: SQUARE_SIZE,
      height: SQUARE_SIZE,
      backgroundColor: getSquareColor(),
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    possibleMoveIndicator: {
      position: 'absolute',
      width: children ? SQUARE_SIZE * 0.3 : SQUARE_SIZE * 0.6,
      height: children ? SQUARE_SIZE * 0.3 : SQUARE_SIZE * 0.6,
      borderRadius: children ? SQUARE_SIZE * 0.15 : SQUARE_SIZE * 0.3,
      backgroundColor: children 
        ? 'rgba(74, 144, 226, 0.8)' 
        : 'rgba(74, 144, 226, 0.6)',
      borderWidth: children ? 3 : 0,
      borderColor: 'rgba(74, 144, 226, 0.9)',
    },
  });

  return (
    <TouchableOpacity style={styles.square} onPress={onPress} activeOpacity={0.8}>
      {children}
      {isPossibleMove && (
        <View style={styles.possibleMoveIndicator} />
      )}
    </TouchableOpacity>
  );
}