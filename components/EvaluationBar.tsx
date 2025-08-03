import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface EvaluationBarProps {
  evaluation: number; // Centipawn evaluation (positive = white advantage)
  height?: number;
  showNumeric?: boolean;
}

export function EvaluationBar({ evaluation, height = 300, showNumeric = true }: EvaluationBarProps) {
  const colorScheme = useColorScheme();

  // Convert centipawn evaluation to percentage (0-100)
  const getWhiteAdvantage = () => {
    const clampedEval = Math.max(-1500, Math.min(1500, evaluation));
    return 50 + (clampedEval / 30); // Scale to 0-100%
  };

  const whitePercentage = Math.max(5, Math.min(95, getWhiteAdvantage()));
  const blackPercentage = 100 - whitePercentage;

  const getEvaluationText = () => {
    if (Math.abs(evaluation) < 25) return '0.00';
    if (Math.abs(evaluation) > 1000) {
      return evaluation > 0 ? '+M' : '-M';
    }
    if (evaluation > 0) return `+${(evaluation / 100).toFixed(2)}`;
    return (evaluation / 100).toFixed(2);
  };

  const getEvaluationColor = () => {
    if (Math.abs(evaluation) > 500) return evaluation > 0 ? '#4CAF50' : '#f44336';
    if (Math.abs(evaluation) > 200) return evaluation > 0 ? '#8BC34A' : '#FF9800';
    return colorScheme === 'dark' ? '#fff' : '#000';
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
      width: 50,
      height: height,
      borderRadius: 25,
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: colorScheme === 'dark' ? '#666' : '#999',
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f0f0f0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    blackSection: {
      backgroundColor: '#333',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
    },
    whiteSection: {
      backgroundColor: '#f0f0f0',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomLeftRadius: 22,
      borderBottomRightRadius: 22,
    },
    evaluationText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: getEvaluationColor(),
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colorScheme === 'dark' ? '#666' : '#ccc',
      marginTop: 8,
      minWidth: 60,
      textAlign: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    advantageIndicator: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      marginTop: 4,
      textAlign: 'center',
    },
  });

  const getAdvantageText = () => {
    if (Math.abs(evaluation) < 25) return 'Equal';
    if (Math.abs(evaluation) > 1000) return evaluation > 0 ? 'White Winning' : 'Black Winning';
    if (Math.abs(evaluation) > 300) return evaluation > 0 ? 'White Better' : 'Black Better';
    return evaluation > 0 ? 'White Slightly Better' : 'Black Slightly Better';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evaluation</Text>
      <View style={styles.barContainer}>
        <View style={[styles.blackSection, { height: `${blackPercentage}%` }]} />
        <View style={[styles.whiteSection, { height: `${whitePercentage}%` }]} />
      </View>
      {showNumeric && (
        <>
          <Text style={styles.evaluationText}>
            {getEvaluationText()}
          </Text>
          <Text style={styles.advantageIndicator}>
            {getAdvantageText()}
          </Text>
        </>
      )}
    </View>
  );
}