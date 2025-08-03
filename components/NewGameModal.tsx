import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameMode, TimeControl } from '@/types/chess';

interface NewGameModalProps {
  visible: boolean;
  onClose: () => void;
  onStartGame: (mode: GameMode, timeControl: TimeControl) => void;
}

export function NewGameModal({ visible, onClose, onStartGame }: NewGameModalProps) {
  const colorScheme = useColorScheme();
  const [selectedMode, setSelectedMode] = useState<GameMode>('local');
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControl>({ minutes: 10, increment: 0 });

  const gameModes = [
    { key: 'local', title: 'Local 2-Player', description: 'Play with a friend on the same device', icon: 'people' },
    { key: 'ai', title: 'vs Computer', description: 'Play against AI opponent', icon: 'hardware-chip' },
  ];

  const timeControls = [
    { minutes: 1, increment: 0, name: 'Bullet', description: '1 minute' },
    { minutes: 3, increment: 0, name: 'Blitz', description: '3 minutes' },
    { minutes: 5, increment: 0, name: 'Blitz', description: '5 minutes' },
    { minutes: 10, increment: 0, name: 'Rapid', description: '10 minutes' },
    { minutes: 15, increment: 10, name: 'Rapid', description: '15+10' },
    { minutes: 30, increment: 0, name: 'Classical', description: '30 minutes' },
  ];

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 20,
      padding: 24,
      margin: 20,
      maxHeight: '80%',
      width: '90%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    closeButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colorScheme === 'dark' ? '#3a3a3a' : '#f0f0f0',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 12,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedOption: {
      borderColor: '#4a90e2',
      backgroundColor: colorScheme === 'dark' ? '#1a3a5a' : '#e6f3ff',
    },
    unselectedOption: {
      backgroundColor: colorScheme === 'dark' ? '#3a3a3a' : '#f8f9fa',
    },
    optionIcon: {
      marginRight: 12,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 2,
    },
    optionDescription: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
    },
    timeControlGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    timeControlButton: {
      width: '48%',
      padding: 12,
      borderRadius: 10,
      marginBottom: 8,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedTimeControl: {
      borderColor: '#4a90e2',
      backgroundColor: colorScheme === 'dark' ? '#1a3a5a' : '#e6f3ff',
    },
    unselectedTimeControl: {
      backgroundColor: colorScheme === 'dark' ? '#3a3a3a' : '#f8f9fa',
    },
    timeControlName: {
      fontSize: 14,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 2,
    },
    timeControlDescription: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
    },
    startButton: {
      backgroundColor: '#4a90e2',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#4a90e2',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    startButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>New Game</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Game Mode</Text>
              {gameModes.map((mode) => (
                <TouchableOpacity
                  key={mode.key}
                  style={[
                    styles.optionButton,
                    selectedMode === mode.key ? styles.selectedOption : styles.unselectedOption,
                  ]}
                  onPress={() => setSelectedMode(mode.key as GameMode)}
                >
                  <Ionicons
                    name={mode.icon as any}
                    size={24}
                    color={selectedMode === mode.key ? '#4a90e2' : (colorScheme === 'dark' ? '#ccc' : '#666')}
                    style={styles.optionIcon}
                  />
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{mode.title}</Text>
                    <Text style={styles.optionDescription}>{mode.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Time Control</Text>
              <View style={styles.timeControlGrid}>
                {timeControls.map((tc) => (
                  <TouchableOpacity
                    key={`${tc.minutes}-${tc.increment}`}
                    style={[
                      styles.timeControlButton,
                      selectedTimeControl.minutes === tc.minutes && selectedTimeControl.increment === tc.increment
                        ? styles.selectedTimeControl
                        : styles.unselectedTimeControl,
                    ]}
                    onPress={() => setSelectedTimeControl(tc)}
                  >
                    <Text style={styles.timeControlName}>{tc.name}</Text>
                    <Text style={styles.timeControlDescription}>{tc.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => onStartGame(selectedMode, selectedTimeControl)}
            >
              <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}