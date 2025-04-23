import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';

// Connect to the backend server
const socket = io('http://192.168.97.230:3000'); // Replace with your server's IP address

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string, timestamp: string }[]>([]);

  // Listen for incoming messages from the server
  useEffect(() => {
    socket.on('receive_message', (newMessage: { text: string, timestamp: string }) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.off('receive_message');
    };
  }, []);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (message.trim()) {
      const timestamp = new Date().toLocaleTimeString(); // Get current timestamp
      const newMessage = { text: message, timestamp };

      socket.emit('send_message', newMessage); // Send the message with timestamp to the server
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage(''); // Clear the input field
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.message}>{item.text}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          placeholder="Type your message"
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  messageList: {
    flex: 1,
    marginBottom: 20,
  },
  messageContainer: {
    marginBottom: 10,
  },
  message: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f1f1f1',
    marginVertical: 5,
    borderRadius: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
  },
});

export default ChatScreen;
