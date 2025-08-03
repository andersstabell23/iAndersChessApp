import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface EvaluationBarProps {
  evaluation: number; // Centipawn evaluation (positive = white advantage)
  height?: number;
}

export function EvaluationBar({ evaluation, height = 300 }: EvaluationBarProps) {
  const colorScheme = useColorScheme();

  // Convert centipawn evaluation to percentage (0-100)
  const getWhiteAdvantage = () => {
    const clampedEval = Math.max(-1000, Math.min(1000, evaluation));
    return 50 + (clampedEval / 20); // Scale to 0-100%
  };

  const whitePercentage = getWhiteAdvantage();
  const blackPercentage = 100 - whitePercentage;

  const getEvaluationText = () => {
    if (Math.abs(evaluation) < 50) return '0.00';
    if (evaluation > 0) return `+${(evaluation / 100).toFixed(2)}`;
    return (evaluation / 100).toFixed(2);
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginVertical: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 8,
    },
    barContainer: {
      width: 40,
      height: height,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: colorScheme === 'dark' ? '#666' : '#999',
    },
    whiteSection: {
      backgroundColor: '#f0f0f0',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    blackSection: {
      backgroundColor: '#333',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    evaluationText: {
      position: 'absolute',
      fontSize: 12,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#666' : '#ccc',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evaluation</Text>
      <View style={styles.barContainer}>
        <View style={[styles.blackSection, { height: `${blackPercentage}%` }]} />
        <View style={[styles.whiteSection, { height: `${whitePercentage}%` }]} />
      </View>
      <Text style={styles.evaluationText}>
        {getEvaluationText()}
      </Text>
    </View>
  );
}