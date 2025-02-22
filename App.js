import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Text, View } from 'react-native';

// Define your custom theme
const theme = {
  colors: {
    primary: '#BFB4FF', // Button color
    accent: '#9FF9D5',  // Highlight color
    background: '#FDFCF5', // Light cream background
    text: '#003D5B',    // Text color
  },
  fonts: {
    regular: {
      fontFamily: 'Inter',
      fontWeight: 'normal',
    },
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Welcome to Prepwise!</Text>
      </View>
    </PaperProvider>
  );
}
