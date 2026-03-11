import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Password({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSend = () => {
    if (!email) {
      Alert.alert('هەڵە', 'هیڤیە ئیمێلێ خو داخل بکە');
      return;
    }

    Alert.alert(
      'سەرکەفتی',
      'پەیام بو ئیمێلێ تە هاتە هنارتن بو گهورینا وشا نهێنی'
    );

    // لێرە دەتوانیت API / Firebase / Supabase بانگ بکەیت
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ژبیرچوونا وشەیا نهێنی</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Ionicons
          name="mail-outline"
          size={70}
          color="rgb(255, 111, 0)"
          style={{ marginBottom: hp('3%') }}
        />

        <Text style={styles.desc}>
         هیڤیە ئیمێلێ خو بنڤیسە،پەنچێ لسەر هنارتن بکە داکو دناڤا ئیمێلێ خودا وشەیەکا نوێ دروست بکەی
        </Text>

        {/* Email Input */}
        <View style={styles.inputRow}>
          <Ionicons name="at-outline" size={22} color="#555" />
          <TextInput
            placeholder="ئیمەیڵ"
            placeholderTextColor="#999"
            style={styles.input}
            textAlign="right"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>هنارتن</Text>
        </TouchableOpacity>
      </View>

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
    fontWeight: '600',
    color: '#000',
  },

  content: {
    flex: 1,
    paddingHorizontal: wp('7%'),
    paddingTop: hp('6%'),
    alignItems: 'center',
  },

  desc: {
    fontSize: wp('4%'),
    color: '#444',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: hp('4%'),
  },

  inputRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    width: '100%',
    marginBottom: hp('3%'),
  },

  input: {
    flex: 1,
    fontSize: wp('4%'),
    color: '#000',
    marginHorizontal: 10,
  },

  sendBtn: {
    backgroundColor: 'rgb(255, 111, 0)',
    paddingVertical: 14,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },

  sendText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
});
