import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BibleProvider } from '@/context/BibleContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/context/ThemeContext';

function RootLayoutContent() {
  const { isDark } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        },
        headerTintColor: isDark ? '#ffffff' : '#000000',
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: isDark ? '#000000' : '#ffffff',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Holy Scriptures',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="book/[translationId]/[bookId]"
        options={{
          title: 'Libri',
        }}
      />
      <Stack.Screen
        name="chapter/[translationId]/[bookId]/[chapter]"
        options={{
          title: 'Capitolo',
        }}
      />
      <Stack.Screen
        name="notes/index"
        options={{
          title: 'Le Mie Note',
        }}
      />
      <Stack.Screen
        name="settings/index"
        options={{
          title: 'Impostazioni',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <BibleProvider>
        <RootLayoutContent />
      </BibleProvider>
    </ThemeProvider>
  );
}
