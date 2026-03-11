import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function Contact({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>پەیوەندیێ بکە</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.description}>
          تو وەک بازرگان ئەگەر تە بڤێت بەژدارببی دناڤا ئەپلیکەیشنا LUNAX داکو ددەمەکێ کورت دا هەمی کەس بەرهەمێن تە ببین و داخاز بکەن پەیوەندیێ بمە بکە. یان هەر داخوازیەکا تە هەبیت یان هاریکاریەک ئەم دگەل تە داینە
        </Text>

        {/* WhatsApp */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://wa.me/9647500000000')}
        >
          <FontAwesome name="whatsapp" size={22} color="#25D366" />
          <Text style={styles.buttonText}>پەیوەندی ب رێکا واتس ئاپی</Text>
        </TouchableOpacity>

        {/* Email */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('mailto:support@example.com')}
        >
          <Ionicons name="mail-outline" size={22} color="rgb(255, 81, 0)" />
          <Text style={styles.buttonText}>پەیوەندی ب رێکا ئیمێلی</Text>
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
    paddingHorizontal: wp('6%'),
    paddingTop: 30,
  },

  description: {
    fontSize: wp('4%'),
    lineHeight: 26,
    color: '#444',
    textAlign: 'center',
    marginBottom: 30,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 15,
  },

  buttonText: {
    marginLeft: 12,
    fontSize: wp('4%'),
    color: '#222',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },

  socialButton: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#f2f2f2',
  },

  socialText: {
    marginTop: 8,
    fontSize: wp('3.5%'),
    color: '#222',
  },
});
