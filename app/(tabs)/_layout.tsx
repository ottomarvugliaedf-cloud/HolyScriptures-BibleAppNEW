import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { isDark } = useTheme();
  const tintColor = isDark ? '#4a9eff' : '#0066cc';
  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: isDark ? '#666666' : '#999999',
        tabBarStyle: {
          backgroundColor,
          borderTopColor: isDark ? '#333333' : '#e0e0e0',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: 'Traduzioni',
          tabBarLabel: 'Traduzioni',
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: 'Scaricate',
          tabBarLabel: 'Scaricate',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Impostazioni',
          tabBarLabel: 'Impostazioni',
        }}
      />
    </Tabs>
  );
}
