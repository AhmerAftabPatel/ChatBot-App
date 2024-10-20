import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import MessageItem from './MessageItem'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function MessageList({messages, currentUser, scrollviewRef}) {
  return (
    <ScrollView ref={scrollviewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop : 10}}>
      {
        messages.map((message, index) => {
          return <MessageItem message={message} key={index} currentUser={currentUser}/>
        })
      }
    </ScrollView>
  )
}