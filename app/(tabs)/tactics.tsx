import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tacticsEngine = new TacticsEngine();

  useEffect(() => {
    loadNextPuzzle();
  }, []);

  const loadNextPuzzle = () => {
    setIsLoading(true);
    setTimeout(() => {
      const puzzle = tacticsEngine.getNextPuzzle(rating);
      setCurrentPuzzle(puzzle);
      setTotalPuzzles(tacticsEngine.getTotalPuzzles());
      setAttempts(0);
      setShowHint(false);
      setIsLoading(false);
    }, 500);
  };

  const handleMove = (from: string, to: string, promotion?: string) => {
    if (!currentPuzzle || isLoading) return;

    const isCorrect = tacticsEngine.checkSolution(currentPuzzle, from, to, promotion);
    setAttempts(attempts + 1);
    
    if (isCorrect) {
      const ratingGain = Math.max(5, 25 - attempts * 5);
      setStreak(streak + 1);
      setRating(rating + ratingGain);
      setPuzzleProgress(puzzleProgress + 1);
      
      Alert.alert(
        '🎉 Correct!',
        `Excellent move! Rating +${ratingGain} (${rating + ratingGain})`,
        [{ text: 'Next Puzzle', onPress: loadNextPuzzle }]
      );
    } else {
      if (attempts >= 2) {
        setStreak(0);
        setRating(Math.max(800, rating - 10));
        
        Alert.alert(
          '❌ Incorrect',
          'Too many attempts. Here\'s the solution.',
          [{ text: 'Show Solution', onPress: showSolution }]
        );
      } else {
        Alert.alert(
          '❌ Try Again',
          `Not quite right. ${2 - attempts} attempt${2 - attempts === 1 ? '' : 's'} remaining.`,
          [
            { text: 'Try Again', style: 'cancel' },
            { text: 'Hint', onPress: () => setShowHint(true) },
          ]
        );
      }
    }
  };

  const showSolution = () => {
    if (currentPuzzle) {
      Alert.alert(
        '💡 Solution',
        `The correct move is: ${currentPuzzle.solution}\n\n${currentPuzzle.description}`,
        [{ text: 'Next Puzzle', onPress: loadNextPuzzle }]
      );
    }
  };

  const handleHint = () => {
    if (currentPuzzle) {
      setShowHint(true);
      Alert.alert(
        '💡 Hint',
        `Look for a ${currentPuzzle.theme.toLowerCase()} tactic. The key piece is involved in the solution.`
      );
    }
  };

  const getDifficultyColor = (puzzleRating: number) => {
    if (puzzleRating < 1000) return '#4CAF50';
    if (puzzleRating < 1300) return '#FFC107';
    if (puzzleRating < 1600) return '#FF9800';
    return '#f44336';
  };

  const getDifficultyText = (puzzleRating: number) => {
    if (puzzleRating < 1000) return 'Beginner';
    if (puzzleRating < 1300) return 'Intermediate';
    if (puzzleRating < 1600) return 'Advanced';
    return 'Expert';
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
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
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
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    statLabel: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      marginTop: 4,
      fontWeight: '500',
    },
    ratingValue: {
      color: '#4a90e2',
    },
    streakValue: {
      color: streak > 0 ? '#4CAF50' : (colorScheme === 'dark' ? '#fff' : '#000'),
    },
    boardContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    puzzleInfo: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      padding: 16,
      borderRadius: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    puzzleHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    puzzleTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    difficultyBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: currentPuzzle ? getDifficultyColor(currentPuzzle.rating) : '#ccc',
    },
    difficultyText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
    },
    puzzleDescription: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      lineHeight: 20,
      marginBottom: 8,
    },
    puzzleRating: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#4a90e2' : '#4a90e2',
      fontWeight: '600',
    },
    hintContainer: {
      backgroundColor: colorScheme === 'dark' ? '#2a4a2a' : '#e8f5e8',
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#4CAF50',
    },
    hintText: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#90EE90' : '#2E7D32',
      fontStyle: 'italic',
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    hintButton: {
      backgroundColor: '#f39c12',
    },
    skipButton: {
      backgroundColor: colorScheme === 'dark' ? '#666' : '#95a5a6',
    },
    solutionButton: {
      backgroundColor: '#9b59b6',
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    loadingText: {
      fontSize: 16,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      marginTop: 12,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tactics Trainer</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass" size={48} color={colorScheme === 'dark' ? '#ccc' : '#666'} />
          <Text style={styles.loadingText}>Loading next puzzle...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tactics Trainer</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.ratingValue]}>{rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.streakValue]}>{streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{puzzleProgress}</Text>
            <Text style={styles.statLabel}>Solved</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{attempts}</Text>
            <Text style={styles.statLabel}>Attempts</Text>
          </View>
        </View>

        {currentPuzzle && (
          <>
            <View style={styles.puzzleInfo}>
              <View style={styles.puzzleHeader}>
                <Text style={styles.puzzleTitle}>
                  {currentPuzzle.theme}
                </Text>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>
                    {getDifficultyText(currentPuzzle.rating)}
                  </Text>
                </View>
              </View>
              <Text style={styles.puzzleDescription}>
                {currentPuzzle.description}
              </Text>
              <Text style={styles.puzzleRating}>
                Puzzle Rating: {currentPuzzle.rating}
              </Text>
              
              {showHint && (
                <View style={styles.hintContainer}>
                  <Text style={styles.hintText}>
                    💡 Look for a {currentPuzzle.theme.toLowerCase()} tactic. 
                    Focus on {currentPuzzle.sideToMove} pieces that can create threats.
                  </Text>
                </View>
              )}
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
              <TouchableOpacity style={[styles.button, styles.hintButton]} onPress={handleHint}>
                <Ionicons name="bulb" size={18} color="white" />
                <Text style={styles.buttonText}>Hint</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.button, styles.solutionButton]} onPress={showSolution}>
                <Ionicons name="eye" size={18} color="white" />
                <Text style={styles.buttonText}>Solution</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={loadNextPuzzle}>
                <Ionicons name="play-forward" size={18} color="white" />
                <Text style={styles.buttonText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}