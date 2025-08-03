import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChessBoard } from '@/components/ChessBoard';
import { TacticsEngine } from '@/utils/TacticsEngine';
import { Puzzle } from '@/types/chess';

export default function TacticsScreen() {
  const colorScheme = useColorScheme();
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [puzzleProgress, setPuzzleProgress] = useState(0);
  const [totalPuzzles, setTotalPuzzles] = useState(0);
  const [rating, setRating] = useState(1200);
  const [streak, setStreak] = useState(0);

  const tacticsEngine = new TacticsEngine();

  useEffect(() => {
    loadNextPuzzle();
  }, []);

  const loadNextPuzzle = () => {
    const puzzle = tacticsEngine.getNextPuzzle(rating);
    setCurrentPuzzle(puzzle);
    setTotalPuzzles(tacticsEngine.getTotalPuzzles());
  };

  const handleMove = (from: string, to: string, promotion?: string) => {
    if (!currentPuzzle) return;

    const isCorrect = tacticsEngine.checkSolution(currentPuzzle, from, to, promotion);
    
    if (isCorrect) {
      setStreak(streak + 1);
      setRating(rating + 20);
      setPuzzleProgress(puzzleProgress + 1);
      
      Alert.alert(
        'Correct!',
        `Great move! Your rating increased to ${rating + 20}`,
        [{ text: 'Next Puzzle', onPress: loadNextPuzzle }]
      );
    } else {
      setStreak(0);
      setRating(Math.max(800, rating - 10));
      
      Alert.alert(
        'Incorrect',
        'Try again or skip to see the solution.',
        [
          { text: 'Try Again', style: 'cancel' },
          { text: 'Show Solution', onPress: showSolution },
        ]
      );
    }
  };

  const showSolution = () => {
    if (currentPuzzle) {
      Alert.alert(
        'Solution',
        `The correct move is: ${currentPuzzle.solution}`,
        [{ text: 'Next Puzzle', onPress: loadNextPuzzle }]
      );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f8f9fa',
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' ? '#333' : '#e5e5e5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      textAlign: 'center',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
      padding: 16,
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 12,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    statLabel: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      marginTop: 4,
    },
    boardContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    puzzleInfo: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
    },
    puzzleTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 8,
    },
    puzzleDescription: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      lineHeight: 20,
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    button: {
      backgroundColor: '#4a90e2',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      minWidth: 100,
    },
    skipButton: {
      backgroundColor: colorScheme === 'dark' ? '#666' : '#999',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tactics Trainer</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{puzzleProgress}</Text>
            <Text style={styles.statLabel}>Solved</Text>
          </View>
        </View>

        {currentPuzzle && (
          <>
            <View style={styles.puzzleInfo}>
              <Text style={styles.puzzleTitle}>
                {currentPuzzle.theme} • Rating: {currentPuzzle.rating}
              </Text>
              <Text style={styles.puzzleDescription}>
                {currentPuzzle.description}
              </Text>
            </View>

            <View style={styles.boardContainer}>
              <ChessBoard
                position={currentPuzzle.fen}
                onMove={handleMove}
                activeColor={currentPuzzle.sideToMove}
                isFlipped={currentPuzzle.sideToMove === 'black'}
                showCoordinates={true}
              />
            </View>

            <View style={styles.controlsContainer}>
              <TouchableOpacity style={styles.button} onPress={showSolution}>
                <Text style={styles.buttonText}>Hint</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={loadNextPuzzle}>
                <Text style={styles.buttonText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}