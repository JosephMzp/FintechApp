import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// --- Datos de Prueba (Mock Data) ---
const RECENT_CONTACTS = [
  { id: '1', name: 'Mehedi Hasan', email: 'helloyouthmind@gmail.com', amount: '-$100', image: 'https://i.pravatar.cc/150?img=11' },
  { id: '2', name: 'Juan Perez', email: 'juan@gmail.com', amount: '-$50', image: 'https://i.pravatar.cc/150?img=12' },
  { id: '3', name: 'Maria Lopez', email: 'maria@gmail.com', amount: '-$200', image: 'https://i.pravatar.cc/150?img=13' },
  { id: '4', name: 'Carlos Ruiz', email: 'carlos@gmail.com', amount: '-$80', image: 'https://i.pravatar.cc/150?img=14' },
  { id: '5', name: 'Ana Gomez', email: 'ana@gmail.com', amount: '-$120', image: 'https://i.pravatar.cc/150?img=15' },
];

export default function SendMoneyScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  // Función para navegar
  const handleSelectUser = (usuario) => {
    // Navegas a la pantalla nueva y le pasas el usuario seleccionado
    navigation.navigate('SelectPurpose', { 
        usuarioDestino: usuario 
    });
  };

  // Renderizar cada item de la lista
  const renderItem = ({ item }) => (
    <TouchableOpacity 
        style={styles.contactItem}
        onPress={() => handleSelectUser(item)} 
    >
      {/* Avatar */}
      <Image source={{ uri: item.image }} style={styles.avatar} />
      
      {/* Info Central */}
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
      </View>

      {/* Monto (Historial) */}
      <Text style={styles.contactAmount}>{item.amount}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
            <Text style={styles.title}>Elegir usuario</Text>
            <Text style={styles.subtitle}>Seleccione su destinatario para enviar dinero.</Text>
        </View>
      </View>

      {/* --- BODY (Tarjeta Blanca) --- */}
      <View style={styles.whiteCard}>
        
        {/* Buscador */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o email..."
            placeholderTextColor="#ccc"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <Text style={styles.sectionTitle}>Más recientes</Text>

        {/* Lista de Contactos */}
        <FlatList
          data={RECENT_CONTACTS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      {/* --- BOTÓN SCAN (Footer) --- */}
      <View style={styles.scanContainer}>
        <TouchableOpacity style={styles.scanButton}>
          <MaterialCommunityIcons name="line-scan" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.scanText}>Escaner</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitles: {
    paddingHorizontal: 10
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 10,
  },
  whiteCard: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 12,
    color: '#888',
  },
  contactAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53935', // Rojo para egresos
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  // Botón flotante del escáner
  scanContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    alignItems: 'center',
  },
  scanButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#347AF0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#347AF0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 5,
  },
  scanText: {
    color: '#347AF0',
    fontWeight: '600',
    fontSize: 12,
  }
});