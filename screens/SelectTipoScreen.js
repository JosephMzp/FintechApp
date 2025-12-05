import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext'; // <-- Importa tu contexto de tema

export default function SelectPurposeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { isDark } = useTheme(); // Modo oscuro activo?

  const { usuarioDestino } = route.params || {}; 

  const [selectedOption, setSelectedOption] = useState('Personal');

  const handleContinue = () => {
    if (!usuarioDestino) console.warn("No hay usuario destino seleccionado en params");

    navigation.navigate('InputAmount', { 
        usuarioDestino: usuarioDestino, 
        purpose: selectedOption 
    });
  };

  const PurposeOption = ({ id, title, subtitle, icon, iconColor, bgIconColor }) => {
    const isSelected = selectedOption === id;
    return (
      <TouchableOpacity 
        style={[
          styles.optionCard, 
          {
            backgroundColor: isSelected
              ? isDark ? '#1E1E2F' : '#F4F8FF'
              : isDark ? '#2A2A3D' : '#FFFFFF',
            borderColor: isSelected ? '#347AF0' : 'transparent',
          }
        ]}
        onPress={() => setSelectedOption(id)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: bgIconColor }]}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.optionTitle, { color: isDark ? '#FFF' : '#333' }]}>{title}</Text>
          <Text style={[styles.optionSubtitle, { color: isDark ? '#CCC' : '#888' }]}>{subtitle}</Text>
        </View>
        <View style={styles.radioContainer}>
          {isSelected ? (
            <View style={[styles.radioSelected, { borderColor: '#347AF0' }]}>
              <View style={styles.radioInnerCircle} />
            </View>
          ) : (
            <View style={[styles.radioUnselected, { borderColor: isDark ? '#555' : '#E0E0E0' }]} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FD' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={28} color={isDark ? '#FFF' : '#333'} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.pageTitle, { color: isDark ? '#FFF' : '#1A1A1A' }]}>Seleciona un Propósito</Text>
        <Text style={[styles.pageSubtitle, { color: isDark ? '#CCC' : '#757575' }]}>
          Seleccione un método para enviar dinero
        </Text>

        <View style={styles.optionsList}>
          <PurposeOption 
            id="Personal"
            title="Personal"
            subtitle="Pague a sus amigos y familiares."
            bgIconColor="#E8EAF6"
            icon={<Feather name="user" size={24} color="#3F51B5" />}
          />
          <PurposeOption 
            id="Business"
            title="Business"
            subtitle="Pague a sus empleados"
            bgIconColor="#FFF8E1"
            icon={<MaterialIcons name="business-center" size={24} color="#FFC107" />}
          />
          <PurposeOption 
            id="Pago"
            title="Pago"
            subtitle="Para el pago de facturas de servicios públicos."
            bgIconColor="#FFF3E0"
            icon={<FontAwesome5 name="receipt" size={24} color="#FF9800" />}
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.continueButton, 
            { backgroundColor: '#347AF0' }
          ]} 
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  content: { paddingHorizontal: 24 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  pageSubtitle: { fontSize: 16, marginBottom: 30 },
  optionsList: { gap: 16 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  optionSubtitle: { fontSize: 13 },
  radioContainer: { justifyContent: 'center', alignItems: 'center', paddingLeft: 10 },
  radioUnselected: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  radioSelected: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInnerCircle: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#347AF0' },
  continueButton: { marginTop: 40, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  continueText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
