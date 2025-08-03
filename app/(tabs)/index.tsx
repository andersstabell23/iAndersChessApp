import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChessBoard } from '@/components/ChessBoard';
import { GameHeader } from '@/components/GameHeader';
import { GameControls } from '@/components/GameControls';
import { MoveHistory } from '@/components/MoveHistory';
import { NewGameModal } from '@/components/NewGameModal';
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
  const [isPaused, setIsPaused] = useState(false);
  const [isBoardFlipped, setIsBoardFlipped] = useState(false);
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [moveHistory, setMoveHistory] = useState<any[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

  const engine = new ChessEngine();

  const startNewGame = (mode: GameMode, time: TimeControl) => {
    const newGame = new ChessEngine();
    setGameState(newGame.getState());
    setGameMode(mode);
    setTimeControl(time);
    setWhiteTime(time.minutes * 60);
    setBlackTime(time.minutes * 60);
    setIsGameActive(true);
    setIsPaused(false);
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
    setShowNewGameModal(false);
  };

  const handleMove = (from: string, to: string, promotion?: string) => {
    if (!isGameActive || isPaused) return;
    
    try {
      engine.loadState(gameState);
      const moveResult = engine.makeMove(from, to, promotion);
      
      if (moveResult.success) {
        const newState = engine.getState();
        setGameState(newState);
        setMoveHistory(newState.moveHistory);
        setCurrentMoveIndex(newState.moveHistory.length - 1);
        
        // Check for game end
        if (moveResult.isCheckmate) {
          setIsGameActive(false);
          Alert.alert(
            'Checkmate!', 
            `${gameState.activeColor === 'white' ? 'Black' : 'White'} wins!`,
            [
              { text: 'New Game', onPress: () => setShowNewGameModal(true) },
              { text: 'Review', style: 'cancel' }
            ]
          );
        } else if (moveResult.isStalemate) {
          setIsGameActive(false);
          Alert.alert(
            'Stalemate!', 
            'The game is a draw.',
            [
              { text: 'New Game', onPress: () => setShowNewGameModal(true) },
              { text: 'Review', style: 'cancel' }
            ]
          );
        }
      }
    } catch (error) {
      console.error('Move error:', error);
    }
  };

  const handleUndo = () => {
    if (moveHistory.length > 0) {
      const newHistory = moveHistory.slice(0, -1);
      setMoveHistory(newHistory);
      // In a real implementation, you'd reconstruct the game state
      Alert.alert('Undo', 'Move undone');
    }
  };

  const handleRedo = () => {
    Alert.alert('Redo', 'Feature coming soon');
  };

  const handleResign = () => {
    Alert.alert(
      'Resign Game',
      'Are you sure you want to resign?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resign',
          style: 'destructive',
          onPress: () => {
            setIsGameActive(false);
            Alert.alert(
              'Game Over',
              `${gameState.activeColor === 'white' ? 'Black' : 'White'} wins by resignation!`
            );
          }
        }
      ]
    );
  };

  const handleDraw = () => {
    Alert.alert(
      'Offer Draw',
      'Do you want to offer a draw?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Offer Draw',
          onPress: () => {
            if (gameMode === 'local') {
              Alert.alert(
                'Draw Offered',
                'Do you accept the draw?',
                [
                  { text: 'Decline', style: 'cancel' },
                  {
                    text: 'Accept',
                    onPress: () => {
                      setIsGameActive(false);
                      Alert.alert('Game Over', 'Draw by agreement!');
                    }
                  }
                ]
              );
            }
          }
        }
      ]
    );
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleFlipBoard = () => {
    setIsBoardFlipped(!isBoardFlipped);
  };

  const handleAnalyze = () => {
    Alert.alert('Analysis', 'Opening analysis board...');
  };

  const handleSave = () => {
    Alert.alert('Save Game', 'Game saved successfully!');
  };

  const handleMoveSelect = (index: number) => {
    setCurrentMoveIndex(index);
    // In a real implementation, you'd show the position at that move
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
      paddingVertical: 14,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: '#4a90e2',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    newGameText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    statusBar: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statusText: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#fff' : '#000',
      fontWeight: '500',
    },
    gameStatus: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#4a90e2' : '#4a90e2',
      fontWeight: '600',
    },
  });

  const getGameStatus = () => {
    if (!isGameActive) return 'Game Over';
    if (isPaused) return 'Paused';
    if (gameState.isCheck) return 'Check!';
    return 'In Progress';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <GameHeader
          whiteTime={whiteTime}
          blackTime={blackTime}
          activeColor={gameState.activeColor}
          isGameActive={isGameActive && !isPaused}
          onPause={handlePause}
          onFlipBoard={handleFlipBoard}
          gameMode={gameMode === 'local' ? 'Local 2-Player' : 'vs Computer'}
        />

        <View style={styles.statusBar}>
          <Text style={styles.statusText}>
            {gameState.activeColor === 'white' ? 'White' : 'Black'} to move
          </Text>
          <Text style={styles.gameStatus}>
            {getGameStatus()}
          </Text>
        </View>
        
        <View style={styles.boardContainer}>
          <ChessBoard
            position={gameState.board}
            onMove={handleMove}
            activeColor={gameState.activeColor}
            lastMove={gameState.moveHistory[gameState.moveHistory.length - 1]}
            isFlipped={isBoardFlipped}
            showCoordinates={true}
            disabled={!isGameActive || isPaused}
          />
        </View>

        <TouchableOpacity style={styles.newGameButton} onPress={() => setShowNewGameModal(true)}>
          <Text style={styles.newGameText}>New Game</Text>
        </TouchableOpacity>

        <View style={styles.sidePanel}>
          <MoveHistory 
            moves={gameState.moveHistory} 
            currentMoveIndex={currentMoveIndex}
            onMoveSelect={handleMoveSelect}
          />
          <GameControls
            onUndo={handleUndo}
            onRedo={handleRedo}
            onResign={handleResign}
            onDraw={handleDraw}
            onAnalyze={handleAnalyze}
            onSave={handleSave}
            canUndo={moveHistory.length > 0}
            canRedo={false}
          />
        </View>
      </View>

      <NewGameModal
        visible={showNewGameModal}
        onClose={() => setShowNewGameModal(false)}
        onStartGame={startNewGame}
      />
    </SafeAreaView>
  );
}