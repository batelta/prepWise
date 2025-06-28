import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { db } from './firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_300Light,
  Inter_700Bold,
  Inter_100Thin,
  Inter_200ExtraLight,
} from '@expo-google-fonts/inter';
import Icon from 'react-native-vector-icons/MaterialIcons';

const getChatId = (id1, id2) => {
  return [id1, id2].sort().join('_');
};

export default function ChatScreen({ route }) {
  const { user, otherUser } = route.params;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
  });

  // 🧠 נבנה את האובייקטים בבטיחות:
  const currentUserFixed = {
    _id: user?.id || user?._id,
    name: user?.name || user?.email || 'You',
    email: user?.email,
  };

  const otherUserFixed = {
    _id:
      otherUser?._id ||
      otherUser?.userID ||
      otherUser?.MentorID ||
      otherUser?.JobSeekerID ||
      otherUser?.id ||
      'unknown',
    name:
      otherUser?.name ||
      [otherUser?.FirstName, otherUser?.LastName].filter(Boolean).join(' ') ||
      otherUser?.email ||
      otherUser?.Email ||
      'Unknown',
    image:
      otherUser?.image ||
      otherUser?.Picture ||
      null,
    email: otherUser?.email || otherUser?.Email || '',
  };

  const chatId = getChatId(currentUserFixed._id, otherUserFixed._id);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesFirestore = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          user: data.user,
          read: data.read || false,
        };
      });

      setMessages(messagesFirestore);

      const unreadMessages = snapshot.docs.filter((doc) => {
        const data = doc.data();
        return data.user._id !== currentUserFixed._id && !data.read;
      });

      for (const msg of unreadMessages) {
        const msgRef = doc(db, 'chats', chatId, 'messages', msg.id);
        await updateDoc(msgRef, { read: true });
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const onSend = useCallback(
    async (messages = []) => {
      const msg = messages[0];

      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: msg.text,
        createdAt: Timestamp.now(),
        user: {
          _id: currentUserFixed._id,
          name: currentUserFixed.name,
        },
        read: false,
      });

      await setDoc(
        doc(db, 'chats', chatId),
        {
          participants: [currentUserFixed._id, otherUserFixed._id],
          participantsMeta: {
            [currentUserFixed._id]: {
              id: currentUserFixed._id,
              name: currentUserFixed.name,
              email: currentUserFixed.email,
            },
            [otherUserFixed._id]: {
              id: otherUserFixed._id,
              name: otherUserFixed.name,
              email: otherUserFixed.email,
            },
          },
          lastMessage: {
            text: msg.text,
            createdAt: Timestamp.now(),
          },
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    },
    [chatId]
  );

  const renderBubble = (props) => {
    const isCurrentUser = props.currentMessage.user._id === currentUserFixed._id;

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: { backgroundColor: '#9FF9D5' },
          right: { backgroundColor: '#FFFFFF' },
        }}
        textStyle={{
          left: { color: '#000' },
          right: { color: '#000' },
        }}
        timeTextStyle={{
          left: { color: 'gray' },
          right: { color: 'gray' },
        }}
      />
    );
  };

  const renderSend = (props) => (
    <Send {...props}>
      <View style={{ marginRight: 10, marginBottom: 5 }}>
        <Text style={{ color: '#9FF9D5', fontSize: 14, fontFamily: 'Inter_400Regular' }}>
          Send
        </Text>
      </View>
    </Send>
  );

  const renderActions = (props) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => console.log('Attach file')}>
        <Icon name="attach-file" size={24} color="#555" style={{ marginHorizontal: 5 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log('Open camera')}>
        <Icon name="photo-camera" size={24} color="#555" style={{ marginHorizontal: 5 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log('Record voice')}>
        <Icon name="mic" size={24} color="#555" style={{ marginHorizontal: 5 }} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Header with name and image */}
      <View style={styles.header}>
        <Image
          source={
            otherUserFixed.image
              ? { uri: otherUserFixed.image }
              : require('./assets/defaultProfileImage.jpg')
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{otherUserFixed.name}</Text>
      </View>

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={currentUserFixed}
        renderUsernameOnMessage
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderActions={renderActions}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',

  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontFamily:"Inter_400Regular",
    color: '#333',
  },

});