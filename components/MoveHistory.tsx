import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { Move } from '@/types/chess';

interface MoveHistoryProps {
  moves: Move[];
  currentMoveIndex?: number;
}

export function MoveHistory({ moves, currentMoveIndex }: MoveHistoryProps) {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 12,
      padding: 16,
      maxHeight: 200,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 12,
    },
    movesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    moveNumber: {
      fontSize: 14,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      marginRight: 8,
    },
    move: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginRight: 12,
      marginBottom: 4,
      fontFamily: 'monospace',
    },
    currentMove: {
      backgroundColor: '#4a90e2',
      color: 'white',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    emptyText: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#888' : '#999',
      fontStyle: 'italic',
    },
  });

  if (moves.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Move History</Text>
        <Text style={styles.emptyText}>No moves yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Move History</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.movesContainer}>
          {moves.map((move, index) => {
            const moveNumber = Math.floor(index / 2) + 1;
            const isWhiteMove = index % 2 === 0;
            const isCurrent = currentMoveIndex === index;
            
            return (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                {isWhiteMove && (
                  <Text style={styles.moveNumber}>{moveNumber}.</Text>
                )}
                <Text style={[styles.move, isCurrent && styles.currentMove]}>
                  {move.san}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}