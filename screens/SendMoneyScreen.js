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
import { useUsuariosStore } from '../store/UsuarioStore';
import { useTheme } from '../context/ThemeContext'; // <-- Contexto de tema

const RECENT_CONTACTS = [
  { id: '1', nombre: 'Mehedi Hasan', correo: 'hello@gmail.com', foto: 'https://i.pravatar.cc/150?img=11' },
  { id: '2', nombre: 'Juan Perez', correo: 'juan@gmail.com', foto: 'https://i.pravatar.cc/150?img=12' },
];

export default function SendMoneyScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const { isDark } = useTheme();

  const { buscarUsuario, usuarios, loadingBusqueda, limpiarBusqueda } = useUsuariosStore();

  const handleSearch = (text) => {
    setSearch(text);
    buscarUsuario(text);
  };

  useEffect(() => {
    return () => limpiarBusqueda();
  }, []);

  const handleSelectUser = (usuario) => {
    navigation.navigate('SelectPurpose', { usuarioDestino: usuario });
  };

  const dataToShow = search.length > 0 ? usuarios : RECENT_CONTACTS;
  const listTitle = search.length > 0 ? "Resultados de búsqueda" : "Más recientes";

  const renderItem = ({ item }) => {
    const imageUri = item.foto 
        ? { uri: item.foto } 
        : { uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' };

    return (
      <TouchableOpacity 
          style={[styles.contactItem, { borderBottomColor: isDark ? '#333' : '#F0F0F0' }]}
          onPress={() => handleSelectUser(item)} 
      >
        <Image source={imageUri} style={styles.avatar} />
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { color: isDark ? '#FFF' : '#333' }]}>{item.nombre}</Text> 
          <Text style={[styles.contactEmail, { color: isDark ? '#CCC' : '#888' }]}>
             {search.length > 0 ? `Cel: ${item.telefono}` : item.correo}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={isDark ? '#AAA' : '#ccc'} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FD' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={isDark ? '#FFF' : '#333'} />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
            <Text style={[styles.title, { color: isDark ? '#FFF' : '#1A1A1A' }]}>Elegir usuario</Text>
            <Text style={[styles.subtitle, { color: isDark ? '#CCC' : '#757575' }]}>
              Busca por número de celular (+51...)
            </Text>
        </View>
      </View>

      <View style={[styles.whiteCard, { backgroundColor: isDark ? '#1E1E2F' : '#FFFFFF' }]}>
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#2A2A3D' : '#F4F6F8' }]}>
          <Ionicons name="search" size={20} color={isDark ? '#AAA' : '#ccc'} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#FFF' : '#333' }]}
            placeholder="Ingresa número de celular..."
            placeholderTextColor={isDark ? '#555' : '#ccc'}
            value={search}
            onChangeText={handleSearch}
            keyboardType="phone-pad"
          />
          {loadingBusqueda && <ActivityIndicator size="small" color="#347AF0" />}
        </View>

        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>{listTitle}</Text>

        <FlatList
          data={dataToShow}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: isDark ? '#AAA' : '#999' }]}>
                {search.length > 0 ? "No se encontraron usuarios" : "No tienes contactos recientes"}
            </Text>
          }
        />
      </View>

      <View style={styles.scanContainer}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => navigation.navigate('QRScanner')}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.scanText, { color: isDark ? '#FFF' : '#347AF0' }]}>Escanear QR</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backButton: { marginBottom: 10, width: 40, height: 40, justifyContent: 'center' },
  headerTitles: { paddingHorizontal: 10 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, marginBottom: 10 },
  whiteCard: {
    flex: 1,
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
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15, backgroundColor: '#eee' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  contactEmail: { fontSize: 13 },
  separator: { height: 1 },
  emptyText: { textAlign: 'center', marginTop: 20, fontStyle: 'italic' },
  scanContainer: { position: 'absolute', bottom: 30, alignSelf: 'center', alignItems: 'center' },
  scanButton: {
    width: 65, height: 65, borderRadius: 32.5, backgroundColor: '#347AF0',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#347AF0", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8, marginBottom: 5,
  },
  scanText: { fontWeight: '600', fontSize: 12 },
  separator: { height: 1, backgroundColor: '#F0F0F0' },
});
