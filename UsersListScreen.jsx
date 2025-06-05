import React, { useEffect, useState, useContext } from 'react';
import {View,Text,FlatList,TouchableOpacity,ActivityIndicator,TextInput,StyleSheet,} from 'react-native';
import { collection,query, orderBy,onSnapshot,where  } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { UserContext } from './UserContext';
import Icon from 'react-native-vector-icons/Feather';
import { useFonts } from 'expo-font';
import {Inter_400Regular,Inter_300Light, Inter_700Bold,Inter_100Thin,Inter_200ExtraLight } from '@expo-google-fonts/inter';
import { useNavigation } from '@react-navigation/native';

export default function UsersListScreen() {
    const navigation = useNavigation();  // 💡 Get the navigation object

  const { Loggeduser, loadingUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [messageListeners, setMessageListeners] = useState([]);

  //FONTS
   const [fontsLoaded] = useFonts({
       Inter_400Regular,
       Inter_700Bold,
       Inter_100Thin,
       Inter_200ExtraLight,
       Inter_300Light
     });

  useEffect(() => {
    if (!loadingUser && Loggeduser) {
      const unsubscribe = setupChatsListener();
      return () => unsubscribe(); // ניקוי מאזינים בזמן מעבר מסך
    }
  }, [loadingUser, Loggeduser]);
  

  const setupChatsListener = () => {
    const q = query(collection(db, 'chats'), where('participants', 'array-contains', Loggeduser.id));
    console.log('sending to firebase :',Loggeduser.id)
    const unsubscribeChats = onSnapshot(q, (chatsSnapshot) => {
        console.log('🔥 Snapshot size:', chatsSnapshot.size);

      const listeners = [];
      const foundUsers = new Map();
  
      chatsSnapshot.docs.forEach((docSnap) => {

        const chatId = docSnap.id;
        const chatData = docSnap.data();
  
        console.log('📦 Found chat ID:', chatId);
        
        const otherUserId = chatData.participants.find((id) => id !== Loggeduser.id);
        const otherUserMeta = chatData.participantsMeta[otherUserId];
        const otherUserEmail = otherUserMeta?.email;
        console.log('✅ Matched chat, logged user is:', Loggeduser.id);

        console.log('✅ Matched chat, other user is:', otherUserId);
console.log('other user data:',otherUserEmail,otherUserMeta)
   
        if (!foundUsers.has(otherUserId)) {
          const messagesRef = collection(db, `chats/${chatId}/messages`);
          const q = query(messagesRef, orderBy('createdAt', 'desc'));
  
          const unsubscribeMessages = onSnapshot(q, async (messagesSnapshot) => {
            try {
              const messages = messagesSnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  text: data.text || '',
                  createdAt: data.createdAt?.toDate?.() || null,
                  sender: data.user?._id || '',
                  read: data.read,
                };
              }).filter((msg) => msg.createdAt !== null);
  
              const lastMessage = messages.length > 0 ? messages[0].text : '';
              const lastMessageTime = messages.length > 0 ? messages[0].createdAt : new Date(0);
              
  
              const unreadCount = messages.filter(
                (msg) => msg.sender !== Loggeduser._id && !msg.read
              ).length;
  
              foundUsers.set(otherUserId, {
                _id: otherUserId,
                name: otherUserEmail, // You can improve this by fetching user name later
                email:otherUserEmail,
                lastMessage,
                lastMessageTime,
                unreadCount,
              });
  
              const updatedUsers = Array.from(foundUsers.values()).sort(
                (a, b) => (b.lastMessageTime?.getTime() || 0) - (a.lastMessageTime?.getTime() || 0)
              );
  
              setUsers(updatedUsers);
              setFilteredUsers(updatedUsers);
              setLoadingChats(false);
            } catch (error) {
              console.log('❌ Error loading messages:', error);
            }
          });
  
          listeners.push(unsubscribeMessages);
        }
      });
  
      setMessageListeners(listeners);
    });
  
    return () => {
      unsubscribeChats();
      messageListeners.forEach((unsub) => unsub());
    };
  };
  
  

  // בתוך UsersListComponent.jsx (שימי לב: יצירת קובץ נפרד או שינוי הקיים)

  const openChat = (otherUser) => {
    navigation.navigate('ChatScreen', {
        user: Loggeduser,
        otherUser: {
          _id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          image: otherUser.image || null,
        }
      });
  };





  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  if (loadingUser || loadingChats) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.textMessages}> Loading...</Text>
      </View>
    );
  }

  if (!Loggeduser) {
    return (
      <View style={styles.centered}>
        <Text style={styles.textMessages}>No LoggedIn user found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
            <View style={styles.avatarPlaceholder} />
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.date}>
                  {item.lastMessageTime
    ? `${item.lastMessageTime.toLocaleDateString('he-IL')} ${item.lastMessageTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`
    : ''}</Text>
              </View>
              <View style={styles.chatFooter}>
                <Text style={styles.message} numberOfLines={1}>
                  {item.lastMessage || 'No Messages Found'}
                </Text>
                {item.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.textMessages}> No previous conversations found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    fontFamily:"Inter_400Regular"

  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontFamily:"Inter_400Regular",
    outlineStyle: 'none',
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
    fontFamily:"Inter_400Regular"

  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontFamily:"Inter_400Regular"

  },
  date: {
    fontSize: 12,
    color: '#999',
    fontFamily:"Inter_400Regular"

  },
  message: {
    fontSize: 14,
    color: '#666',
    flex: 1,

    
  },
  unreadBadge: {
    backgroundColor: '#9FF9D5',
    borderRadius: 999,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textMessages:{
    fontFamily:"Inter_400Regular"

  }
});