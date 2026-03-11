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

const Signin1 = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Example login function
    console.log('Username:', username);
    console.log('Password:', password);
    // Navigate to next screen or perform authentication
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../../assets/blun.jpg')}
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
        <Ionicons name="person-outline" size={22} color="rgb(46, 102, 31)" />
        <TextInput
          placeholder="Username"
          placeholderTextColor="#999"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* Password */}
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={22} color="rgb(46, 102, 31)" />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!passwordVisible}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons
            name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="rgb(46, 102, 31)"
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Guest Login */}
      <Text
        style={styles.guestText}
        onPress={() => navigation.navigate('MainTabs')}
      >
        Continue as Guest
      </Text>
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
    flexDirection: 'row',
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
  loginBtn: {
    backgroundColor: 'rgb(46, 102, 31)',
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
  guestText: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginTop: 50,
    color: '#444',
    textDecorationLine: 'underline',
  },
});

export default Signin1;
