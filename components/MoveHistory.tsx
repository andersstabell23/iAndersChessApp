import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { Move } from '@/types/chess';

interface MoveHistoryProps {
  moves: Move[];
  currentMoveIndex?: number;
  onMoveSelect?: (index: number) => void;
}

export function MoveHistory({ moves, currentMoveIndex, onMoveSelect }: MoveHistoryProps) {
  const colorScheme = useColorScheme();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (moves.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [moves.length]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 12,
      padding: 16,
      maxHeight: 200,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    moveCount: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      backgroundColor: colorScheme === 'dark' ? '#3a3a3a' : '#f0f0f0',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    movesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    moveRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    moveNumber: {
      fontSize: 14,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#4a90e2' : '#4a90e2',
      marginRight: 8,
      minWidth: 24,
    },
    moveButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginRight: 8,
      minWidth: 50,
      alignItems: 'center',
    },
    move: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#fff' : '#000',
      fontFamily: 'monospace',
      fontWeight: '500',
    },
    currentMove: {
      backgroundColor: '#4a90e2',
    },
    currentMoveText: {
      color: 'white',
    },
    captureMove: {
      backgroundColor: colorScheme === 'dark' ? '#4a2a2a' : '#ffe6e6',
    },
    checkMove: {
      backgroundColor: colorScheme === 'dark' ? '#4a4a2a' : '#fff3cd',
    },
    emptyText: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#888' : '#999',
      fontStyle: 'italic',
      textAlign: 'center',
      paddingVertical: 20,
    },
  });

  if (moves.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Move History</Text>
          <Text style={styles.moveCount}>0 moves</Text>
        </View>
        <Text style={styles.emptyText}>No moves yet</Text>
      </View>
    );
  }

  const groupedMoves: Array<{ number: number; white?: Move; black?: Move; whiteIndex?: number; blackIndex?: number }> = [];
  
  for (let i = 0; i < moves.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    groupedMoves.push({
      number: moveNumber,
      white: moves[i],
      black: moves[i + 1],
      whiteIndex: i,
      blackIndex: i + 1,
    });
  }

  const getMoveStyle = (move: Move, index: number) => {
    const styles = [styles.moveButton];
    
    if (currentMoveIndex === index) {
      styles.push(styles.currentMove);
    }
    
    if (move.captured) {
      styles.push(styles.captureMove);
    }
    
    if (move.san.includes('+') || move.san.includes('#')) {
      styles.push(styles.checkMove);
    }
    
    return styles;
  };

  const getMoveTextStyle = (index: number) => {
    return [
      styles.move,
      currentMoveIndex === index && styles.currentMoveText
    ];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Move History</Text>
        <Text style={styles.moveCount}>{moves.length} moves</Text>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {groupedMoves.map((group) => (
          <View key={group.number} style={styles.moveRow}>
            <Text style={styles.moveNumber}>{group.number}.</Text>
            
            {group.white && (
              <TouchableOpacity
                style={getMoveStyle(group.white, group.whiteIndex!)}
                onPress={() => onMoveSelect?.(group.whiteIndex!)}
              >
                <Text style={getMoveTextStyle(group.whiteIndex!)}>
                  {group.white.san}
                </Text>
              </TouchableOpacity>
            )}
            
            {group.black && (
              <TouchableOpacity
                style={getMoveStyle(group.black, group.blackIndex!)}
                onPress={() => onMoveSelect?.(group.blackIndex!)}
              >
                <Text style={getMoveTextStyle(group.blackIndex!)}>
                  {group.black.san}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}