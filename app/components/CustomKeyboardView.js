import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'

const ios = Platform.OS == "ios"

export default function CustomKeyboardView({ children, isPush }) {
  let config = {

  }
  let scrollConfig = {

  }
  if(isPush){
    config = { keyboardVerticalOffset: 90}
    scrollConfig = {contentContainerStyle : {flex : 1}}
  }
  return (
    <KeyboardAvoidingView
      {...config}
      behavior={ios ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        {...scrollConfig}
        >
        {
          children
        }
      </ScrollView>
    </KeyboardAvoidingView>
  )
}