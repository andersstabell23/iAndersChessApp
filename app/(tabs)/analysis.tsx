import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChessBoard } from '@/components/ChessBoard';
import { PositionEditor } from '@/components/PositionEditor';
import { EvaluationBar } from '@/components/EvaluationBar';
import { OpeningExplorer } from '@/components/OpeningExplorer';

export default function AnalysisScreen() {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<'analysis' | 'editor' | 'opening'>('analysis');
  const [fenInput, setFenInput] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [evaluation, setEvaluation] = useState(0);

  const tabs = [
    { key: 'analysis', title: 'Analysis' },
    { key: 'editor', title: 'Position Editor' },
    { key: 'opening', title: 'Opening Explorer' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f8f9fa',
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' ? '#333' : '#e5e5e5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      textAlign: 'center',
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f0f0f0',
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: colorScheme === 'dark' ? '#4a90e2' : '#4a90e2',
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#ccc' : '#666',
    },
    activeTabText: {
      color: 'white',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    boardContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    fenContainer: {
      marginBottom: 20,
    },
    fenLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 8,
    },
    fenInput: {
      backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#555' : '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 12,
      fontFamily: 'monospace',
    },
    evaluationContainer: {
      marginBottom: 20,
    },
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analysis':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.boardContainer}>
              <ChessBoard
                position="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
                onMove={() => {}}
                activeColor="white"
                isFlipped={false}
                showCoordinates={true}
              />
            </View>
            
            <View style={styles.evaluationContainer}>
              <EvaluationBar evaluation={evaluation} />
            </View>
            
            <View style={styles.fenContainer}>
              <Text style={styles.fenLabel}>FEN Position</Text>
              <TextInput
                style={styles.fenInput}
                value={fenInput}
                onChangeText={setFenInput}
                placeholder="Enter FEN notation"
                placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
                multiline
              />
            </View>
          </ScrollView>
        );
      
      case 'editor':
        return <PositionEditor />;
      
      case 'opening':
        return <OpeningExplorer />;
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis Board</Text>
      </View>
      
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
}