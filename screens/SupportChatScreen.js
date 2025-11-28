import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function SupportChatScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: '¡Hola! Bienvenido al soporte de CoinPay. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      time: 'Justo ahora',
    },
    {
      id: '2',
      text: 'Puedes elegir una opción o escribir tu duda:',
      sender: 'bot',
      options: ['Problema con un pago', 'Mi saldo', 'Contactar asesor'], // Opciones rápidas
      time: 'Justo ahora',
    },
  ]);

  const flatListRef = useRef(null);

  // Función para enviar mensaje del usuario
  const sendMessage = (text) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    
    // Simular respuesta de la IA
    simulateBotResponse(text);
  };

  // Lógica básica de la "IA"
  const simulateBotResponse = (userText) => {
    let botReplyText = "Entiendo. Un momento mientras reviso esa información...";

    // Reglas simples de respuesta
    const lowerText = userText.toLowerCase();
    if (lowerText.includes('saldo')) {
      botReplyText = "Tu saldo actual es S/20,000. ¿Deseas ver el historial?";
    } else if (lowerText.includes('pago') || lowerText.includes('envío')) {
      botReplyText = "Para problemas con pagos, asegúrate de tener el ID de transacción a la mano. ¿Lo tienes?";
    } else if (lowerText.includes('asesor') || lowerText.includes('humano')) {
      botReplyText = "Te estoy conectando con un agente humano. El tiempo de espera es de 2 minutos.";
    } else if (lowerText.includes('hola')) {
      botReplyText = "¡Hola! ¿Cómo estás?";
    }

    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botReplyText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1500); // 1.5 segundos de "pensando"
  };

  // Scroll automático al final
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
          <View style={styles.botAvatar}>
            <MaterialCommunityIcons name="robot-happy" size={20} color="#fff" />
          </View>
        )}
        
        <View style={{ maxWidth: '80%' }}>
          <View style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.botBubble
          ]}>
            <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
              {item.text}
            </Text>
          </View>
          
          {/* Renderizar opciones rápidas si existen */}
          {item.options && (
            <View style={styles.optionsContainer}>
              {item.options.map((opt, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.optionButton}
                  onPress={() => sendMessage(opt)}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <Text style={[styles.timeText, isUser ? {alignSelf:'flex-end'} : {alignSelf:'flex-start'}]}>
            {item.time}
          </Text>
        </View>

        {isUser && (
           <View style={styles.userAvatar}>
             <Feather name="user" size={20} color="#fff" />
           </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Soporte CoinPay</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Lista de Mensajes */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      {/* Input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn}>
            <Feather name="paperclip" size={22} color="#999" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
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
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  list: { flex: 1 },
  listContent: { padding: 20, paddingBottom: 10 },
  
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  userMessageWrapper: { justifyContent: 'flex-end' },
  botMessageWrapper: { justifyContent: 'flex-start' },
  
  botAvatar: {
    width: 35, height: 35, borderRadius: 20,
    backgroundColor: '#FFC107', // Amarillo tipo bot
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10,
  },
  userAvatar: {
    width: 35, height: 35, borderRadius: 20,
    backgroundColor: '#347AF0',
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 10,
  },
  
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    minWidth: 100,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  userBubble: {
    backgroundColor: '#347AF0',
    borderBottomRightRadius: 5,
  },
  
  messageText: { fontSize: 15, lineHeight: 22 },
  botText: { color: '#333' },
  userText: { color: '#fff' },
  
  timeText: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
  },

  // Opciones rápidas (Chips)
  optionsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#EAF2FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#347AF0',
  },
  optionText: {
    color: '#347AF0',
    fontSize: 13,
    fontWeight: '600',
  },

  // Input area
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: {
    width: 45, height: 45, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
  },
  attachBtn: {
    padding: 5,
  },
});