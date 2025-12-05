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
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useRegisterStore } from "../store/RegistroStore";
import BottomTabs from "../components/BottomTabs";
import { useAuthStore } from "../store/AuthStore";
import { useUsuariosStore } from "../store/UsuarioStore";
import { useTheme } from "../context/ThemeContext";  

const ProfileScreen = () => {
  const navigation = useNavigation();
  
  const { nombre, correo, telefono } = useRegisterStore();
  const { obtenerUsuarioActual, usuarioActual } = useUsuariosStore();
  const { signOut } = useAuthStore();

  const { isDark, setIsDark } = useTheme();  

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    foto: "",
  });

  useEffect(() => {
    obtenerUsuarioActual();
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

  // Seleccionar foto
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Se necesitan permisos para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, foto: result.assets[0].uri });
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const MenuItem = ({ icon, label, onPress, showArrow = true, isDestructive = false }) => (
    <TouchableOpacity 
      style={[styles(isDark).menuItem]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles(isDark).iconCircle, 
        isDestructive && styles(isDark).destructiveIconCircle
      ]}>
        {icon}
      </View>

      <Text style={[
        styles(isDark).menuText, 
        isDestructive && styles(isDark).destructiveText
      ]}>
        {label}
      </Text>

      {showArrow && (
        <Feather 
          name="chevron-right" 
          size={20} 
          color={isDark ? "#bbb" : "#ccc"} 
          style={{ marginLeft: "auto" }} 
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles(isDark).container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* HEADER */}
      <View style={styles(isDark).header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles(isDark).backButton}>
          <Feather name="chevron-left" size={28} color={isDark ? "#fff" : "#333"} />
        </TouchableOpacity>
        <Text style={styles(isDark).headerTitle}>Mi perfil</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView 
        contentContainerStyle={styles(isDark).scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* TARJETA DE PERFIL */}
        <View style={styles(isDark).profileCard}>
          <View style={styles(isDark).avatarContainer}>

            <Image
              source={{ 
                uri: form.foto && form.foto.length > 5 
                  ? form.foto 
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png" 
              }} 
              style={styles(isDark).avatar}
            />

            <TouchableOpacity style={styles(isDark).editIconBtn} onPress={pickImage}>
              <Feather name="camera" size={14} color="white" />
            </TouchableOpacity>
          </View>
          
          <TextInput 
            style={styles(isDark).name} 
            value={form.nombre} 
            onChangeText={(v) => setForm({ ...form, nombre: v })}
            placeholder="Nombre completo"
            placeholderTextColor={isDark ? "#aaa" : "#777"}
          />
          <TextInput 
            style={styles(isDark).phone} 
            value={form.telefono} 
            onChangeText={(v) => setForm({ ...form, telefono: v })}
            placeholder="Teléfono"
            placeholderTextColor={isDark ? "#aaa" : "#777"}
            keyboardType="phone-pad"
          />

          <TouchableOpacity 
            style={styles(isDark).topEditBtn} 
            onPress={() => navigation.navigate("Editprofile")}
          >
            <Feather name="edit-2" size={18} color={isDark ? "#ccc" : "#999"} />
          </TouchableOpacity>
        </View>

        {/* MENÚ */}
        <View style={styles(isDark).menuContainer}>
          
          {/* SWITCH MODO OSCURO */}
          <View style={styles(isDark).menuItem}>
            <View style={[styles(isDark).iconCircle, { backgroundColor: isDark ? "#222" : "#333" }]}>
              <Feather name="moon" size={20} color="white" />
            </View>
            <Text style={styles(isDark).menuText}>Modo Oscuro</Text>
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
            icon={<MaterialIcons name="qr-code" size={20} color={isDark ? "#fff" : "#333"} />}
            label="Mi Código QR"
            onPress={() => navigation.navigate("MyQR")}
          />

          <MenuItem 
            icon={<Feather name="repeat" size={20} color="#FF5252" />}
            label="Transacciones"
            onPress={() => navigation.navigate("TransacScreen")} 
          />

          <MenuItem 
            icon={<Feather name="database" size={20} color="#4CAF50" />}
            label="Privacidad y seguridad"
            onPress={() => navigation.navigate("priv")} 
          />

          <MenuItem 
            icon={<Feather name="log-out" size={20} color="#FF3B30" />}
            label="Cerrar Sesion"
            onPress={handleLogout}
            showArrow={false}
            isDestructive={true}
          />

        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles(isDark).bottomTabsContainer}>
        <BottomTabs />
      </View>

    </SafeAreaView>
  );
};

const styles = (isDark) =>
  StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: isDark ? "#121212" : "#F8F9FD" 
    },
    
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 15,
    },
    headerTitle: { 
      fontSize: 18, 
      fontWeight: "bold", 
      color: isDark ? "#fff" : "#1A1A1A" 
    },
    backButton: { padding: 5 },

    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 10,
    },

    profileCard: {
      backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
      borderRadius: 20,
      paddingVertical: 30,
      alignItems: "center",
      marginBottom: 20,
      shadowColor: "#000",
      elevation: 3,
      position: 'relative'
    },

    avatarContainer: { position: 'relative', marginBottom: 15 },

    avatar: { 
      width: 80, 
      height: 80, 
      borderRadius: 40,
      borderWidth: 3,
      borderColor: isDark ? "#333" : "#F8F9FD",
      backgroundColor: '#eee'
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

    name: { 
      fontSize: 18, 
      fontWeight: "bold", 
      color: isDark ? "#fff" : "#1A1A1A", 
      marginBottom: 4, 
      textAlign: 'center',
      width: '80%' 
    },

    phone: { 
      fontSize: 13, 
      color: isDark ? "#ccc" : "#757575",
      textAlign: 'center',
      width: '80%'
    },

    topEditBtn: {
      position: 'absolute',
      top: 15,
      right: 15,
      padding: 5
    },

    menuContainer: {
      backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 5,
      elevation: 3,
    },

    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#333" : "#F5F5F5",
    },

    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? "#222" : "#F5F7FA",
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },

    destructiveIconCircle: {
      backgroundColor: isDark ? "#330000" : "#FFF0F0",
    },

    menuText: { 
      fontSize: 15, 
      color: isDark ? "#fff" : "#333", 
      fontWeight: '500',
      flex: 1 
    },

    destructiveText: {
      color: "#FF3B30",
      fontWeight: '600'
    },

    bottomTabsContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    }
  });

export default ProfileScreen;
