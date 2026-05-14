import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useEffect, useState } from 'react';
import { Collapsible } from '@/components/ui/collapsible';

export default function HomeScreen() {
  const [message, setMessage] = useState("loading...");
  const [buildings, setBuildings] = useState<{
    _id: string,
    code: string,
    name_en: string,
    name_th: string,
    pronunciation_th: string,
    faculty: string,
  }[]>([]);

  useEffect(() => {
    fetch("http://10.0.2.2:3000/buildings")
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        setBuildings(data.buildings);
      })
      .catch(err => {
        setMessage("error: " + err.message);
        setBuildings([]);
      });
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{message}</ThemedText>
        <HelloWave />
      </ThemedView>
      {buildings.map((building) => (
        <Collapsible key={building._id} title={building.code}>
        <ThemedText>
          English Name: {building.name_en}
        </ThemedText>
        <ThemedText>
          Thai Name: {building.name_th}
        </ThemedText>
        <ThemedText>
          Pronunciation: {building.pronunciation_th}
        </ThemedText>
        <ThemedText>
          Faculty: {building.faculty}
        </ThemedText>
      </Collapsible>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
