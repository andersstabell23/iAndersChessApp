import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { ChessPiece } from './ChessPiece';
import { Color, PieceType } from '@/types/chess';

interface PromotionModalProps {
  visible: boolean;
  color: Color;
  onSelect: (piece: PieceType) => void;
}

export function PromotionModal({ visible, color, onSelect }: PromotionModalProps) {
  const colorScheme = useColorScheme();

  const promotionPieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 20,
    },
    piecesContainer: {
      flexDirection: 'row',
      gap: 16,
    },
    pieceButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 60,
      height: 60,
      borderRadius: 12,
      backgroundColor: colorScheme === 'dark' ? '#3a3a3a' : '#f8f9fa',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    pieceButtonHover: {
      borderColor: '#4a90e2',
      backgroundColor: colorScheme === 'dark' ? '#1a3a5a' : '#e6f3ff',
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Choose Promotion</Text>
          <View style={styles.piecesContainer}>
            {promotionPieces.map((piece) => (
              <TouchableOpacity
                key={piece}
                style={styles.pieceButton}
                onPress={() => onSelect(piece)}
              >
                <ChessPiece type={piece} color={color} size={40} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}