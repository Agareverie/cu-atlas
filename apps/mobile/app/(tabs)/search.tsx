import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#111827',
  secondary: '#374151',
  background: '#f5f7fb',
  white: '#ffffff',
  gray: '#6b7280',
};

const screenWidth = Dimensions.get('window').width;

export default function SearchScreen() {

  const [search, setSearch] = useState('');
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
        setBuildings(data.buildings);
      })
      .catch(err => {
        setBuildings([]);
      });
  }, []);

  const filtered = search.trim() === ""
    ? []
    : buildings.filter((building) =>
    building.code.toLowerCase().includes(search.toLowerCase()) ||
    building.faculty.toLowerCase().includes(search.toLowerCase()) ||
    building.name_en.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HERO */}

      <View style={styles.hero}>

        <Text style={styles.title}>
          CU Atlas
        </Text>

        <Text style={styles.subtitle}>
          Smart Campus Navigation
        </Text>

      </View>

      {/* SEARCH BAR */}

      <View style={styles.searchCard}>

        <View style={styles.searchRow}>

          <Ionicons
            name='search'
            size={22}
            color='#6b7280'
          />

          <TextInput
            placeholder='Search building, faculty or abbreviation'
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />

        </View>

      </View>

      {/* RESULTS */}
      <Text style={styles.sectionTitle}>
        Buildings
      </Text>

      {filtered.map((building, index) => (

        <View
          key={index}
          style={styles.card}
        >

          <View style={styles.codeBox}>

            <Text style={styles.code}>
              {building.code}
            </Text>

          </View>

          <View style={{ flex: 1 }}>

            <Text style={styles.buildingName}>
              {building.name_en}
            </Text>

            <Text style={styles.faculty}>
              {building.faculty}
            </Text>

          </View>
        </View>

      ))}

      <View style={{ height: 120 }} />

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: screenWidth > 700 ? 60 : 20,
  },

  hero: {
    marginTop: 60,
    marginBottom: 30,
  },

  title: {
    fontSize: screenWidth > 700 ? 58 : 40,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  subtitle: {
    marginTop: 8,
    color: COLORS.gray,
    fontSize: 16,
  },

  searchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 18,
    marginBottom: 35,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.primary,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  codeBox: {
    width: 70,
    height: 70,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },

  code: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },

  buildingName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  faculty: {
    marginTop: 4,
    color: COLORS.gray,
  },

});