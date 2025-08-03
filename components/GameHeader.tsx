import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Color } from '@/types/chess';

interface GameHeaderProps {
  whiteTime: number;
  blackTime: number;
  activeColor: Color;
  isGameActive: boolean;
  onPause?: () => void;
  onFlipBoard?: () => void;
  gameMode?: string;
}

export function GameHeader({ 
  whiteTime, 
  blackTime, 
  activeColor, 
  isGameActive,
  onPause,
  onFlipBoard,
  gameMode = 'Local'
}: GameHeaderProps) {
  const colorScheme = useColorScheme();
  const [displayWhiteTime, setDisplayWhiteTime] = useState(whiteTime);
  const [displayBlackTime, setDisplayBlackTime] = useState(blackTime);

  useEffect(() => {
    setDisplayWhiteTime(whiteTime);
    setDisplayBlackTime(blackTime);
  }, [whiteTime, blackTime]);

  useEffect(() => {
    if (!isGameActive) return;

    const interval = setInterval(() => {
      if (activeColor === 'white') {
        setDisplayWhiteTime(prev => Math.max(0, prev - 1));
      } else {
        setDisplayBlackTime(prev => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeColor, isGameActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (time: number, isActive: boolean) => {
    if (time < 30) return '#ff4444';
    if (time < 60) return '#ff8800';
    if (isActive) return 'white';
    return colorScheme === 'dark' ? '#fff' : '#000';
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    gameMode: {
      fontSize: 14,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#4a90e2' : '#4a90e2',
    },
    controls: {
      flexDirection: 'row',
      gap: 12,
    },
    controlButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colorScheme === 'dark' ? '#3a3a3a' : '#f0f0f0',
    },
    playersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    playerContainer: {
      alignItems: 'center',
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    activePlayer: {
      backgroundColor: '#4a90e2',
      shadowColor: '#4a90e2',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    playerName: {
      fontSize: 16,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 4,
    },
    activePlayerName: {
      color: 'white',
    },
    time: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'monospace',
    },
    turnIndicator: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 80,
      paddingVertical: 8,
    },
    turnText: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      marginBottom: 6,
      fontWeight: '500',
    },
    turnDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: activeColor === 'white' ? '#fff' : '#333',
      borderWidth: 2,
      borderColor: activeColor === 'white' ? '#333' : '#fff',
    },
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.gameMode}>{gameMode} Game</Text>
        <View style={styles.controls}>
          {onPause && (
            <TouchableOpacity style={styles.controlButton} onPress={onPause}>
              <Ionicons 
                name={isGameActive ? "pause" : "play"} 
                size={20} 
                color={colorScheme === 'dark' ? '#fff' : '#000'} 
              />
            </TouchableOpacity>
          )}
          {onFlipBoard && (
            <TouchableOpacity style={styles.controlButton} onPress={onFlipBoard}>
              <Ionicons 
                name="swap-vertical" 
                size={20} 
                color={colorScheme === 'dark' ? '#fff' : '#000'} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.playersContainer}>
        <View style={[styles.playerContainer, activeColor === 'black' && styles.activePlayer]}>
          <Text style={[styles.playerName, activeColor === 'black' && styles.activePlayerName]}>
            Black
          </Text>
          <Text style={[
            styles.time,
            { color: getTimeColor(displayBlackTime, activeColor === 'black') }
          ]}>
            {formatTime(displayBlackTime)}
          </Text>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: isGameActive ? '#4CAF50' : '#FFC107' }
            ]} />
            <Text style={[styles.statusText, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
              {isGameActive ? 'Playing' : 'Waiting'}
            </Text>
          </View>
        </View>
        
        <View style={styles.turnIndicator}>
          <Text style={styles.turnText}>Turn</Text>
          <View style={styles.turnDot} />
        </View>
        
        <View style={[styles.playerContainer, activeColor === 'white' && styles.activePlayer]}>
          <Text style={[styles.playerName, activeColor === 'white' && styles.activePlayerName]}>
            White
          </Text>
          <Text style={[
            styles.time,
            { color: getTimeColor(displayWhiteTime, activeColor === 'white') }
          ]}>
            {formatTime(displayWhiteTime)}
          </Text>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: isGameActive ? '#4CAF50' : '#FFC107' }
            ]} />
            <Text style={[styles.statusText, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
              {isGameActive ? 'Playing' : 'Waiting'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}