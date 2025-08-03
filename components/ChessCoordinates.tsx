import React from 'react';
import { View, Text, StyleSheet, useColorScheme, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 32, 400);
const SQUARE_SIZE = BOARD_SIZE / 8;

interface ChessCoordinatesProps {
  isFlipped: boolean;
}

export function ChessCoordinates({ isFlipped }: ChessCoordinatesProps) {
  const colorScheme = useColorScheme();

  const files = isFlipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = isFlipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];

  const styles = StyleSheet.create({
    filesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 4,
    },
    ranksContainer: {
      position: 'absolute',
      left: -20,
      top: 0,
      height: BOARD_SIZE,
      justifyContent: 'space-around',
    },
    coordinate: {
      fontSize: 12,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#ccc' : '#666',
    },
    fileCoordinate: {
      width: SQUARE_SIZE,
      textAlign: 'center',
    },
  });

  return (
    <>
      <View style={styles.ranksContainer}>
        {ranks.map((rank) => (
          <Text key={rank} style={styles.coordinate}>
            {rank}
          </Text>
        ))}
      </View>
      
      <View style={styles.filesContainer}>
        {files.map((file) => (
          <Text key={file} style={[styles.coordinate, styles.fileCoordinate]}>
            {file}
          </Text>
        ))}
      </View>
    </>
  );
}