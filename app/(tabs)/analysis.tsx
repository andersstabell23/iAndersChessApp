import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ChessBoard } from '@/components/ChessBoard';
import { PositionEditor } from '@/components/PositionEditor';
import { EvaluationBar } from '@/components/EvaluationBar';
import { OpeningExplorer } from '@/components/OpeningExplorer';

export default function AnalysisScreen() {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<'analysis' | 'editor' | 'opening'>('analysis');
  const [fenInput, setFenInput] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [evaluation, setEvaluation] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const tabs = [
    { key: 'analysis', title: 'Analysis', icon: 'analytics' },
    { key: 'editor', title: 'Editor', icon: 'create' },
    { key: 'opening', title: 'Openings', icon: 'library' },
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setEvaluation(Math.random() * 400 - 200);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleLoadFEN = () => {
    try {
      // Basic FEN validation
      const parts = fenInput.split(' ');
      if (parts.length !== 6) {
        throw new Error('Invalid FEN format');
      }
      Alert.alert('Success', 'Position loaded successfully!');
    } catch (error) {
      Alert.alert('Error', 'Invalid FEN string');
    }
  };

  const resetToStarting = () => {
    setFenInput('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    setEvaluation(0);
  };

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
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
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
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' ? '#333' : '#e5e5e5',
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    },
    activeTab: {
      backgroundColor: '#4a90e2',
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
    analysisContainer: {
      flexDirection: 'row',
      gap: 16,
    },
    boardSection: {
      flex: 2,
      alignItems: 'center',
    },
    evaluationSection: {
      flex: 1,
      alignItems: 'center',
    },
    controlsContainer: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    controlsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      marginBottom: 12,
    },
    fenContainer: {
      marginBottom: 16,
    },
    fenLabel: {
      fontSize: 14,
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
    buttonRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    button: {
      flex: 1,
      backgroundColor: '#4a90e2',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    analyzeButton: {
      backgroundColor: isAnalyzing ? '#95a5a6' : '#9b59b6',
    },
    resetButton: {
      backgroundColor: '#e74c3c',
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analysis':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.analysisContainer}>
              <View style={styles.boardSection}>
                <ChessBoard
                  position={fenInput}
                  onMove={() => {}}
                  activeColor="white"
                  isFlipped={false}
                  showCoordinates={true}
                />
              </View>
              
              <View style={styles.evaluationSection}>
                <EvaluationBar evaluation={evaluation} height={250} />
              </View>
            </View>
            
            <View style={styles.controlsContainer}>
              <Text style={styles.controlsTitle}>Position Analysis</Text>
              
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

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={handleLoadFEN}>
                  <Text style={styles.buttonText}>Load FEN</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.analyzeButton]} 
                  onPress={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  <Text style={styles.buttonText}>
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetToStarting}>
                  <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
              </View>
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
            <Ionicons 
              name={tab.icon as any} 
              size={18} 
              color={activeTab === tab.key ? 'white' : (colorScheme === 'dark' ? '#ccc' : '#666')} 
            />
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