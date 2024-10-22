import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ChatItem from './ChatItem'
import { useRouter } from 'expo-router'

export default function ChatList({ users, currentUser }) {
  const router = useRouter();

  const item_f = {
    userId: 'bot_1',
        type: 'bot',
        username: 'AI Assistant',
        profileUrl: 'https://www.boostability.com/wp-content/uploads/2021/02/Feb.-17-Bots-e1614642771145.jpg'
  }

  // console.log(users, "USERS")
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        keyExtractor={item => Math.random()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) =>{
          let item_new = item?.type == 'bot' ? {...item, ...item_f} : item;
          console.log(item_new, "individual ditem")
          return (<ChatItem
            currentUser={currentUser}
            router={router}
            noBorder={index + 1 === users.length}
            item={item_new} />)}
          }
      >

      </FlatList>
    </View>
  )
}