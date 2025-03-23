import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { View, Text, TextInput, Button, FlatList, StyleSheet,TouchableOpacity  } from "react-native";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import axios from "axios";

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStopIcon, setShowStopIcon] = useState(false);
  const [apiError, setApiError] = useState(null);

  const API_KEY = "AIzaSyDtX7_UXPgZWz-nDuZFApKJvPk_AyV9-D4";  // Replace with your actual API key

  // Initialize the model when the component is first mounted
  useEffect(() => {
    const initChat = async () => {
      try {
        const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
        const model = await genAI.getGenerativeModel({
          model: "models/text-bison-001", // Specify the model variant here
        });
        
        if (model) {
          console.log("Model initialized successfully:", model);
          // Send a greeting message when the chat is initialized
          const result = await model.generateText({ prompt: "hello!" });
          const response = result.response;
          showMessage({
            message: "Welcome to Gemini Chat 🤖",
            description: response,
            type: "info",
            icon: "info",
            duration: 2000,
          });
          setMessages([
            { text: response, user: false },
          ]);
        } else {
          console.log("Model initialization failed.");
        }
      } catch (error) {
        setApiError("Error initializing model: " + error.message);
        console.error("Error initializing model:", error);
      }
    };

    initChat();
  }, []); // Only run once when the component is mounted

  // Function to send the user's message to the model and get a response
  const sendMessage = async () => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = await genAI.getGenerativeModel({
        model: "models/text-bison-001", // Specify the model variant here
      });

      const userMessage = { text: userInput, user: true };
      setMessages([...messages, userMessage]);

      const result = await model.generateText({ prompt: userInput });
      const response = result.response;

      setMessages([...messages, { text: userInput, user: true }, { text: response, user: false }]);
      setLoading(false);
      setUserInput("");  // Clear the input field

      // Speak the bot's response if not already speaking
      if (response && !isSpeaking) {
        Speech.speak(response);
        setIsSpeaking(true);
        setShowStopIcon(true);
      }
    } catch (error) {
      setApiError("Error generating message: " + error.message);
      console.error("Error generating message:", error);
      setLoading(false);
    }
  };

  // Function to toggle speech (stop or continue speaking)
  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(messages[messages.length - 1].text);
      setIsSpeaking(true);
    }
  };

  // Function to clear the chat
  const ClearMessage = () => {
    setMessages([]);
    setIsSpeaking(false);
    setShowStopIcon(false);
  };

  // Render the message list
  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={[styles.messageText, item.user && styles.userMessage]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Display FlashMessage if there's an error */}
      {apiError && <Text style={{ color: "red" }}>{apiError}</Text>}
      
      {/* Display the chat messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        inverted
      />

      {/* Input section for the user */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.micIcon} onPress={toggleSpeech}>
          {isSpeaking ? (
            <FontAwesome
              name="microphone-slash"
              size={24}
              color="white"
              style={{ justifyContent: "center", alignItems: "center" }}
            />
          ) : (
            <FontAwesome
              name="microphone"
              size={24}
              color="white"
              style={{ justifyContent: "center", alignItems: "center" }}
            />
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
          style={styles.input}
          placeholderTextColor="#fff"
        />

        {/* Show stop icon only when speaking */}
        {showStopIcon && (
          <TouchableOpacity style={styles.stopIcon} onPress={ClearMessage}>
            <Entypo name="controller-stop" size={24} color="white" />
          </TouchableOpacity>
        )}

        {loading && <Text>Loading...</Text>}
      </View>

      {/* FlashMessage to display success/error messages */}
      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffff", marginTop: 50 },
  messageContainer: { padding: 10, marginVertical: 5 },
  messageText: { fontSize: 16 },
  userMessage: { textAlign: "right" }, // User's messages are aligned to the right
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 10,
    height: 50,
    color: "white",
  },
  micIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  stopIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
  },
});

export default GeminiChat;
