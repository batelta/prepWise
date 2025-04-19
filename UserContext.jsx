import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [Loggeduser, setLoggedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setLoggedUser(JSON.parse(storedUser));
        console.log('Loaded from storage:', storedUser);
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
    } finally {
      setLoadingUser(false); // ✅ Make sure we stop the loading state
    }
  };
  

  useEffect(() => {
    loadUser(); // Only load once when the app starts
  }, []);

  return (
    <UserContext.Provider value={{ Loggeduser, setLoggedUser, loadUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};
