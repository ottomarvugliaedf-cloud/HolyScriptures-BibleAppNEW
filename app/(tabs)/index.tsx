import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useBible } from '@/context/BibleContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { currentTranslation, randomVerse, loadRandomVerse, downloadedBibles } = useBible();
  const { isDark } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#ffffff',
    },
    scrollContent: {
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#999999' : '#666666',
    },
    card: {
      backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderColor: isDark ? '#333333' : '#e0e0e0',
      borderWidth: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 8,
    },
    cardText: {
      fontSize: 14,
      color: isDark ? '#cccccc' : '#333333',
      lineHeight: 20,
    },
    button: {
      backgroundColor: '#0066cc',
      borderRadius: 8,
      padding: 12,
      marginTop: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: 14,
    },
    verseCard: {
      backgroundColor: isDark ? '#1a3a5a' : '#e6f0ff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#0066cc',
    },
    verseReference: {
      fontSize: 16,
      fontWeight: '600',
      color: '#0066cc',
      marginBottom: 8,
    },
    verseText: {
      fontSize: 14,
      color: isDark ? '#cccccc' : '#333333',
      lineHeight: 20,
      fontStyle: 'italic',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Holy Scriptures</Text>
          <Text style={styles.subtitle}>
            {currentTranslation ? `Lettura: ${currentTranslation.name}` : 'Nessuna traduzione selezionata'}
          </Text>
        </View>

        {randomVerse && (
          <View style={styles.verseCard}>
            <Text style={styles.verseReference}>{randomVerse.reference}</Text>
            <Text style={styles.verseText}>{randomVerse.text}</Text>
            <TouchableOpacity style={styles.button} onPress={loadRandomVerse}>
              <Text style={styles.buttonText}>Nuovo Versetto</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Traduzioni Scaricate</Text>
          {downloadedBibles.length > 0 ? (
            <>
              <Text style={styles.cardText}>
                Hai {downloadedBibles.length} traduzione{downloadedBibles.length > 1 ? 'i' : ''} disponibile{downloadedBibles.length > 1 ? 'i' : ''}.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/(tabs)/downloads')}
              >
                <Text style={styles.buttonText}>Visualizza Traduzioni</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.cardText}>
                Scarica le tue traduzioni bibliche preferite per iniziare a leggere.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/(tabs)/books')}
              >
                <Text style={styles.buttonText}>Scarica Traduzioni</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Come Iniziare</Text>
          <Text style={styles.cardText}>
            1. Vai alla scheda "Traduzioni" per scaricare le tue traduzioni preferite{'\n'}
            2. Seleziona una traduzione dalla scheda "Scaricate"{'\n'}
            3. Leggi i capitoli e prendi note sui versetti{'\n'}
            4. Personalizza le impostazioni nella scheda "Impostazioni"
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
