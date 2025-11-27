import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* User Data */}
      <View style={styles.card}>
        <Image
          source={require("../assets/addcard.png")}
          style={styles.avatar}
        />

        <Text style={styles.name}>Kevin Daniel</Text>
        <Text style={styles.email}>kevin@email.com</Text>
        <Text style={styles.phone}>+51 999 999 999</Text>
      </View>

      {/* Menu list */}
      <View style={styles.menu}>

        <View style={styles.row}>
          <Feather name="moon" size={20} color="#000" />
          <Text style={styles.rowText}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
        </View>

        <TouchableOpacity style={styles.row}>
          <Ionicons name="person-outline" size={20} color="#000" />
          <Text style={styles.rowText}>Personal Info</Text>
          <Ionicons name="chevron-forward" size={18} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("CardList")}
        >
          <MaterialIcons name="credit-card" size={20} color="#000" />
          <Text style={styles.rowText}>Bank & Cards</Text>
          <Ionicons name="chevron-forward" size={18} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Feather name="repeat" size={20} color="#000" />
          <Text style={styles.rowText}>Transactions</Text>
          <Ionicons name="chevron-forward" size={18} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Ionicons name="settings-outline" size={20} color="#000" />
          <Text style={styles.rowText}>Settings</Text>
          <Ionicons name="chevron-forward" size={18} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Feather name="shield" size={20} color="#000" />
          <Text style={styles.rowText}>Data Privacy</Text>
          <Ionicons name="chevron-forward" size={18} color="#aaa" />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA", paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "600", color: "#000" },

  card: { alignItems: "center", marginBottom: 25 },
  avatar: { width: 80, height: 80, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: "700", color: "#000" },
  email: { color: "#888", marginTop: 3 },
  phone: { color: "#777", marginTop: 2 },

  menu: { backgroundColor: "#fff", borderRadius: 20, padding: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#EFEFEF",
  },
  rowText: { flex: 1, marginLeft: 10, fontSize: 16, fontWeight: "500" },
});
