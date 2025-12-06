import React, { useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomTabs from '../components/BottomTabs';
import { useTheme } from "../context/ThemeContext"; 
import { useTransaccionStore } from '../store/TransaccionStore'; 

const SimpleBar = ({ label, value, maxValue, color }) => {
    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
    return (
        <View style={{ alignItems: 'center', marginHorizontal: 5 }}>
            <View style={{ height: 100, width: 10, justifyContent: 'flex-end', backgroundColor: '#eee', borderRadius: 5 }}>
                <View style={{ height: `${height}%`, width: '100%', backgroundColor: color, borderRadius: 5 }} />
            </View>
            <Text style={{ fontSize: 10, marginTop: 5, color: '#888' }}>{label}</Text>
        </View>
    )
}

export default function SpendingScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme(); 
  const { saldo, transacciones, gastos, ingresos, cargarDatosReal } = useTransaccionStore();

  useEffect(() => {
      cargarDatosReal();
  }, []);
const maxAmount = Math.max(...transacciones.map(t => parseFloat(t.monto)), 100);
  // Renderizar una barra del gráfico
  const renderBar = (item, index) => {
    // Calculamos altura relativa (max 100px para el ejemplo)
    const height = item.value; 
    
    return (
      <View key={index} style={styles.barContainer}>
        <Text style={styles.barLabelTop}>${item.value}</Text>
        <View style={[styles.bar, { height: height, backgroundColor: item.color }]} />
        <Text style={styles.barLabelBottom}>{item.label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles(isDark).container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* HEADER */}
      <View style={styles(isDark).header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={28} color={isDark ? "#fff" : "#333"} />
        </TouchableOpacity>
        <Text style={styles(isDark).headerTitle}>Estadísticas</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
        
        {/* RESUMEN CARDS */}
        <View style={styles(isDark).summaryRow}>
          {/* Tarjeta GASTOS */}
          <View style={[styles(isDark).summaryCard, { backgroundColor: '#4361EE' }]}>
            <View style={styles(isDark).cardHeader}>
              <Feather name="arrow-up-right" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles(isDark).cardLabelWhite}> Gastos Totales</Text>
            </View>
            <Text style={styles(isDark).cardAmountWhite}>S/ {gastos.toFixed(2)}</Text>
          </View>

          {/* Tarjeta SALDO ACTUAL */}
          <View style={[styles(isDark).summaryCard, { backgroundColor: '#F4D35E' }]}>
            <View style={styles(isDark).cardHeader}>
              <Feather name="credit-card" size={16} color="rgba(0,0,0,0.6)" />
              <Text style={styles(isDark).cardLabelDark}> Saldo Actual</Text>
            </View>
            <Text style={styles(isDark).cardAmountDark}>S/ {parseFloat(saldo).toFixed(2)}</Text>
          </View>
        </View>

        {/* GRÁFICO SIMPLE (Basado en las transacciones cargadas) */}
        <View style={styles(isDark).chartContainer}>
            <Text style={{color: isDark ? '#fff' : '#333', marginBottom: 15, fontWeight:'bold'}}>Resumen de movimientos</Text>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
                {transacciones.slice(0, 7).reverse().map((t, index) => (
                    <SimpleBar 
                        key={index}
                        label={t.fecha.slice(5)} // MM-DD
                        value={parseFloat(t.monto)} 
                        maxValue={maxAmount}
                        color={t.tipo_visual === 'gasto' ? '#4361EE' : '#F4D35E'}
                    />
                ))}
                {transacciones.length === 0 && <Text style={{color:'#888'}}>Sin datos para mostrar</Text>}
            </View>
        </View>

        {/* LISTA COMPLETA */}
        <View style={styles(isDark).listHeader}>
          <Text style={styles(isDark).listTitle}>Historial Completo</Text>
        </View>

        <View>
          {transacciones.map((item) => (
            <View key={item.id} style={styles(isDark).transactionItem}>
              <View style={[styles(isDark).brandIcon, {backgroundColor: isDark ? '#333' : '#F0F0F0'}]}>
                 <Feather name={item.iconName} size={20} color={item.color} />
              </View>
              
              <View style={styles(isDark).txInfo}>
                <Text style={styles(isDark).txTitle}>{item.referencia}</Text>
                <Text style={styles(isDark).txDate}>{item.fecha} - {item.tipo}</Text>
              </View>
              
              <Text style={[styles(isDark).txAmount, {color: item.color}]}>{item.signo} S/{item.monto}</Text>
            </View>
          ))}
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
         <BottomTabs />
      </View>

    </SafeAreaView>
  );
}

const styles = (isDark) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDark ? '#121212' : '#F8F9FD' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: isDark ? '#fff' : '#333' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 },
  summaryCard: { width: '48%', borderRadius: 20, padding: 20, justifyContent: 'center' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardLabelWhite: { color: 'rgba(255,255,255,0.9)', fontSize: 12 },
  cardLabelDark: { color: 'rgba(0,0,0,0.6)', fontSize: 12 },
  cardAmountWhite: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  cardAmountDark: { color: '#1A1A1A', fontSize: 20, fontWeight: 'bold' },
  chartContainer: { backgroundColor: isDark ? '#1E1E1E' : 'white', borderRadius: 20, padding: 20, marginBottom: 25 },
  listHeader: { marginBottom: 15 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: isDark ? '#fff' : '#333' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1E1E1E' : 'white', padding: 15, borderRadius: 16, marginBottom: 10 },
  brandIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 16, fontWeight: '600', color: isDark ? '#fff' : '#333' },
  txDate: { fontSize: 12, color: '#999', marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: 'bold' },
});