import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  boardTheme: string;
  pieceSet: string;
  soundEnabled: boolean;
  showCoordinates: boolean;
  showLegalMoves: boolean;
  animationSpeed: string;
  autoPromoteToQueen: boolean;
  confirmMoves: boolean;
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState<Settings>({
    boardTheme: 'wood',
    pieceSet: 'classic',
    soundEnabled: true,
    showCoordinates: true,
    showLegalMoves: true,
    animationSpeed: 'normal',
    autoPromoteToQueen: false,
    confirmMoves: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('chessSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('chessSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSetting = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const showThemeSelector = (type: 'board' | 'pieces') => {
    const options = type === 'board' 
      ? ['wood', 'marble', 'blue', 'green', 'brown']
      : ['classic', 'modern', 'alpha', 'pixel', 'staunton'];
    
    Alert.alert(
      `Select ${type === 'board' ? 'Board Theme' : 'Piece Set'}`,
      '',
      [
        ...options.map(option => ({
          text: option.charAt(0).toUpperCase() + option.slice(1),
          onPress: () => updateSetting(type === 'board' ? 'boardTheme' : 'pieceSet', option)
        })),
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const showAnimationSpeedSelector = () => {
    const speeds = ['slow', 'normal', 'fast', 'instant'];
    
    Alert.alert(
      'Animation Speed',
      '',
      [
        ...speeds.map(speed => ({
          text: speed.charAt(0).toUpperCase() + speed.slice(1),
          onPress: () => updateSetting('animationSpeed', speed)
        })),
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const resetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultSettings: Settings = {
              boardTheme: 'wood',
              pieceSet: 'classic',
              soundEnabled: true,
              showCoordinates: true,
              showLegalMoves: true,
              animationSpeed: 'normal',
              autoPromoteToQueen: false,
              confirmMoves: false,
            };
            saveSettings(defaultSettings);
          }
        }
      ]
    );
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
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      textAlign: 'center',
    },
    section: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      marginHorizontal: 16,
      marginTop: 20,
      borderRadius: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' ? '#444' : '#f0f0f0',
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' ? '#444' : '#f0f0f0',
    },
    lastSettingRow: {
      borderBottomWidth: 0,
    },
    settingLabel: {
      fontSize: 16,
      color: colorScheme === 'dark' ? '#fff' : '#000',
      flex: 1,
    },
    settingValue: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      marginRight: 8,
    },
    resetButton: {
      backgroundColor: '#ff4444',
      marginHorizontal: 16,
      marginTop: 20,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    resetButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const renderSettingRow = (
    label: string,
    value: string | boolean,
    onPress?: () => void,
    isSwitch = false,
    isLast = false
  ) => (
    <TouchableOpacity
      style={[styles.settingRow, isLast && styles.lastSettingRow]}
      onPress={onPress}
      disabled={isSwitch}
    >
      <Text style={styles.settingLabel}>{label}</Text>
      {isSwitch ? (
        <Switch
          value={value as boolean}
          onValueChange={(newValue) => {
            const key = label.toLowerCase().replace(/\s+/g, '') as keyof Settings;
            if (key === 'soundenabled') updateSetting('soundEnabled', newValue);
            else if (key === 'showcoordinates') updateSetting('showCoordinates', newValue);
            else if (key === 'showlegalmoves') updateSetting('showLegalMoves', newValue);
            else if (key === 'autopromotetoqueen') updateSetting('autoPromoteToQueen', newValue);
            else if (key === 'confirmmoves') updateSetting('confirmMoves', newValue);
          }}
        />
      ) : (
        <Text style={styles.settingValue}>{value}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          {renderSettingRow('Board Theme', settings.boardTheme, () => showThemeSelector('board'))}
          {renderSettingRow('Piece Set', settings.pieceSet, () => showThemeSelector('pieces'))}
          {renderSettingRow('Animation Speed', settings.animationSpeed, showAnimationSpeedSelector, false, true)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gameplay</Text>
          {renderSettingRow('Show Coordinates', settings.showCoordinates, undefined, true)}
          {renderSettingRow('Show Legal Moves', settings.showLegalMoves, undefined, true)}
          {renderSettingRow('Auto-Promote to Queen', settings.autoPromoteToQueen, undefined, true)}
          {renderSettingRow('Confirm Moves', settings.confirmMoves, undefined, true, true)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          {renderSettingRow('Sound Effects', settings.soundEnabled, undefined, true, true)}
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}