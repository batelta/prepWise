
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import meetingNotifications from './MeetingNotifications'; 
import GlobalNotifications from './GlobalNotifications'; 


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
      setLoadingUser(false); // Make sure we stop the loading state
    }
  };
  

  useEffect(() => {
    loadUser(); // Only load once when the app starts
  }, []);
  const { NotificationModal } = meetingNotifications(Loggeduser?.email);
 // Use the new notification system

  return (
    <>
       <UserContext.Provider value={{ Loggeduser, setLoggedUser, loadUser, loadingUser }}>
      {children}
      {/* Render the notification modal globally */}
      <NotificationModal />
       {/* Render the new global notifications icon */}
        {Loggeduser?.email && <GlobalNotifications userEmail={Loggeduser.email} />}
    </UserContext.Provider>
    </>
  );
};