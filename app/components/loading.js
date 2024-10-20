import { View, Text } from 'react-native'
import React from 'react'

export default function Loading({ size = 0 }) {
  return (
    <View style={{height: size, aspectRatio: 1}}>
        {/* <LottieView style={{ flex: 1 }} source={require("../../assets/lottie/loading.json")} /> */}
    </View>
  )
}