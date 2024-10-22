import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { blurhash, formatDate, getRoomId } from '../../utils/constants';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function ChatItem({ item, noBorder, router, currentUser}) {
    const [lastMessage, setLastMessage] = useState(undefined);
    const roomIdRef = useRef(null)
    useEffect(() => {

        let roomId = item?.type == "bot" ? item?.roomId : getRoomId(currentUser?.userId, item?.userId);
        roomIdRef.current = roomId
        const docRef = doc(db, "rooms", roomId);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map((doc) => {
                return doc.data()
            });
            setLastMessage(allMessages[0] ? allMessages[0] : null)
        });

        return unsub;
    }, []);
    const styles = stylesWrapepr(noBorder);
    const openChatRoom = () => {
        router.push({pathname : "/ChatRoom", params: {...item, roomId : roomIdRef.current}});
    }
    const renderTime = () => {
        if(lastMessage){
            console.log(lastMessage.createdAt)
            let date = lastMessage.createdAt
            return formatDate(new Date(date.seconds * 1000))
        }
        return " TIme"
    }
    const renderLastMessage = () => {
        if(typeof lastMessage == undefined) return "loading"
        if(lastMessage){
            if(currentUser?.userId == lastMessage?.userId) return "You: "+ lastMessage?.text
            return lastMessage?.text
        } else {
            return "Say Hi!"
        }
    }
    return (
        <TouchableOpacity onPress={openChatRoom} style={styles.chatItem} >
            <Image source={{uri : item?.profileUrl}} style={{ height: hp(6), aspectRatio: 1, borderRadius : '100' }}
                placeholder={blurhash}  transition={500}/>
            <View className="flex-1 gap-1">
                <View className="flex-row justify-between">
                    <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-800">{item?.username}</Text>
                    <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-800">
                        {renderTime()}
                    </Text>
                </View>
                <Text style={{ fontSize: hp(1.6) }} className="font-semibold text-neutral-500">{renderLastMessage()}</Text>
            </View>
        </TouchableOpacity>
    )
}

const stylesWrapepr = (noBorder) => StyleSheet.create({
    chatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        alignContent: "center",
        gap: 7,
        paddingBottom: 10,
        marginBottom: 15,
        borderBottomWidth: noBorder ? 0 : 0.2,
        // borderBottomColor: 'grey'
    },
});