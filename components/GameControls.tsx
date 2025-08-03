import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GameControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onResign: () => void;
  onDraw: () => void;
}

export function GameControls({ onUndo, onRedo, onResign, onDraw }: GameControlsProps) {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      minWidth: 60,
    },
    undoButton: {
      backgroundColor: '#4a90e2',
    },
    redoButton: {
      backgroundColor: '#4a90e2',
    },
    drawButton: {
      backgroundColor: '#f39c12',
    },
    resignButton: {
      backgroundColor: '#e74c3c',
    },
    buttonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.undoButton]} onPress={onUndo}>
        <Ionicons name="arrow-undo" size={20} color="white" />
        <Text style={styles.buttonText}>Undo</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.redoButton]} onPress={onRedo}>
        <Ionicons name="arrow-redo" size={20} color="white" />
        <Text style={styles.buttonText}>Redo</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.drawButton]} onPress={onDraw}>
        <Ionicons name="handshake" size={20} color="white" />
        <Text style={styles.buttonText}>Draw</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.resignButton]} onPress={onResign}>
        <Ionicons name="flag" size={20} color="white" />
        <Text style={styles.buttonText}>Resign</Text>
      </TouchableOpacity>
    </View>
  );
}