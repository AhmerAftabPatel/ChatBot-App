import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from './components/loading';
import CustomKeyboardView from './components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {register} = useAuth()

  const emailRef = useRef("");
  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const profileRef = useRef("");

  const handleRegister = async () => {
    if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profileRef.current) {
      Alert.alert("Sign In", "All fields are requried");
      return;
    }

    setLoading(true);

    const response = await register(emailRef.current, passwordRef.current, usernameRef.current, profileRef.current);
    setLoading(false);

    console.log("result", response)
    if(!response.success){
      Alert.alert("Sign Up", response.msg)
    }

  }
  return (
    <CustomKeyboardView>
      <StatusBar style='dark' />
      <View style={{ paddingTop: hp(7), paddingHorizontal: wp(5) }} className="felx-1 gap-12">
        <View className="items-center">
          <Image style={{ height: hp(20) }} resizeMode='contain' source={require('../assets/images/UTSA.png')} />
        </View>
        <View className="gap-10">
          <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">Sign Up</Text>
          {/* inputs */}
          <View className="gap-4">
            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Feather name="user" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={value => usernameRef.current = value}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Username"
                placeholderTextColor="gray" />
            </View>
            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Octicons name="mail" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={value => emailRef.current = value}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Email Address"
                placeholderTextColor="gray" />
            </View>
            <View className="gap-3">
              <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                <Octicons name="lock" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={value => passwordRef.current = value}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Password"
                  secureTextEntry
                  placeholderTextColor="gray" />
              </View>
            </View>
            <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Feather name="image" size={hp(2.7)} color="gray" />
              <TextInput
                onChangeText={value => profileRef.current = value}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Image"
                placeholderTextColor="gray" />
            </View>
            <View>
              {
                loading ? (
                  <View className="flex-row justify-center">
                    <Loading size={hp(6.5)} />
                  </View>
                ) : (
                  <View className="flex bg-orange-500 rounded-xl justify-center items-center">
                    <TouchableOpacity onPress={() => handleRegister()} style={{ height: hp(6.5) }}>
                      <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider mt-3">
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
              }
            </View>

            <View className="flex-row justify-center">

              <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">Already have an account?</Text>
              <Pressable onPress={() => router.push('SignIn')}>
                <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-orange-500">Sign In</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </View>
    </CustomKeyboardView>
  )
}