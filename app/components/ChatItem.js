import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { blurhash } from '../../utils/constants';

export default function ChatItem({ item, noBorder, router}) {
    const styles = stylesWrapepr(noBorder);
    const openChatRoom = () => {
        router.push({pathname : "/ChatRoom", params: item});
    }
    return (
        <TouchableOpacity onPress={openChatRoom} style={styles.chatItem} >
            <Image source={{uri : item?.profileUrl}} style={{ height: hp(6), aspectRatio: 1, borderRadius : '100' }}
                placeholder={blurhash}  transition={500}/>
            <View className="flex-1 gap-1">
                <View className="flex-row justify-between">
                    <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-800">{item?.username}</Text>
                    <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-800">Time</Text>
                </View>
                <Text style={{ fontSize: hp(1.6) }} className="font-semibold text-neutral-500">Last message</Text>
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
        borderBottomWidth: noBorder ? '' : 0.2,
        // borderBottomColor: 'grey'
    },
});