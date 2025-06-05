import React, { useState, useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import UsersList from './UsersListScreen';
import Chat from './ChatScreen';
import { UserContext } from './UserContext';
import { useNavigation } from '@react-navigation/native';

const MessagesScreen = () => {
  const { Loggeduser } = useContext(UserContext);
  const navigation = useNavigation();

  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    console.log('inside message screen:',Loggeduser)

    navigation.navigate('ChatScreen', {
        user: Loggeduser,
      otherUser: user,
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <UsersList />
      </View>

      <View style={styles.chatArea}>
        <View style={styles.placeholder} />
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: screenWidth * 0.35,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  chatArea: {
    width: screenWidth * 0.65,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesScreen;