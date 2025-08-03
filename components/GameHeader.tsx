import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Color } from '@/types/chess';

interface GameHeaderProps {
  whiteTime: number;
  blackTime: number;
  activeColor: Color;
  isGameActive: boolean;
}

export function GameHeader({ whiteTime, blackTime, activeColor, isGameActive }: GameHeaderProps) {
  const colorScheme = useColorScheme();
  const [displayWhiteTime, setDisplayWhiteTime] = useState(whiteTime);
  const [displayBlackTime, setDisplayBlackTime] = useState(blackTime);

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

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    playerContainer: {
      alignItems: 'center',
      flex: 1,
    },
    activePlayer: {
      backgroundColor: colorScheme === 'dark' ? '#4a90e2' : '#4a90e2',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
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
      fontSize: 20,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    activeTime: {
      color: 'white',
    },
    lowTime: {
      color: '#ff4444',
    },
    turnIndicator: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 60,
    },
    turnText: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      marginBottom: 4,
    },
    turnDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: activeColor === 'white' ? '#fff' : '#000',
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.playerContainer, activeColor === 'black' && styles.activePlayer]}>
        <Text style={[styles.playerName, activeColor === 'black' && styles.activePlayerName]}>
          Black
        </Text>
        <Text style={[
          styles.time,
          activeColor === 'black' && styles.activeTime,
          displayBlackTime < 60 && styles.lowTime,
        ]}>
          {formatTime(displayBlackTime)}
        </Text>
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
          activeColor === 'white' && styles.activeTime,
          displayWhiteTime < 60 && styles.lowTime,
        ]}>
          {formatTime(displayWhiteTime)}
        </Text>
      </View>
    </View>
  );
}