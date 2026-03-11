import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <Ionicons name={icon} size={22} color="#555" />
    <View style={styles.textBox}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

export default function Person() {
  const navigation = useNavigation();

  // زانیاری نموونە
  const user = {
    name: 'DerfetNezir',
    phone: '0750 123 4567',
    email: 'user@email.com',
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>پرۆفایل</Text>

        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40,marginTop:50 }}>

        {/* Username */}
     

        {/* Info Card */}
        <View style={styles.card}>
          <InfoRow
            icon="person-outline"
            label="ناڤ"
            value={user.name}
          />

          <InfoRow
            icon="call-outline"
            label="ژمارا مۆبایلێ"
            value={user.phone}
          />

          <InfoRow
            icon="mail-outline"
            label="ئیمەیڵ"
            value={user.email}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#000',
  },

  username: {
    textAlign: 'center',
    fontSize: wp('5.2%'),
    fontWeight: '700',
    marginVertical: hp('3%'),
    color: '#000',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: wp('6%'),
    borderRadius: 18,
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: hp('1.8%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  textBox: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'flex-end',
  },

  label: {
    fontSize: wp('3.5%'),
    color: '#777',
  },

  value: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: '#000',
    marginTop: 2,
  },
});
