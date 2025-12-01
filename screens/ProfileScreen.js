import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useRegisterStore } from "../store/RegistroStore";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { name, email, phone } = useRegisterStore();
  const [isDark, setIsDark] = React.useState(false);

  return (
    <View style={styles.container}>

      {/* Botón Volver */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={26} color="#3b82f6" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.title}>Mi Perfil</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.phone}>{phone}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>

        <View style={styles.menuItem}>
          <Icon name="moon" size={22} />
          <Text style={styles.menuText}>Modo oscuro</Text>
          <Switch
            value={isDark}
            onValueChange={setIsDark}
            style={{ marginLeft: "auto" }}
          />
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Editprofile")}
        >
          <Icon name="user" size={22} color="#3b82f6" />
          <Text style={styles.menuText}>Información personal</Text>
          <Icon name="chevron-right" size={22} style={{ marginLeft: "auto" }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("CardListScreen")}
        >
          <Icon name="credit-card" size={22} color="#fbbf24" />
          <Text style={styles.menuText}>Bancos y Tarjetas</Text>
          <Icon name="chevron-right" size={22} style={{ marginLeft: "auto" }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Transactions")}
        >
          <Icon name="dollar-sign" size={22} color="#ef4444" />
          <Text style={styles.menuText}>Transacciones</Text>
          <Icon name="chevron-right" size={22} style={{ marginLeft: "auto" }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("SupportChat")}
        >
          <Icon name="message-circle" size={22} color="#2563eb" />
          <Text style={styles.menuText}>Soporte</Text>
          <Icon name="chevron-right" size={22} style={{ marginLeft: "auto" }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Check")}
        >
          <Icon name="shield" size={22} color="#16a34a" />
          <Text style={styles.menuText}>Privacidad y Seguridad</Text>
          <Icon name="chevron-right" size={22} style={{ marginLeft: "auto" }} />
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 20 },
  backButton: { position: "absolute", top: 20, left: 10, zIndex: 10 },
  title: { fontSize: 22, textAlign: "center", fontWeight: "bold", marginBottom: 20 },
  profileCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold" },
  email: { fontSize: 14, color: "gray" },
  phone: { fontSize: 14, color: "gray" },
  menuContainer: { backgroundColor: "white", borderRadius: 20, padding: 10 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  menuText: { fontSize: 16, marginLeft: 15 },
});
