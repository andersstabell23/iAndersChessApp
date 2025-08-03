import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  TextInput,
} from 'react-native';
import { ChessBoard } from './ChessBoard';
import { ChessPiece } from './ChessPiece';
import { PieceType, Color } from '@/types/chess';

export function PositionEditor() {
  const colorScheme = useColorScheme();
  const [position, setPosition] = useState<Record<string, { type: PieceType; color: Color }>>({});
  const [selectedPiece, setSelectedPiece] = useState<{ type: PieceType; color: Color } | null>(null);
  const [fenString, setFenString] = useState('');

  const pieceTypes: PieceType[] = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];
  const colors: Color[] = ['white', 'black'];

  const handleSquarePress = (square: string) => {
    if (selectedPiece) {
      const newPosition = { ...position };
      newPosition[square] = selectedPiece;
      setPosition(newPosition);
      generateFEN(newPosition);
    } else {
      const newPosition = { ...position };
      delete newPosition[square];
      setPosition(newPosition);
      generateFEN(newPosition);
    }
  };

  const generateFEN = (pos: Record<string, { type: PieceType; color: Color }>) => {
    let fen = '';
    
    for (let rank = 8; rank >= 1; rank--) {
      let emptyCount = 0;
      let rankString = '';
      
      for (let file = 0; file < 8; file++) {
        const square = `${String.fromCharCode(97 + file)}${rank}`;
        const piece = pos[square];
        
        if (piece) {
          if (emptyCount > 0) {
            rankString += emptyCount.toString();
            emptyCount = 0;
          }
          
          const pieceChar = piece.type === 'knight' ? 'n' : piece.type[0];
          rankString += piece.color === 'white' ? pieceChar.toUpperCase() : pieceChar;
        } else {
          emptyCount++;
        }
      }
      
      if (emptyCount > 0) {
        rankString += emptyCount.toString();
      }
      
      fen += rankString;
      if (rank > 1) fen += '/';
    }
    
    fen += ' w KQkq - 0 1'; // Default game state
    setFenString(fen);
  };

  const clearBoard = () => {
    setPosition({});
    setFenString('8/8/8/8/8/8/8/8 w KQkq - 0 1');
  };

  const setStartingPosition = () => {
    const startPos: Record<string, { type: PieceType; color: Color }> = {
      'a1': { type: 'rook', color: 'white' },
      'b1': { type: 'knight', color: 'white' },
      'c1': { type: 'bishop', color: 'white' },
      'd1': { type: 'queen', color: 'white' },
      'e1': { type: 'king', color: 'white' },
      'f1': { type: 'bishop', color: 'white' },
      'g1': { type: 'knight', color: 'white' },
      'h1': { type: 'rook', color: 'white' },
      'a8': { type: 'rook', color: 'black' },
      'b8': { type: 'knight', color: 'black' },
      'c8': { type: 'bishop', color: 'black' },
      'd8': { type: 'queen', color: 'black' },
      'e8': { type: 'king', color: 'black' },
      'f8': { type: 'bishop', color: 'black' },
      'g8': { type: 'knight', color: 'black' },
      'h8': { type: 'rook', color: 'black' },
    };
    
    // Add pawns
    for (let file = 0; file < 8; file++) {
      const fileChar = String.fromCharCode(97 + file);
      startPos[`${fileChar}2`] = { type: 'pawn', color: 'white' };
      startPos[`${fileChar}7`] = { type: 'pawn', color: 'black' };
    }
    
    setPosition(startPos);
    generateFEN(startPos);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    boardContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    pieceSelector: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    selectorTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 12,
    },
    colorRow: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    pieceRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
    },
    pieceButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: 'transparent',
      margin: 4,
    },
    selectedPieceButton: {
      borderColor: '#4a90e2',
      backgroundColor: colorScheme === 'dark' ? '#4a4a4a' : '#f0f8ff',
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#4a90e2',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
    },
    clearButton: {
      backgroundColor: '#e74c3c',
    },
    eraseButton: {
      backgroundColor: '#95a5a6',
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    fenContainer: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 12,
      padding: 16,
    },
    fenTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 8,
    },
    fenInput: {
      backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#555' : '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 12,
      fontFamily: 'monospace',
      minHeight: 60,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.boardContainer}>
        <ChessBoard
          position={position}
          onMove={handleSquarePress}
          activeColor="white"
          showCoordinates={true}
        />
      </View>

      <View style={styles.pieceSelector}>
        <Text style={styles.selectorTitle}>Select Piece to Place</Text>
        
        {colors.map((color) => (
          <View key={color}>
            <Text style={[styles.selectorTitle, { fontSize: 14, marginBottom: 8 }]}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </Text>
            <View style={styles.pieceRow}>
              {pieceTypes.map((type) => {
                const isSelected = selectedPiece?.type === type && selectedPiece?.color === color;
                return (
                  <TouchableOpacity
                    key={`${color}-${type}`}
                    style={[styles.pieceButton, isSelected && styles.selectedPieceButton]}
                    onPress={() => setSelectedPiece({ type, color })}
                  >
                    <ChessPiece type={type} color={color} size={32} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.button} onPress={setStartingPosition}>
          <Text style={styles.buttonText}>Starting Position</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.eraseButton]} 
          onPress={() => setSelectedPiece(null)}
        >
          <Text style={styles.buttonText}>Erase Mode</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearBoard}>
          <Text style={styles.buttonText}>Clear Board</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fenContainer}>
        <Text style={styles.fenTitle}>FEN String</Text>
        <TextInput
          style={styles.fenInput}
          value={fenString}
          onChangeText={setFenString}
          placeholder="FEN notation will appear here"
          placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
          multiline
          editable={false}
        />
      </View>
    </ScrollView>
  );
}