import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image,TouchableOpacity  } from 'react-native';
import { GiftedChat, Bubble,Send } from 'react-native-gifted-chat';
import { db } from './firebaseConfig';
import {collection,addDoc,onSnapshot,query,orderBy,Timestamp, doc, updateDoc,getDoc, setDoc} from 'firebase/firestore';
import { useFonts } from 'expo-font';
import {Inter_400Regular,Inter_300Light, Inter_700Bold,Inter_100Thin,Inter_200ExtraLight } from '@expo-google-fonts/inter';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
//import * as ImagePicker from 'expo-image-picker';


const getChatId = (id1, id2) => {
    return [id1, id2].sort().join('_');
  };
  

export default function ChatScreen({ route }) {
    const { user,otherUser } = route.params;

console.log("inside chatscreen:",'loggeduser:',user,'otheruser:',otherUser)
  //FONTS
   const [fontsLoaded] = useFonts({
       Inter_400Regular,
       Inter_700Bold,
       Inter_100Thin,
       Inter_200ExtraLight,
       Inter_300Light
     });
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

  // נוודא ש־_id תמיד קיים ונשתמש בו
  const currentUserFixed = {
    _id: user.id,
    name: user.email,
    //name: currentUser.name , 
    //email: currentUser.email,

  };

  const otherUserFixed = {
    _id: otherUser.userID||otherUser._id,
    name:otherUser.email,
    ////name: otherUser.name ,
    //email: otherUser.email
  };

  const chatId = getChatId(currentUserFixed._id, otherUserFixed._id);
  console.log("👤 currentUserFixed._id:", currentUserFixed._id);
console.log("👤 otherUserFixed._id:", otherUserFixed._id);
  console.log("📌 chatId is:", chatId);

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'desc')
    );
  
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesFirestore = snapshot.docs.map(doc => {
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
  
      // נעדכן את ההודעות שהן לא נקראו ונשלחו על ידי המשתמש השני
      const unreadMessages = snapshot.docs.filter(doc => {
        const data = doc.data();
        return (
          data.user._id !== currentUserFixed._id &&
          !data.read
        );
      });
  
      for (const msg of unreadMessages) {
        const msgRef = doc(db, 'chats', chatId, 'messages', msg.id);
        await updateDoc(msgRef, { read: true });
      }
    });
  
    return () => unsubscribe();
  }, [chatId]);
  

  const onSend = useCallback(async (messages = []) => {
    console.log('🚀 onSend called');

    try {
      const msg = messages[0];
  
      // Save the message
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: msg.text,
        createdAt: Timestamp.now(),
        user: {
          _id: currentUserFixed._id,
          name: user.name || user.email,
        },
        read: false
      });

      console.log("📌 chatId is:", chatId);

      // Save or update the chat metadata
      await setDoc(doc(db, 'chats', chatId), {
        participants: [currentUserFixed._id, otherUserFixed._id], // 🔥 array for querying
        participantsMeta: {
          [currentUserFixed._id]: {
            id: currentUserFixed._id,
            name: user.name || user.email,
            email: user.email
          },
          [otherUserFixed._id]: {
            id: otherUserFixed._id,
            name: otherUser.name || otherUser.email,
            email: otherUser.email
          }
        },
        lastMessage: {
          text: msg.text,
          createdAt: Timestamp.now()
        },
        updatedAt: Timestamp.now()
      }, { merge: true });
      
  
      console.log('✅ Chat metadata saved or updated');
  
    } catch (error) {
      console.error('❌ Failed to save chat metadata:', error);
    }
  }, [chatId]);
  
  

const renderSend = (props) => {
  return (
    <Send {...props}>
      <View style={{ marginRight: 10, marginBottom: 5 }}>
        <Text style={{
          color: '#9FF9D5', 
          fontSize: 14,
          fontFamily: 'Inter_400Regular', 
        }}>
          Send
        </Text>
      </View>
    </Send>
  );
};


  const renderBubble = (props) => {
    const isCurrentUser = props.currentMessage.user._id === currentUserFixed._id;

   
    

    return (
      /*<Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: isCurrentUser ? '#9FF9D5' : '#F5F5F5',
          },
          left: {
            backgroundColor: isCurrentUser ? '#F5F5F5' : '#9FF9D5',
          },
        }}
        textStyle={{
          right: {
            color: isCurrentUser ? '#fff' : '#000',
          },
          left: {
            color: isCurrentUser ? '#000' : '#fff',
          },
        }}
      />*/
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
        right: {
          color: isCurrentUser ? 'gray' : 'gray', // ← תעדכני לצבע שייראה ברור
        },
        left: {
          color: isCurrentUser ? 'gray' : 'gray',
        },
      }}
/>

    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header with name and image */}
      <View style={styles.header}>
        <Image
          source={{ uri: otherUser.image || 'https://via.placeholder.com/40' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{otherUser.name || otherUser.email}</Text>
      </View>
  
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={currentUserFixed}
        renderUsernameOnMessage
        renderBubble={renderBubble}
        renderActions={renderActions}
        renderSend={renderSend}


      />
    </View> // ← סוגר את ה־<View style={{ flex: 1 }}>
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