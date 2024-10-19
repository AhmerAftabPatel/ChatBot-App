import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { router, Slot, useSegments } from 'expo-router'
import '../global.css'
import { AuthContextProvider, useAuth } from '../context/authContext'

const MainLayout = () => {
  const {isAuthenticated} = useAuth();
  const segments = useSegments();

  useEffect(() => {
    //check if user is authen
    if(typeof isAuthenticated == 'undefined') return;
    const inApp = segments[0] == '(app)';
    if(isAuthenticated && !inApp){
        //redirect to home/dashboard
        router.replace('home')
    }else if(isAuthenticated == false) {
      router.replace('signIn')
    } 
  } , [isAuthenticated]);

  return <Slot />
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  )
}