import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  SafeAreaView,
  StatusBar
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRegisterStore } from "../store/RegistroStore";
import BottomTabs from "../components/BottomTabs";
import { useAuthStore } from "../store/AuthStore";
import { useUsuariosStore } from "../store/UsuarioStore";

const ProfileScreen = () => {
  const navigation = useNavigation();
  
  // Datos del usuario (Store)
  const { nombre, correo, telefono } = useRegisterStore();
  const { obtenerUsuarioActual, usuarioActual } = useUsuariosStore();
  const { signOut } = useAuthStore(); // Función para cerrar sesión
  const [form, setForm] = useState({
      nombre: "",
      telefono: "",
      foto: "",
    });

  // Estado local para Dark Mode
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
      obtenerUsuarioActual(); // cargar desde la BD
    }, []);

  useEffect(() => {
      if (usuarioActual) {
        setForm({
          nombre: usuarioActual.nombre || "",
          telefono: usuarioActual.telefono || "",
          foto: usuarioActual.foto || "",
        });
      }
    }, [usuarioActual]);

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await signOut();
      // Resetear navegación al Login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Componente reutilizable para cada fila del menú
  const MenuItem = ({ icon, label, onPress, showArrow = true, isDestructive = false }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, isDestructive && styles.destructiveIconCircle]}>
        {icon}
      </View>
      <Text style={[styles.menuText, isDestructive && styles.destructiveText]}>{label}</Text>
      {showArrow && (
        <Feather 
          name="chevron-right" 
          size={20} 
          color="#ccc" 
          style={{ marginLeft: "auto" }} 
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi perfil</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- TARJETA DE USUARIO --- */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {/* Lógica para foto por defecto */}
            <Image
              source={{ 
                uri: form.foto && form.foto.length > 5 
                  ? form.foto 
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png" 
              }} 
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editIconBtn}>
               <Feather name="camera" size={14} color="white" />
            </TouchableOpacity>
          </View>
          
          <TextInput 
            style={styles.name} 
            value={form.nombre} 
            onChangeText={(v) => setForm({ ...form, nombre: v })}
            placeholder="Nombre completo"
          />
          <TextInput 
            style={styles.phone} 
            value={form.telefono} 
            onChangeText={(v) => setForm({ ...form, telefono: v })}
            placeholder="Teléfono"
            keyboardType="phone-pad"
          />

          {/* Botón de editar (esquina superior derecha de la tarjeta) */}
          <TouchableOpacity 
            style={styles.topEditBtn} 
            onPress={() => navigation.navigate("Editprofile")}
          >
            <Feather name="edit-2" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* --- MENÚ DE OPCIONES --- */}
        <View style={styles.menuContainer}>
          
          {/* Modo Oscuro Switch */}
          <View style={styles.menuItem}>
            <View style={[styles.iconCircle, { backgroundColor: '#333' }]}>
               <Feather name="moon" size={20} color="white" />
            </View>
            <Text style={styles.menuText}>Modo Oscuro</Text>
            <Switch
              value={isDark}
              onValueChange={setIsDark}
              trackColor={{ false: "#e5e7eb", true: "#347AF0" }}
              thumbColor={isDark ? "#fff" : "#f4f3f4"}
              style={{ marginLeft: "auto", transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
            />
          </View>

          <MenuItem 
            icon={<Feather name="user" size={20} color="#347AF0" />}
            label="Personal Info"
            onPress={() => navigation.navigate("Editprofile")}
          />

          <MenuItem 
            icon={<MaterialIcons name="account-balance" size={20} color="#FFC107" />}
            label="Banco y Tarjetas"
            onPress={() => navigation.navigate("CardList")}
          />

          <MenuItem 
            icon={<MaterialIcons name="qr-code" size={20} color="#333" />}
            label="Mi Código QR"
            onPress={() => navigation.navigate("MyQR")}
          />

          <MenuItem 
            icon={<Feather name="repeat" size={20} color="#FF5252" />}
            label="Transacciones"
            onPress={() => navigation.navigate("Transactions")} 
          />

          <MenuItem 
            icon={<Feather name="settings" size={20} color="#347AF0" />}
            label="Configuracion"
            onPress={() => {}} 
          />

          <MenuItem 
            icon={<Feather name="database" size={20} color="#4CAF50" />}
            label="Data Privacy"
            onPress={() => navigation.navigate("Check")} 
          />

          {/* Opción Cerrar Sesión */}
          <MenuItem 
            icon={<Feather name="log-out" size={20} color="#FF3B30" />}
            label="Cerrar Sesion"
            onPress={handleLogout}
            showArrow={false}
            isDestructive={true}
          />

        </View>

        {/* Espacio extra para que el BottomTabs no tape el contenido */}
        <View style={{ height: 100 }} />

      </ScrollView>

      {/* --- BOTTOM TABS FLOTANTE --- */}
      <View style={styles.bottomTabsContainer}>
         <BottomTabs />
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FD" },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  backButton: { padding: 5 },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // Tarjeta de Perfil
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 30,
    alignItems: "center", // Centra los hijos horizontalmente (Avatar y TextInputs)
    marginBottom: 20,
    // Sombras
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative'
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#F8F9FD',
    backgroundColor: '#eee' // Fondo gris si carga lento
  },
  editIconBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  // Estilos de los inputs de texto centrados
  name: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#1A1A1A", 
    marginBottom: 4, 
    textAlign: 'center', // <--- CENTRADO DE TEXTO
    width: '80%' 
  },
  phone: { 
    fontSize: 13, 
    color: "#757575",
    textAlign: 'center', // <--- CENTRADO DE TEXTO
    width: '80%'
  },
  
  topEditBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5
  },

  // Contenedor del Menú
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F7FA', // Fondo gris muy claro para iconos
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  destructiveIconCircle: {
    backgroundColor: '#FFF0F0',
  },
  
  menuText: { 
    fontSize: 15, 
    color: "#333", 
    fontWeight: '500',
    flex: 1 
  },
  destructiveText: {
    color: "#FF3B30",
    fontWeight: '600'
  },

  // Bottom Tabs flotante
  bottomTabsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default ProfileScreen;