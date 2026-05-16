import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
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

  const buildings = [

    {
      code: 'BRK',
      name: 'Boromrajakumari Building',
      faculty: 'Faculty of Arts',
    },

    {
      code: 'ENG 1',
      name: 'Engineering Building 1',
      faculty: 'Faculty of Engineering',
    },

    {
      code: 'CHALE',
      name: 'Chaloem Rajakumari Building',
      faculty: 'Communication Arts',
    },

    {
      code: 'MTBLD',
      name: 'Mahit Building',
      faculty: 'Faculty of Medicine',
    },

    {
      code: 'SCI',
      name: 'Science Building',
      faculty: 'Faculty of Science',
    },

  ];

  const filtered = buildings.filter((building) =>

    building.code.toLowerCase().includes(search.toLowerCase()) ||

    building.name.toLowerCase().includes(search.toLowerCase())

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
            placeholder='Search building or abbreviation'
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

        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => {
            alert(
              `${building.name}\n\n${building.faculty}`
            );
          }}
        >

          <View style={styles.codeBox}>

            <Text style={styles.code}>
              {building.code}
            </Text>

          </View>

          <View style={{ flex: 1 }}>

            <Text style={styles.buildingName}>
              {building.name}
            </Text>

            <Text style={styles.faculty}>
              {building.faculty}
            </Text>

          </View>

          <Ionicons
            name='chevron-forward'
            size={22}
            color='#9ca3af'
          />

        </TouchableOpacity>

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