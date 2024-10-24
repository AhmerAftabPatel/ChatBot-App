import { View, Text } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";

export default function MessageItem({ message, currentUser }) {
  const renderMessage = () => {
    if (message.type === "file") {
      if (message.fileType === "image") {
        return (
          <View className="gap-2">
            <Image
              source={{ uri: message.fileURL }}
              style={{ width: 100, height: 100 }}
            />
            <Text style={{ fontSize: hp(1.9) }}>{message.text}</Text>
          </View>
        );
      }
      // Add more conditions for other file types if needed
    }
    return <Text style={{ fontSize: hp(1.9) }}>{message.text}</Text>;
    // ... existing message rendering ...
  };
  if (currentUser?.userId == message.userId) {
    return (
      <View className="flex-row justify-end mb-3 mr-3">
        <View style={{ width: wp(80) }}>
          <View className="flex self-end border border-neutral-200 p-3 rounded-2xl bg-white">
            {renderMessage()}
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ width: wp(80) }} className="ml-3 mb-3">
        <View className="flex self-start p-3 rounded-2xl bg-orange-100 border border-orange-200">
          {renderMessage()}
        </View>
      </View>
    );
  }
}
