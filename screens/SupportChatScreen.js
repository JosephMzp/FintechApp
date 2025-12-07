import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// 📌 IMPORTANTE: RevenueCat
import Purchases from 'react-native-purchases';

export default function SupportChatScreen({ navigation }) {
  const { isDark } = useTheme();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: '¡Hola! Bienvenido al soporte de CoinPay. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      time: 'Justo ahora'
    },
    {
      id: '2',
      text: 'Puedes elegir una opción o escribir tu duda:',
      sender: 'bot',
      options: ['Problema con un pago', 'Mi saldo', 'Contactar asesor', 'Membresías'],
      time: 'Justo ahora'
    },
  ]);

  const [offerings, setOfferings] = useState(null);
  const flatListRef = useRef(null);

  // 🔥 Cargar los offerings automáticamente
  useEffect(() => {
    const loadOfferings = async () => {
      try {
        const data = await Purchases.getOfferings();
        if (data.current) setOfferings(data.current);
      } catch (error) {
        console.log("Error cargando offerings:", error);
      }
    };
    loadOfferings();
  }, []);

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

  const simulateBotResponse = async (userText) => {
    const lower = userText.toLowerCase();

    // 🔥 Detectar si el usuario pide planes / membresías
    if (
      lower.includes("membres") ||
      lower.includes("plan") ||
      lower.includes("suscrip") ||
      lower.includes("premium")
    ) {
      if (!offerings) {
        return addBotMessage("Aún no puedo cargar las membresías. Intenta en unos segundos.");
      }

      const pkgs = offerings.availablePackages;

      if (!pkgs || pkgs.length === 0) {
        return addBotMessage("No hay planes disponibles en este momento.");
      }

      addBotMessage("Aquí tienes nuestras membresías disponibles:");

      // Crear un mensaje por cada paquete
      pkgs.forEach(pkg => {
        addBotMessage(
          `${pkg.storeProduct.title}\n${pkg.storeProduct.description}\nPrecio: ${pkg.storeProduct.priceString}`,
          pkg
        );
      });

      return;
    }

    // 📌 Respuestas normales
    let botReply = "Entiendo. Un momento mientras reviso esa información...";
    if (lower.includes('saldo')) botReply = "Tu saldo actual es S/20,000. ¿Deseas ver el historial?";
    else if (lower.includes('pago') || lower.includes('envío')) botReply = "¿Tienes el ID de transacción a la mano?";
    else if (lower.includes('asesor') || lower.includes('humano')) botReply = "Conectando con un agente humano...";
    else if (lower.includes('hola')) botReply = "¡Hola! ¿Cómo estás?";

    setTimeout(() => addBotMessage(botReply), 1200);
  };

  const addBotMessage = (text, pkg = null) => {
    const botMessage = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      package: pkg,
    };
    setMessages(prev => [...prev, botMessage]);
  };

  // 🔥 Comprar un paquete
  const buyPackage = async (pkg) => {
    try {
      await Purchases.purchasePackage(pkg);
      addBotMessage("🎉 ¡Compra realizada con éxito! Ahora eres usuario Premium.");
    } catch (error) {
      addBotMessage("No se pudo completar la compra.");
    }
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
          <View style={[styles.botAvatar, { backgroundColor: '#FFC107' }]}>
            <MaterialCommunityIcons name="robot-happy" size={20} color="#fff" />
          </View>
        )}

        <View style={{ maxWidth: '80%' }}>
          <View style={[
            styles.messageBubble,
            isUser
              ? styles.userBubble
              : styles.botBubble
          ]}>
            <Text style={[styles.messageText, isUser ? { color: '#fff' } : { color: '#333' }]}>
              {item.text}
            </Text>

            {/* 🔥 Si el mensaje contiene un paquete RevenueCat, mostrar botón de comprar */}
            {item.package && (
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => buyPackage(item.package)}
              >
                <Text style={styles.buyText}>Comprar</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        {isUser && (
          <View style={[styles.userAvatar, { backgroundColor: '#347AF0' }]}>
            <Feather name="user" size={20} color="#fff" />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Soporte CoinPay</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* Input */}
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#aaa"
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
  container: { flex: 1, backgroundColor: '#121212' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1F1F1F',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },

  listContent: { padding: 20 },

  messageWrapper: { flexDirection: 'row', marginBottom: 20 },
  userMessageWrapper: { justifyContent: 'flex-end' },

  botAvatar: { width: 35, height: 35, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  userAvatar: { width: 35, height: 35, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },

  messageBubble: { padding: 15, borderRadius: 18 },
  botBubble: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  userBubble: { backgroundColor: '#347AF0' },

  messageText: { fontSize: 15 },

  buyButton: {
    marginTop: 10,
    backgroundColor: '#347AF0',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyText: { color: '#fff', fontWeight: 'bold' },

  timeText: { fontSize: 11, marginTop: 5, color: '#999' },

  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#1F1F1F',
  },
  input: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendBtn: {
    width: 45,
    height: 45,
    marginLeft: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
