import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const Signin1 = ({navigation}) => {
  const { width } = useWindowDimensions();
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>

      {/* Logo */}
      <Image
        source={require('../../../assets/luna.jpeg')}
        style={[
          styles.image,
          {
            width: width > 768 ? wp('40%') : wp('55%'),
            height: width > 768 ? hp('25%') : hp('15%'),
            marginTop: isTablet ? hp('6%') : hp('12%'),
          },
        ]}
        resizeMode="contain"
      />

      {/* Username */}
      <View style={styles.inputRow}>
        <Ionicons name="call-outline" size={22} color="#555" />
        <TextInput
          placeholder="ژمارا موبایلێ"
          placeholderTextColor="#999"
          style={styles.input}
          textAlign="right"
        />
      </View>

      {/* Password */}
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={22} color="#555" />
        <TextInput
          placeholder="وشەیا نهێنی"
          placeholderTextColor="#999"
          secureTextEntry={!passwordVisible}
          style={styles.input}
          textAlign="right"
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons
            name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Forget password */}
      <TouchableOpacity style={styles.forgetBtn} onPress={()=>navigation.navigate("ForgetPassword")}>
        <Text style={styles.forgetText}>ژبیرچوونا وشەیا نهێنی؟</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText}>چوونا ژوور</Text>
      </TouchableOpacity>

      {/* Create account */}
      <TouchableOpacity style={styles.createAccount} onPress={()=>navigation.navigate("Signup")}>
        <Text style={styles.createText}>
           هەژمارنینە؟ <Text style={{ color: 'rgb(236, 134, 0)' }}>هەژمارێ دروست بکە</Text>
        </Text>
      </TouchableOpacity>



<Text style={{fontSize: wp('4%'),
  textAlign:'center',
  marginTop:50
}} onPress={()=>navigation.navigate("MainTabs")}>Guest</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp('7%'),
  },

  image: {
    alignSelf: 'center',
    marginBottom: hp('4%'),
  },

  inputRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: hp('2%'),
  },

  input: {
    flex: 1,
    fontSize: wp('4%'),
    color: '#000',
    marginHorizontal: 10,
  },

  forgetBtn: {
    alignSelf: 'flex-start',
    marginBottom: hp('3%'),
  },

  forgetText: {
    fontSize: wp('3.8%'),
    color: '#666',
  },

  loginBtn: {
    backgroundColor: 'rgb(237, 108, 3)',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: hp('3%'),
  },

  loginText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },

  createAccount: {
    alignItems: 'center',
  },

  createText: {
    fontSize: wp('4%'),
    color: '#444',
  },
});

export default Signin1;
