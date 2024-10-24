import { View, Text, Button, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../components/ChatList';
import Loading from '../components/loading';
import { getDocs, query, where } from 'firebase/firestore';
import { roomsRef, usersRef } from '../../firebaseConfig';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getRoomId } from '../../utils/constants';


export default function home() {
  const router = useRouter()
  const { logout, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [bots, setBots] = useState([]);
  useEffect(() => {
    if(user?.uid){
      getUsers()
    }
    getBots();
  }, [])
  const getUsers = async () => {
    const q = query(usersRef, where("userId", "!=", user?.uid));
    const querySnapshot = await getDocs(q);
    let data = [];

    querySnapshot.forEach((doc) => {
      data.push({...doc.data()})
    })
    setUsers(data)
  }

  const getBots = async () => {
    const q = query(roomsRef, where("type", "==", "bot"));
    const querySnapshot = await getDocs(q);
    let data = [];

    querySnapshot.forEach((doc) => {
      data.push({...doc.data()})
    })
    setBots(data)
  }

  const startNewBotSession = () => {
    router.push({
      pathname: '/ChatRoom',
      params: {
        userId: 'bot_3',
        type: 'bot',
        username: 'AI Assistant 3',
        profileUrl: 'https://www.boostability.com/wp-content/uploads/2021/02/Feb.-17-Bots-e1614642771145.jpg',
        roomId : getRoomId(user.userId, 'bot_3'),
      }
    })
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style='light' />
      <TouchableOpacity
      style={{backgroundColor : '#737373', paddingHorizontal : 20, paddingVertical : 30}} 
        onPress={startNewBotSession}
        className="bg-blue-500 py-2 px-4 rounded-lg"
      >
        <Text className="text-white font-semibold">Start New Bot Session</Text>
      </TouchableOpacity>
      <View className="bg-indigo-600">
          <Text className="text-white text-left px-4 py-2">Users</Text>
      </View>
      {users.length > 0 ? (
        <ChatList currentUser={user} users={users} />
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large"/>
        </View>
      )}
      <View className="bg-orange-600">
          <Text className="text-white text-left px-4 py-2">Bots</Text>
      </View>
      {bots.length > 0 ? (
        <ChatList currentUser={user} users={bots} />
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large"/>
        </View>
      )}
    </View>
  )
}