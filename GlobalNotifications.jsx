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
  const [notificationModal, setNotificationModal] = useState({
    visible: false,
    meeting: null,
    type: null
  });
  const prevMeetingsRef = useRef(new Map());
  const isInitialLoadRef = useRef(true);
  const slideAnim = useRef(new Animated.Value(300)).current; // Start from right (300px off screen)
  const reminderIntervalRef = useRef(null);

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

  // Start reminder check interval
  useEffect(() => {
    startReminderCheck();
    return () => {
      if (reminderIntervalRef.current) {
        clearInterval(reminderIntervalRef.current);
      }
    };
  }, [userEmail]);

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
      await AsyncStorage.setItem(`notifications_${userEmail}, JSON.stringify(notifications)`);
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  };

  // Function to check for upcoming meetings and create reminders
  const checkForUpcomingMeetings = async () => {
    if (!userEmail) return;

    try {
      const q = query(
        collection(db, 'meetings'),
        where('participants', 'array-contains', userEmail)
      );

      // Get current meetings snapshot
      const querySnapshot = await new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            unsubscribe();
            resolve(snapshot);
          },
          (error) => {
            unsubscribe();
            reject(error);
          }
        );
      });

      const now = new Date();
      
      // Get stored reminder notifications to avoid duplicates
      const storedReminders = await AsyncStorage.getItem(`reminders_${userEmail}`);
      const sentReminders = storedReminders ? JSON.parse(storedReminders) : [];

      const newReminders = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const meetingDateTime = data.Datetime.toDate();
        
        // Check if meeting is tomorrow (within 24-25 hours from now)
        const timeDiff = meetingDateTime.getTime() - now.getTime();
        const hoursUntilMeeting = timeDiff / (1000 * 60 * 60);
        
        if (hoursUntilMeeting > 23 && hoursUntilMeeting <= 25) {
          const reminderId = `${doc.id}_reminder_${meetingDateTime.toDateString()}`;
          
          // Check if we already sent this reminder
          if (!sentReminders.includes(reminderId)) {
            const meetingData = {
              id: doc.id,
              title: data.title,
              datetime: meetingDateTime,
              participants: data.participants,
              createdBy: data.createdBy || data.participants[0],
              duration: data.duration || 30
            };

            const newReminder = {
              id: reminderId,
              type: 'meeting_reminder',
              meeting: meetingData,
              timestamp: new Date(),
              read: false
            };

            newReminders.push(newReminder);
            sentReminders.push(reminderId);

            // Show modal for reminder
            setNotificationModal({
              visible: true,
              meeting: meetingData,
              type: 'meeting_reminder'
            });
          }
        }
      });

      if (newReminders.length > 0) {
        setNotifications(prev => [...newReminders, ...prev]);
        setUnreadCount(prev => prev + newReminders.length);
        
        // Save updated reminders list
        await AsyncStorage.setItem(`reminders_${userEmail}`, JSON.stringify(sentReminders));
      }

    } catch (error) {
      console.error('Error checking for upcoming meetings:', error);
    }
  };

  const startReminderCheck = () => {
    // Check immediately
    checkForUpcomingMeetings();
    
    // Then check every hour
    reminderIntervalRef.current = setInterval(() => {
      checkForUpcomingMeetings();
    }, 60 * 60 * 1000); // Every hour
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
            const newMeetingNotification = {
              id: meetingId + 'new' + Date.now(),
              type: 'new_meeting',
              meeting: meetingData,
              timestamp: new Date(),
              read: false
            };

            newNotifications.push(newMeetingNotification);

            // Show modal for new meeting
            setNotificationModal({
              visible: true,
              meeting: meetingData,
              type: 'new_meeting'
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

  const closeNotificationModal = () => {
    setNotificationModal({
      visible: false,
      meeting: null,
      type: null
    });
  };

  const clearAllNotifications = async () => {
    setNotifications([]);
    setUnreadCount(0);
    setModalVisible(false);
    // Clear from AsyncStorage
    try {
      await AsyncStorage.removeItem(`notifications_${userEmail}`);
      await AsyncStorage.removeItem(`reminders_${userEmail}`);
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

  const getNotificationTitle = (type) => {
    switch (type) {
      case 'new_meeting':
        return 'פגישה חדשה';
      case 'meeting_reminder':
        return 'תזכורת פגישה';
      default:
        return 'הודעה';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_meeting':
        return 'event';
      case 'meeting_reminder':
        return 'schedule';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'new_meeting':
        return '#d6cbff';
      case 'meeting_reminder':
        return '#ffa726';
      default:
        return '#d6cbff';
    }
  };

  const getModalTitle = (type) => {
    switch (type) {
      case 'new_meeting':
        return '🗓️ פגישה חדשה';
      case 'meeting_reminder':
        return '⏰ תזכורת פגישה';
      default:
        return '🗓️ הודעה';
    }
  };

  const getModalSubtitle = (type) => {
    switch (type) {
      case 'new_meeting':
        return 'נקבעה עבורך פגישה חדשה:';
      case 'meeting_reminder':
        return 'הפגישה שלך מתקיימת מחר:';
      default:
        return 'פרטי הפגישה:';
    }
  };

  const renderNotificationItem = ({ item }) => (
    <View style={[styles.notificationItem, !item.read && styles.unreadNotification]}>
      <View style={styles.notificationHeader}>
        <Icon 
          name={getNotificationIcon(item.type)} 
          size={20} 
          color={getNotificationColor(item.type)} 
        />
        <Text style={styles.notificationTitle}>{getNotificationTitle(item.type)}</Text>
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
      
      {item.type === 'meeting_reminder' && (
        <Text style={styles.reminderText}>
          ⏰ הפגישה תתקיים מחר!
        </Text>
      )}
      
      {!item.read && <View style={styles.unreadDot} />}
    </View>
  );

  const NotificationModal = () => {
    if (!notificationModal.meeting) return null;

    const formattedDate = notificationModal.meeting.datetime.toLocaleDateString('he-IL');
    const formattedTime = notificationModal.meeting.datetime.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={notificationModal.visible}
        onRequestClose={closeNotificationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Icon 
              name={getNotificationIcon(notificationModal.type)} 
              size={50} 
              color={getNotificationColor(notificationModal.type)} 
              style={{ marginBottom: 15 }} 
            />
            <Text style={styles.modalTitle}>{getModalTitle(notificationModal.type)}</Text>
            <Text style={styles.modalSubtitle}>{getModalSubtitle(notificationModal.type)}</Text>
            
            <View style={styles.meetingDetailsModal}>
              <Text style={styles.meetingTitleModal}>📌 {notificationModal.meeting.title}</Text>
              <Text style={styles.meetingDateModal}>🗓️ {formattedDate}</Text>
              <Text style={styles.meetingTimeModal}>🕒 {formattedTime}</Text>
              {notificationModal.meeting.duration && (
                <Text style={styles.meetingTimeModal}>⏱️ משך: {notificationModal.meeting.duration} דקות</Text>
              )}
            </View>

            <TouchableOpacity 
              onPress={closeNotificationModal} 
              style={[styles.modalButton, { backgroundColor: getNotificationColor(notificationModal.type) }]}
            >
              <Text style={styles.modalButtonText}>אישור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

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
              <Text style={styles.modalTitleSide}>הודעות</Text>
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

      {/* Notification Modal */}
      <NotificationModal />
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
    width: '35%', // עודכן ל-35% (100% - 65% של התפריט)
  },
  sideMenuOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sideMenuContainer: {
    backgroundColor: '#fff',
    width: '65%', // הצרתי מ-80% ל-65%
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
    fontSize: 14,
    paddingLeft:10
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
const Webstyles = StyleSheet.create({
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