import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUsuariosStore } from '../store/UsuarioStore'; // <--- IMPORTANTE

// --- Datos de Prueba (Se muestran si no buscas nada) ---
const RECENT_CONTACTS = [
  { id: '1', nombre: 'Mehedi Hasan', correo: 'hello@gmail.com', foto: 'https://i.pravatar.cc/150?img=11' },
  { id: '2', nombre: 'Juan Perez', correo: 'juan@gmail.com', foto: 'https://i.pravatar.cc/150?img=12' },
];

export default function SendMoneyScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  // Traemos funciones y estado del Store
  const { buscarUsuario, usuarios, loadingBusqueda, limpiarBusqueda } = useUsuariosStore();

  // Cada vez que cambia el texto 'search', llamamos al store
  const handleSearch = (text) => {
    setSearch(text);
    buscarUsuario(text); // Esto busca en Supabase
  };

  // Limpiar búsqueda al salir
  useEffect(() => {
    return () => limpiarBusqueda();
  }, []);

  const handleSelectUser = (usuario) => {
    navigation.navigate('SelectPurpose', { 
        usuarioDestino: usuario 
    });
  };

  // --- LÓGICA DE DATOS A MOSTRAR ---
  // Si hay texto en el buscador, mostramos resultados de Supabase.
  // Si no, mostramos los recientes (Mock).
  const dataToShow = search.length > 0 ? usuarios : RECENT_CONTACTS;
  const listTitle = search.length > 0 ? "Resultados de búsqueda" : "Más recientes";

  const renderItem = ({ item }) => {
    // Manejo de imagen: si viene de BD puede ser null, usamos un placeholder
    const imageUri = item.foto 
        ? { uri: item.foto } 
        : { uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }; // Avatar por defecto

    return (
      <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => handleSelectUser(item)} 
      >
        {/* Avatar */}
        <Image source={imageUri} style={styles.avatar} />
        
        {/* Info Central */}
        <View style={styles.contactInfo}>
          {/* Usamos item.nombre (nombre de la columna en BD) */}
          <Text style={styles.contactName}>{item.nombre}</Text> 
          
          {/* Mostramos el teléfono si estamos buscando, o correo si es reciente */}
          <Text style={styles.contactEmail}>
             {search.length > 0 ? `Cel: ${item.telefono}` : item.correo}
          </Text>
        </View>

        {/* Icono de flecha para indicar acción */}
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
            <Text style={styles.title}>Elegir usuario</Text>
            <Text style={styles.subtitle}>Busca por número de celular (+51...)</Text>
        </View>
      </View>

      {/* BODY (Tarjeta Blanca) */}
      <View style={styles.whiteCard}>
        
        {/* Buscador */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ingresa número de celular..."
            placeholderTextColor="#ccc"
            value={search}
            onChangeText={handleSearch} // <--- Conectado a la función de búsqueda
            keyboardType="phone-pad"    // <--- Teclado numérico
          />
          {loadingBusqueda && <ActivityIndicator size="small" color="#347AF0" />}
        </View>

        <Text style={styles.sectionTitle}>{listTitle}</Text>

        {/* Lista de Contactos (Dinámica) */}
        <FlatList
          data={dataToShow}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
                {search.length > 0 ? "No se encontraron usuarios" : "No tienes contactos recientes"}
            </Text>
          }
        />
      </View>

      {/* FOOTER */}
      <View style={styles.scanContainer}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => navigation.navigate('QRScanner')} // <--- AQUÍ EL CAMBIO
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.scanText}>Escanear QR</Text>
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
    backgroundColor: '#eee' // Color de fondo si la imagen carga lento
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
    fontSize: 13,
    color: '#888',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontStyle: 'italic'
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