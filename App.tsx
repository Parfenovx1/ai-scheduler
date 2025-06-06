import React, { useEffect, useState } from 'react';
import { View, StatusBar, Animated, StyleSheet, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setSplashVisible(false);
        SplashScreen.hideAsync();
      });
    }
  }, [appIsReady]);

  if (!appIsReady || splashVisible) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
          <Image source={require('./assets/splash-icon.png')} style={styles.splashImage} resizeMode="contain" />
        </Animated.View>
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  splashContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: {
    width: 200,
    height: 200,
  },
});
