import React from 'react';
import { TouchableOpacity, StyleSheet, useColorScheme, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 32, 400);
const SQUARE_SIZE = BOARD_SIZE / 8;

interface SquareProps {
  square: string;
  isLight: boolean;
  isSelected: boolean;
  isLastMove: boolean;
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
  onPress,
  children,
}: SquareProps) {
  const colorScheme = useColorScheme();

  const getSquareColor = () => {
    if (isSelected) {
      return '#4a90e2';
    }
    if (isLastMove) {
      return colorScheme === 'dark' ? '#5a5a00' : '#ffff99';
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
    },
  });

  return (
    <TouchableOpacity style={styles.square} onPress={onPress} activeOpacity={0.8}>
      {children}
    </TouchableOpacity>
  );
}