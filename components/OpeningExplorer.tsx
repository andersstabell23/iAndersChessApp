import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';

interface Opening {
  name: string;
  moves: string;
  description: string;
  frequency: number;
}

export function OpeningExplorer() {
  const colorScheme = useColorScheme();
  const [selectedOpening, setSelectedOpening] = useState<Opening | null>(null);

  const popularOpenings: Opening[] = [
    {
      name: "Italian Game",
      moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4",
      description: "Classical opening focusing on rapid development and central control.",
      frequency: 15.2
    },
    {
      name: "Ruy Lopez",
      moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5",
      description: "One of the oldest and most classical openings in chess.",
      frequency: 12.8
    },
    {
      name: "Sicilian Defense",
      moves: "1.e4 c5",
      description: "Sharp and aggressive defense popular at all levels.",
      frequency: 18.7
    },
    {
      name: "French Defense",
      moves: "1.e4 e6",
      description: "Solid positional defense leading to pawn structures.",
      frequency: 8.4
    },
    {
      name: "Queen's Gambit",
      moves: "1.d4 d5 2.c4",
      description: "Classical opening offering a pawn for rapid development.",
      frequency: 11.3
    },
    {
      name: "English Opening",
      moves: "1.c4",
      description: "Flexible opening allowing for various pawn structures.",
      frequency: 7.9
    },
    {
      name: "King's Indian Defense",
      moves: "1.d4 Nf6 2.c4 g6",
      description: "Hypermodern defense with dynamic counterplay.",
      frequency: 9.1
    },
    {
      name: "Caro-Kann Defense",
      moves: "1.e4 c6",
      description: "Solid and reliable defense with good piece activity.",
      frequency: 6.7
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    openingsList: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 12,
      marginBottom: 20,
    },
    listTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' ? '#444' : '#f0f0f0',
    },
    openingItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' ? '#444' : '#f0f0f0',
    },
    lastOpeningItem: {
      borderBottomWidth: 0,
    },
    selectedOpening: {
      backgroundColor: colorScheme === 'dark' ? '#4a4a4a' : '#f0f8ff',
    },
    openingName: {
      fontSize: 16,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 4,
    },
    openingMoves: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#4a90e2' : '#4a90e2',
      fontFamily: 'monospace',
      marginBottom: 4,
    },
    openingFrequency: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
    },
    openingDetails: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 12,
      padding: 16,
    },
    detailsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 12,
    },
    detailsDescription: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      lineHeight: 20,
      marginBottom: 12,
    },
    detailsMoves: {
      fontSize: 16,
      color: colorScheme === 'dark' ? '#4a90e2' : '#4a90e2',
      fontFamily: 'monospace',
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f8f9fa',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    statLabel: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.openingsList}>
        <Text style={styles.listTitle}>Popular Openings</Text>
        {popularOpenings.map((opening, index) => (
          <TouchableOpacity
            key={opening.name}
            style={[
              styles.openingItem,
              index === popularOpenings.length - 1 && styles.lastOpeningItem,
              selectedOpening?.name === opening.name && styles.selectedOpening,
            ]}
            onPress={() => setSelectedOpening(opening)}
          >
            <Text style={styles.openingName}>{opening.name}</Text>
            <Text style={styles.openingMoves}>{opening.moves}</Text>
            <Text style={styles.openingFrequency}>
              Frequency: {opening.frequency}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedOpening && (
        <View style={styles.openingDetails}>
          <Text style={styles.detailsTitle}>{selectedOpening.name}</Text>
          <Text style={styles.detailsDescription}>
            {selectedOpening.description}
          </Text>
          <Text style={styles.detailsMoves}>{selectedOpening.moves}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{selectedOpening.frequency}%</Text>
              <Text style={styles.statLabel}>Frequency</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {selectedOpening.moves.split(' ').length}
              </Text>
              <Text style={styles.statLabel}>Moves</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>★★★★☆</Text>
              <Text style={styles.statLabel}>Difficulty</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}