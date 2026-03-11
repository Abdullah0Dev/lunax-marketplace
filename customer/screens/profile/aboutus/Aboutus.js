import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function Aboutus({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>دەربارەی مە</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
         ئەڤ ئەپلیکەیشنە یا هاتیە دروستکرن دا کو ببینە پەیوەندیەکا راستەوخو دناڤبەرا بازاری و خەلکی دا.ئەم هەول ددەین هەمی ئەو کەسێن بەرهەم هەین یان خزمەتگوزاری.بشێن ب شێوازەکێ ب ساناهی بەرهەمێن خو پێشانبدەن بو خەلکی و بگەهینێ
        </Text>

        <Text style={styles.sectionTitle}>
          ئەڤ ئەپلیکەیشنە رێکەکا ب ساناهی و پارێزە بو:
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>• پێشاندانا بەرهەم و خزمەتگوزاریا</Text>
          <Text style={styles.listItem}>• پەیوەندیا راستەوخو دناڤبەرا فروشیاری و کریاری دا</Text>
          <Text style={styles.listItem}>• پالپشتیا بازرگانێن نافخو</Text>
          <Text style={styles.listItem}>• ئاسانکرنا کرین و فروتن بو هەمی لایا</Text>
        </View>

        <Text style={styles.text}>
          د باوەریا مەدا یە خەلک بشێت ل ناڤا مالێن خودا ب ساناهی بەرهەمان ببینیت. هەلبژێریت و پەیوەندیێ بکەت ب وان کەسان یێن بەرهەمان دابین دکەن
        </Text>

        <Text style={styles.text}>
         ئارمانجا مە یا سەرەکی دروستکرنا ژینگەهەکا باوەرکری و کارا بو بازاری. بازرگان و خەلک سودبەخشبن و بازرگانیا نافخو بهێزتربیت
        </Text>

        <Text style={styles.text}>
         ئەم بەردەوام کار دکەین بو باشترکرنا ئەپلیکەیشنێ و زێدەکرنا تایبەتمەندیێن نوێ. ژبو خزمەتەکا باشتر پێشکێشی هەوە بکەین
        </Text>

        <Text style={styles.footerText}>
          سوپاس کو تە LUNAX هەلبژارتی 😍
        </Text>
      </ScrollView>

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
    paddingHorizontal: wp('5%'),
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: wp('5%'),
    fontWeight: '700',
    color: '#000',
  },

  content: {
    paddingHorizontal: wp('6%'),
    paddingTop: 28,
    paddingBottom: 120,
  },

  text: {
    fontSize: wp('4%'),
    lineHeight: 30,
    color: '#444',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: '#000',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 14,
  },

  list: {
    marginBottom: 20,
  },

  listItem: {
    fontSize: wp('4%'),
    lineHeight: 28,
    color: '#555',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },

  footerText: {
    fontSize: wp('4%'),
    lineHeight: 28,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
});

