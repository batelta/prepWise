
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, FlatList, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GlobalNotifications({ userEmail }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const prevMeetingsRef = useRef(new Map());
  const isInitialLoadRef = useRef(true);
  const slideAnim = useRef(new Animated.Value(300)).current; // Start from right (300px off screen)

  // Load notifications from AsyncStorage when component mounts
  useEffect(() => {
    loadNotificationsFromStorage();
  }, []);

  // Save notifications to AsyncStorage whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      saveNotificationsToStorage();
    }
  }, [notifications]);

  const loadNotificationsFromStorage = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem(`notifications_${userEmail}`);
      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications).map(notif => ({
          ...notif,
          timestamp: new Date(notif.timestamp),
          meeting: {
            ...notif.meeting,
            datetime: new Date(notif.meeting.datetime)
          }
        }));
        setNotifications(parsedNotifications);
        const unreadNotifications = parsedNotifications.filter(notif => !notif.read);
        setUnreadCount(unreadNotifications.length);
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
    }
  };

  const saveNotificationsToStorage = async () => {
    try {
      await AsyncStorage.setItem(`notifications_${userEmail}`, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  };

  useEffect(() => {
    if (!userEmail) return;

    const q = query(
      collection(db, 'meetings'),
      where('participants', 'array-contains', userEmail)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const currentMeetings = new Map();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        currentMeetings.set(doc.id, {
          id: doc.id,
          title: data.title,
          datetime: data.Datetime.toDate(),
          participants: data.participants,
          createdBy: data.createdBy || data.participants[0],
          duration: data.duration || 30
        });
      });

      // Skip on initial load
      if (isInitialLoadRef.current) {
        prevMeetingsRef.current = currentMeetings;
        isInitialLoadRef.current = false;
        return;
      }

      // Check for new meetings and add to notifications
      const newNotifications = [];
      currentMeetings.forEach((meetingData, meetingId) => {
        if (!prevMeetingsRef.current.has(meetingId)) {
          const isCreator = meetingData.createdBy === userEmail;
          
          if (!isCreator) {
            newNotifications.push({
              id: meetingId + '_' + Date.now(),
              type: 'new_meeting',
              meeting: meetingData,
              timestamp: new Date(),
              read: false
            });
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
        setUnreadCount(prev => prev + newNotifications.length);
      }

      prevMeetingsRef.current = currentMeetings;
    });

    return () => unsubscribe();
  }, [userEmail]);

  const openNotifications = () => {
    setModalVisible(true);
    // Animate slide in from right
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeNotifications = () => {
    // Animate slide out to right
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
    
    // Mark all as read
    setNotifications(prev => {
      const updatedNotifications = prev.map(notif => ({ ...notif, read: true }));
      return updatedNotifications;
    });
    setUnreadCount(0);
  };

  const clearAllNotifications = async () => {
    setNotifications([]);
    setUnreadCount(0);
    setModalVisible(false);
    // Clear from AsyncStorage
    try {
      await AsyncStorage.removeItem(`notifications_${userEmail}`);
    } catch (error) {
      console.error('Error clearing notifications from storage:', error);
    }
  };

  const formatDateTime = (date) => {
    const formattedDate = date.toLocaleDateString('he-IL');
    const formattedTime = date.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${formattedDate} ${formattedTime}`;
  };

  const renderNotificationItem = ({ item }) => (
    <View style={[styles.notificationItem, !item.read && styles.unreadNotification]}>
      <View style={styles.notificationHeader}>
        <Icon name="event" size={20} color="#d6cbff" />
        <Text style={styles.notificationTitle}>פגישה חדשה</Text>
        <Text style={styles.notificationTime}>
          {item.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      
      <Text style={styles.meetingTitle}>📌 {item.meeting.title}</Text>
      <Text style={styles.meetingDetails}>
        🗓️ {formatDateTime(item.meeting.datetime)}
      </Text>
      <Text style={styles.meetingDetails}>
        ⏱️ משך: {item.meeting.duration} דקות
      </Text>
      
      {!item.read && <View style={styles.unreadDot} />}
    </View>
  );

  return (
    <>
      {/* Floating Notification Icon */}
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={openNotifications}
      >
        <Icon 
          name="notifications" 
          size={24} 
          color={unreadCount > 0 ? "#d6cbff" : "#999"} 
        />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Notifications Side Menu */}
      <Modal
        transparent={true}
        animationType="none"
        visible={modalVisible}
        onRequestClose={closeNotifications}
      >
        <View style={styles.sideMenuOverlay}>
          {/* Transparent background to close menu when clicking outside */}
          <TouchableOpacity 
            style={styles.backgroundTouchable} 
            onPress={closeNotifications} 
            activeOpacity={1}
          />
          <Animated.View style={[styles.sideMenuContainer, { transform: [{ translateX: slideAnim }] }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>הודעות</Text>
              <View style={styles.headerButtons}>
                {notifications.length > 0 && (
                  <TouchableOpacity onPress={clearAllNotifications}>
                    <Text style={styles.clearButton}>נקה הכל</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={closeNotifications}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Notifications List */}
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="notifications-none" size={48} color="#ccc" />
                <Text style={styles.emptyText}>אין הודעות חדשות</Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                renderItem={renderNotificationItem}
                keyExtractor={(item) => item.id}
                style={styles.notificationsList}
                showsVerticalScrollIndicator={false}
              />
            )}
 </Animated.View>        
 </View>
        
      </Modal>
      
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  backgroundTouchable: {
    flex: 1,
    width: '55%', // עודכן ל-35% (100% - 65% של התפריט)
  },
  sideMenuOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sideMenuContainer: {
    backgroundColor: '#fff',
    width: '45%', // הצרתי מ-80% ל-65%
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  clearButton: {
    color: '#d6cbff',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  notificationsList: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#d6cbff',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#999',
  },
  meetingTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#333',
    marginBottom: 4,
  },
  meetingDetails: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginBottom: 2,
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d6cbff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#999',
    marginTop: 10,
  },
});