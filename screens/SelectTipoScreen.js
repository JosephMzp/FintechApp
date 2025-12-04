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

export default function SelectPurposeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Recibimos al usuario que seleccionaste en la pantalla anterior
  // Si no hay params (por pruebas), usamos un objeto vacío para que no rompa
  const { usuarioDestino } = route.params || {}; 

  // Estado para la opción seleccionada. Por defecto 'Personal'
  const [selectedOption, setSelectedOption] = useState('Personal');

  const handleContinue = () => {
    // Verificamos que haya usuario destino (si vienes del flujo correcto)
    if (!usuarioDestino) {
        // Manejo de error o log para desarrollo
        console.warn("No hay usuario destino seleccionado en params");
    }

    // Navegamos pasando AMBOS datos
    navigation.navigate('InputAmount', { 
        usuarioDestino: usuarioDestino, 
        purpose: selectedOption 
    });
  };

  // Componente interno para cada Opción (Card)
  const PurposeOption = ({ id, title, subtitle, icon, iconColor, bgIconColor }) => {
    const isSelected = selectedOption === id;

    return (
      <TouchableOpacity 
        style={[
          styles.optionCard, 
          isSelected && styles.optionCardSelected // Borde azul si está seleccionado
        ]} 
        onPress={() => setSelectedOption(id)}
        activeOpacity={0.8}
      >
        {/* Ícono de la izquierda */}
        <View style={[styles.iconContainer, { backgroundColor: bgIconColor }]}>
          {icon}
        </View>

        {/* Textos */}
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionSubtitle}>{subtitle}</Text>
        </View>

        {/* Radio Button (Círculo derecha) */}
        <View style={styles.radioContainer}>
          {isSelected ? (
            <View style={styles.radioSelected}>
              <View style={styles.radioInnerCircle} />
            </View>
          ) : (
            <View style={styles.radioUnselected} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Simple con botón atrás */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.pageTitle}>Seleciona un Propósito</Text>
        <Text style={styles.pageSubtitle}>
Seleccione un método para enviar dinero</Text>

        <View style={styles.optionsList}>
          {/* Opción 1: Personal */}
          <PurposeOption 
            id="Personal"
            title="Personal"
            subtitle="Pague a sus amigos y familiares."
            bgIconColor="#E8EAF6" // Fondo azul muy claro
            icon={<Feather name="user" size={24} color="#3F51B5" />}
          />

          {/* Opción 2: Business */}
          <PurposeOption 
            id="Business"
            title="Business"
            subtitle="Pague a sus empleados"
            bgIconColor="#FFF8E1" // Fondo amarillo muy claro
            icon={<MaterialIcons name="business-center" size={24} color="#FFC107" />}
          />

          {/* Opción 3: Payment */}
          <PurposeOption 
            id="Pago"
            title="Pago"
            subtitle="Para el pago de facturas de servicios públicos."
            bgIconColor="#FFF3E0" // Fondo naranja muy claro
            icon={<FontAwesome5 name="receipt" size={24} color="#FF9800" />}
          />
        </View>

        {/* Botón Continuar (Opcional, para confirmar la acción) */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD', // Color de fondo suave similar a la imagen
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 30,
  },
  optionsList: {
    gap: 16, // Espacio entre tarjetas
  },
  // Estilos de la Tarjeta
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'transparent', // Por defecto transparente
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: '#347AF0', // Borde azul cuando se selecciona
    backgroundColor: '#F4F8FF', // Opcional: un fondo azul muy tenue al seleccionar
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#888',
  },
  // Radio Button Styles
  radioContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  radioUnselected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  radioSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#347AF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#347AF0',
  },
  // Botón continuar
  continueButton: {
    marginTop: 40,
    backgroundColor: '#347AF0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  }
});