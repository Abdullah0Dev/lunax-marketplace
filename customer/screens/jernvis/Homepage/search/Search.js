import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Search({ navigation }) {
  const [query, setQuery] = useState('');

  // Sample data with local assets
  const data = [
    { id: '1', name: 'Laptop1', image: require('../../../../assets/m920.webp') },
    { id: '2', name: 'Laptop2', image: require('../../../../assets/m920.webp') },
    { id: '3', name: 'Laptop3', image: require('../../../../assets/m920.webp') },
    { id: '4', name: 'Laptop4', image: require('../../../../assets/m920.webp') },
    { id: '5', name: 'Laptop5', image: require('../../../../assets/m920.webp') },
    { id: '6', name: 'Laptop6', image: require('../../../../assets/m920.webp') },
  ];

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={item.image} style={styles.image} />

      {/* Name in center */}
      <View style={styles.overlay}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="rgb(201, 90, 11)" />
          <TextInput
            placeholder="لێگەریان..."
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Grid */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ padding: wp('4%') }}
        ListEmptyComponent={
          <Text style={styles.empty}>چ تشت ب ڤی ناڤی نەبوون</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginLeft: 10,
    height: 44,
  },

  searchInput: {
    flex: 1,
    fontSize: wp('4%'),
    marginLeft: 8,
    color: '#000',
  },

  item: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: wp('4%'),
    borderRadius: 10,
    overflow: 'hidden',
  },

  image: {
    width: '100s%',
    height: '100%',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  name: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '700',
  },

  empty: {
    textAlign: 'center',
    marginTop: hp('10%'),
    fontSize: wp('4%'),
    color: '#777',
  },
});
