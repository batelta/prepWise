import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [Loggeduser, setLoggedUser] = useState(null);

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      setLoggedUser(JSON.parse(storedUser));
      console.log('Loaded from storage:', storedUser);
    }
  };

  useEffect(() => {
    loadUser(); // Only load once when the app starts
  }, []);

  return (
    <UserContext.Provider value={{ Loggeduser, setLoggedUser, loadUser }}>
      {children}
    </UserContext.Provider>
  );
};
