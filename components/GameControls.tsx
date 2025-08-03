import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GameControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onResign: () => void;
  onDraw: () => void;
  onAnalyze?: () => void;
  onSave?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function GameControls({ 
  onUndo, 
  onRedo, 
  onResign, 
  onDraw,
  onAnalyze,
  onSave,
  canUndo = true,
  canRedo = true
}: GameControlsProps) {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 12,
      textAlign: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      gap: 8,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      minWidth: 70,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    undoButton: {
      backgroundColor: '#4a90e2',
    },
    redoButton: {
      backgroundColor: '#4a90e2',
    },
    analyzeButton: {
      backgroundColor: '#9b59b6',
    },
    saveButton: {
      backgroundColor: '#27ae60',
    },
    drawButton: {
      backgroundColor: '#f39c12',
    },
    resignButton: {
      backgroundColor: '#e74c3c',
    },
    disabledButton: {
      backgroundColor: colorScheme === 'dark' ? '#444' : '#ccc',
      opacity: 0.5,
    },
    buttonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
      marginTop: 4,
    },
    disabledText: {
      color: colorScheme === 'dark' ? '#888' : '#999',
    },
  });

  const Button = ({ 
    onPress, 
    icon, 
    text, 
    style, 
    disabled = false 
  }: {
    onPress: () => void;
    icon: string;
    text: string;
    style: any;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons 
        name={icon as any} 
        size={20} 
        color={disabled ? (colorScheme === 'dark' ? '#888' : '#999') : 'white'} 
      />
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Controls</Text>
      
      <View style={styles.buttonsContainer}>
        <Button
          onPress={onUndo}
          icon="arrow-undo"
          text="Undo"
          style={styles.undoButton}
          disabled={!canUndo}
        />
        
        <Button
          onPress={onRedo}
          icon="arrow-redo"
          text="Redo"
          style={styles.redoButton}
          disabled={!canRedo}
        />
        
        {onAnalyze && (
          <Button
            onPress={onAnalyze}
            icon="analytics"
            text="Analyze"
            style={styles.analyzeButton}
          />
        )}
        
        {onSave && (
          <Button
            onPress={onSave}
            icon="save"
            text="Save"
            style={styles.saveButton}
          />
        )}
        
        <Button
          onPress={onDraw}
          icon="handshake"
          text="Draw"
          style={styles.drawButton}
        />
        
        <Button
          onPress={onResign}
          icon="flag"
          text="Resign"
          style={styles.resignButton}
        />
      </View>
    </View>
  );
}