import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CharRoomHeader from "../components/CharRoomHeader";
import MessageList from "../components/MessageList";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomKeyboardView from "../components/CustomKeyboardView";
import { useAuth } from "../../context/authContext";
import { getRoomId } from "../../utils/constants";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Dialogflow_V2 } from "react-native-dialogflow";
import { dialogFlowConfig } from "../../env";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Image } from "expo-image";

export default function ChatRoom() {
  const item = useLocalSearchParams();
  const { roomId } = item;
  const { user } = useAuth();
  console.log(item, "param item");
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const textRef = useRef();
  const fileRef = useRef(null);
  const styles = stylesWrapepr();
  const inputRef = useRef(null);
  const scrollviewRef = useRef(null);

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      dialogFlowConfig.client_email,
      dialogFlowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogFlowConfig.project_id
    );
  }, []);

  useEffect(() => {
    createRoomIfNotExists();
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setMessages([...allMessages]);
    });

    const keyboardListerner = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );
    return () => {
      unsub();
      keyboardListerner.remove();
    };
  }, []);
  console.log("all messages", messages);

  const createRoomIfNotExists = async () => {
    // roomid
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      type: item?.type == "bot" ? "bot" : "user",
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  const handleBotResponse = (msg) => {
    Dialogflow_V2.requestQuery(
      msg,
      (result) => {
        console.log("result", result);
        handleGoogleResponse(result);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const handleSelectFile = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "We need permission to access your media library."
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      fileRef.current = result.assets[0];
    }
  };

  const handleGoogleResponse = async (result) => {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    try {
      const docRef = doc(db, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      const newDoc = await addDoc(messagesRef, {
        userId: item?.userId,
        text: text,
        profileUrl: item?.profileUrl,
        senderName: item.username,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (e) {
      Alert.alert("Message", e.message);
    }
  };

  const handleTextSend = async () => {
    console.log(user, item, "users");
    let message = textRef.current.trim();
    if (!message) return;
    try {
      const docRef = doc(db, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      textRef.current = "";
      if (inputRef) inputRef.current?.clear();
      const newDoc = await addDoc(messagesRef, {
        userId: user?.userId,
        text: message,
        profileUrl: user?.profileUrl,
        senderName: user.username,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (e) {
      Alert.alert("Message", e.message);
    }
    if (item?.type == "bot") handleBotResponse(message);
  };

  const handleSendMessage = async () => {
    if (fileRef.current) {
      handleSendFileMessage();
    } else {
      handleTextSend();
    }
  };

  const handleSendFileMessage = async () => {
    if (!fileRef.current) {
      Alert.alert("Error", "No file selected");
      return;
    }
    let message = textRef.current.trim();
    const file = fileRef.current;
    const storage = getStorage();
    const storageRef = ref(storage, `files/${file.fileName}`);

    try {
      // Upload file to Firebase Storage
      const response = await fetch(file.uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      // Get the file URL
      const fileURL = await getDownloadURL(storageRef);

      // Determine the file type
      const fileType = file.type.split("/")[0];

      // Add file message to Firestore
      const docRef = doc(db, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      await addDoc(messagesRef, {
        userId: user?.userId,
        type: "file",
        fileType: fileType,
        fileURL: fileURL,
        text: message, // Include the message
        profileUrl: user?.profileUrl,
        senderName: user.username,
        createdAt: Timestamp.fromDate(new Date()),
      });

      // Clear the message and file reference
      textRef.current = "";
      fileRef.current = null;
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const handleCancel = () => {
    fileRef.current = null;
  };

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollviewRef?.current?.scrollToEnd({ animated: false });
    }, 100);
  };
  return (
    <CustomKeyboardView isPush>
      <View className="flex-1">
        <StatusBar style="dark" />
        <CharRoomHeader user={item} router={router} />
        <View className="h-3 border-b border-neutral-300"></View>
        <View className="flex-1 justify-between bg-neutral-100 overflow-visible">
          <MessageList
            scrollviewRef={scrollviewRef}
            messages={messages}
            currentUser={user}
          />
        </View>
        {fileRef?.current && (
          <View className="bg-white p-2 mx-4 rounded-lg relative">
            <View style={{ height: 100, width: 100, display: "relative" }}>
              <Image
                ref={fileRef}
                source={fileRef.current}
                style={{ height: 100, width: 100 }}
              />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text className="text-white">✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={{ marginBottom: hp(2.7) }} className="pt-2">
          <View className="flex-row mx-3 justify-between bg-white border p-2 border-neutral-300 rounded-full pl-5">
            <TouchableOpacity
              onPress={handleSelectFile}
              style={styles.messageButton}
            >
              <Feather name="file" size={hp(2.7)} color="#737373" />
            </TouchableOpacity>
            <TextInput
              ref={inputRef}
              onChangeText={(value) => (textRef.current = value)}
              placeholder="Type Message..."
              style={{ fontSize: hp(2) }}
              className="flex-1 mr-2"
            />

            <TouchableOpacity
              onPress={handleSendMessage}
              style={styles.messageButton}
            >
              <Feather name="send" size={hp(2.7)} color="#737373" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}

const stylesWrapepr = () =>
  StyleSheet.create({
    messageButton: {
      backgroundColor: "white",
      padding: 10,
      marginRight: "1px",
      borderRadius: 100,
    },
    cancelButton: {
      position: "absolute",
      top: -5,
      right: -5,
      backgroundColor: "red",
      borderRadius: 15,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
  });
