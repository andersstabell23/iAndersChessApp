import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChessBoard } from '@/components/ChessBoard';
import { GameHeader } from '@/components/GameHeader';
import { GameControls } from '@/components/GameControls';
import { MoveHistory } from '@/components/MoveHistory';
import { ChessEngine } from '@/utils/ChessEngine';
import { GameState, GameMode, TimeControl } from '@/types/chess';

const { width } = Dimensions.get('window');

export default function PlayScreen() {
  const colorScheme = useColorScheme();
  const [gameState, setGameState] = useState<GameState>(() => new ChessEngine().getState());
  const [gameMode, setGameMode] = useState<GameMode>('local');
  const [timeControl, setTimeControl] = useState<TimeControl>({ minutes: 10, increment: 0 });
  const [whiteTime, setWhiteTime] = useState(timeControl.minutes * 60);
  const [blackTime, setBlackTime] = useState(timeControl.minutes * 60);
  const [isGameActive, setIsGameActive] = useState(false);

  const engine = new ChessEngine();

  const startNewGame = () => {
    const newGame = new ChessEngine();
    setGameState(newGame.getState());
    setWhiteTime(timeControl.minutes * 60);
    setBlackTime(timeControl.minutes * 60);
    setIsGameActive(true);
  };

  const handleMove = (from: string, to: string, promotion?: string) => {
    try {
      engine.loadState(gameState);
      const moveResult = engine.makeMove(from, to, promotion);
      
      if (moveResult.success) {
        setGameState(engine.getState());
        
        // Check for game end
        if (moveResult.isCheckmate) {
          setIsGameActive(false);
          Alert.alert('Game Over', `${gameState.activeColor === 'white' ? 'Black' : 'White'} wins by checkmate!`);
        } else if (moveResult.isStalemate) {
          setIsGameActive(false);
          Alert.alert('Game Over', 'Draw by stalemate!');
        }
      }
    } catch (error) {
      console.error('Move error:', error);
    }
  };

  const showGameModeSelector = () => {
    Alert.alert(
      'Select Game Mode',
      '',
      [
        { text: 'Local 2-Player', onPress: () => setGameMode('local') },
        { text: 'vs Computer', onPress: () => setGameMode('ai') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f8f9fa',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    boardContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    sidePanel: {
      flex: 1,
      marginTop: 20,
    },
    newGameButton: {
      backgroundColor: '#4a90e2',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    newGameText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    gameModeButton: {
      backgroundColor: colorScheme === 'dark' ? '#333' : '#e5e5e5',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
      marginBottom: 12,
    },
    gameModeText: {
      color: colorScheme === 'dark' ? '#fff' : '#000',
      fontSize: 14,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <GameHeader
          whiteTime={whiteTime}
          blackTime={blackTime}
          activeColor={gameState.activeColor}
          isGameActive={isGameActive}
        />
        
        <View style={styles.boardContainer}>
          <ChessBoard
            position={gameState.board}
            onMove={handleMove}
            activeColor={gameState.activeColor}
            lastMove={gameState.moveHistory[gameState.moveHistory.length - 1]}
            isFlipped={false}
          />
        </View>

        <TouchableOpacity style={styles.newGameButton} onPress={startNewGame}>
          <Text style={styles.newGameText}>New Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gameModeButton} onPress={showGameModeSelector}>
          <Text style={styles.gameModeText}>
            Mode: {gameMode === 'local' ? 'Local 2-Player' : 'vs Computer'}
          </Text>
        </TouchableOpacity>

        <View style={styles.sidePanel}>
          <MoveHistory moves={gameState.moveHistory} />
          <GameControls
            onUndo={() => {}}
            onRedo={() => {}}
            onResign={() => setIsGameActive(false)}
            onDraw={() => {}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}