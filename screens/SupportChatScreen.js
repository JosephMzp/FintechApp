import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function SupportChatScreen({ navigation }) {
  const { isDark } = useTheme();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: '¡Hola! Bienvenido al soporte de CoinPay. ¿En qué puedo ayudarte hoy?', sender: 'bot', time: 'Justo ahora' },
    { id: '2', text: 'Puedes elegir una opción o escribir tu duda:', sender: 'bot', options: ['Problema con un pago', 'Mi saldo', 'Contactar asesor'], time: 'Justo ahora' },
  ]);

  const flatListRef = useRef(null);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    simulateBotResponse(text);
  };

  const simulateBotResponse = (userText) => {
    let botReplyText = "Entiendo. Un momento mientras reviso esa información...";
    const lowerText = userText.toLowerCase();
    if (lowerText.includes('saldo')) botReplyText = "Tu saldo actual es S/20,000. ¿Deseas ver el historial?";
    else if (lowerText.includes('pago') || lowerText.includes('envío')) botReplyText = "Para problemas con pagos, asegúrate de tener el ID de transacción a la mano. ¿Lo tienes?";
    else if (lowerText.includes('asesor') || lowerText.includes('humano')) botReplyText = "Te estoy conectando con un agente humano. El tiempo de espera es de 2 minutos.";
    else if (lowerText.includes('hola')) botReplyText = "¡Hola! ¿Cómo estás?";

    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botReplyText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderItem = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[
        styles.messageWrapper,
        isUser ? styles.userMessageWrapper : styles.botMessageWrapper
      ]}>
        {!isUser && (
          <View style={[styles.botAvatar, { backgroundColor: isDark ? '#FFC107' : '#FFC107' }]}>
            <MaterialCommunityIcons name="robot-happy" size={20} color="#fff" />
          </View>
        )}
        <View style={{ maxWidth: '80%' }}>
          <View style={[
            styles.messageBubble,
            isUser ? { ...styles.userBubble, backgroundColor: isDark ? '#347AF0' : '#347AF0' } 
                   : { ...styles.botBubble, backgroundColor: isDark ? '#1e1e1e' : '#fff', borderColor: isDark ? '#333' : '#eee' }
          ]}>
            <Text style={[
              styles.messageText, 
              isUser ? styles.userText : { ...styles.botText, color: isDark ? '#fff' : '#333' }
            ]}>
              {item.text}
            </Text>
          </View>
          {item.options && (
            <View style={styles.optionsContainer}>
              {item.options.map((opt, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.optionButton, { borderColor: isDark ? '#347AF0' : '#347AF0', backgroundColor: isDark ? '#000' : '#EAF2FF' }]}
                  onPress={() => sendMessage(opt)}
                >
                  <Text style={[styles.optionText, { color: isDark ? '#347AF0' : '#347AF0' }]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <Text style={[styles.timeText, { color: isDark ? '#999' : '#999' }, isUser ? {alignSelf:'flex-end'} : {alignSelf:'flex-start'}]}>
            {item.time}
          </Text>
        </View>
        {isUser && (
          <View style={[styles.userAvatar, { backgroundColor: isDark ? '#347AF0' : '#347AF0' }]}>
            <Feather name="user" size={20} color="#fff" />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F9FAFB' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: isDark ? '#1e1e1e' : '#fff', borderBottomColor: isDark ? '#333' : '#eee' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={28} color={isDark ? '#fff' : '#333'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#333' }]}>Soporte CoinPay</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff', borderTopColor: isDark ? '#333' : '#eee' }]}>
          <TouchableOpacity style={styles.attachBtn}>
            <Feather name="paperclip" size={22} color={isDark ? '#ccc' : '#999'} />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? '#000' : '#F0F2F5', color: isDark ? '#fff' : '#000' }]}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={isDark ? '#888' : '#999'}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, { backgroundColor: inputText ? '#347AF0' : '#ccc' }]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText}
          >
            <Feather name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  list: { flex: 1 },
  listContent: { padding: 20, paddingBottom: 10 },
  messageWrapper: { flexDirection: 'row', marginBottom: 20, alignItems: 'flex-end' },
  userMessageWrapper: { justifyContent: 'flex-end' },
  botMessageWrapper: { justifyContent: 'flex-start' },
  botAvatar: { width: 35, height: 35, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  userAvatar: { width: 35, height: 35, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  messageBubble: { padding: 15, borderRadius: 20, minWidth: 100 },
  botBubble: { borderTopLeftRadius: 5, borderWidth: 1 },
  userBubble: { borderBottomRightRadius: 5 },
  messageText: { fontSize: 15, lineHeight: 22 },
  botText: {},
  userText: { color: '#fff' },
  timeText: { fontSize: 11, marginTop: 5 },
  optionsContainer: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap' },
  optionButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 15, marginRight: 8, marginBottom: 8, borderWidth: 1 },
  optionText: { fontSize: 13, fontWeight: '600' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 10, fontSize: 16, maxHeight: 100 },
  sendBtn: { width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  attachBtn: { padding: 5 },
});
