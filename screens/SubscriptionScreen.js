import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  SafeAreaView,
  StatusBar
} from "react-native";
import Purchases from "react-native-purchases";
import { LinearGradient } from "expo-linear-gradient"; // Usamos tu librería instalada
import { CheckCircle2, Crown, ShieldCheck, Zap } from "lucide-react-native"; // Iconos para dar confianza

// Colores del tema (puedes ajustarlos a tu variables globales)
const COLORS = {
  primary: "#4F46E5", // Azul/Indigo moderno
  secondary: "#1E1B4B", // Azul oscuro
  accent: "#818CF8",
  background: "#F8FAFC",
  white: "#FFFFFF",
  text: "#0F172A",
  textLight: "#64748B",
  success: "#10B981"
};

export default function SubscriptionScreen({ navigation }) {
  const [offerings, setOfferings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    const loadOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current) {
          setOfferings(offerings.current);
          // Pre-seleccionar el plan anual si existe (estrategia de marketing)
          if (offerings.current.annual) {
            setSelectedPackage(offerings.current.annual);
          } else if (offerings.current.monthly) {
            setSelectedPackage(offerings.current.monthly);
          }
        }
      } catch (error) {
        console.error("Error loading offerings:", error);
        Alert.alert("Error", "No se pudieron cargar los planes.");
      } finally {
        setIsLoading(false);
      }
    };
    loadOfferings();
  }, []);

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    
    try {
      setIsPurchasing(true);
      const purchaseResult = await Purchases.purchasePackage(selectedPackage);
      Alert.alert("¡Felicidades!", "Ahora eres usuario Premium.");
      // Aquí podrías navegar al Home o actualizar el estado global
      // navigation.goBack(); 
    } catch (error) {
      if (!error.userCancelled) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsPurchasing(true);
      await Purchases.restorePurchases();
      Alert.alert("Restaurado", "Tus compras han sido restauradas.");
    } catch (error) {
      Alert.alert("Error", "No se pudieron restaurar las compras.");
    } finally {
      setIsPurchasing(false);
    }
  };

  // Componente de Beneficio
  const BenefitItem = ({ text }) => (
    <View style={styles.benefitRow}>
      <CheckCircle2 size={20} color={COLORS.success} />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.textLight }}>Cargando mejores ofertas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Crown size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Hazte Premium</Text>
          <Text style={styles.subtitle}>
            Desbloquea todo el potencial de tu vida financiera con nuestros planes exclusivos.
          </Text>
        </View>

        {/* BENEFICIOS */}
        <View style={styles.benefitsContainer}>
          <BenefitItem text="Transferencias internacionales sin comisiones" />
          <BenefitItem text="Tarjetas virtuales ilimitadas" />
          <BenefitItem text="Soporte prioritario 24/7" />
          <BenefitItem text="Estadísticas avanzadas de gastos" />
        </View>

        {/* PLANES */}
        <Text style={styles.sectionTitle}>Selecciona tu plan</Text>
        
        <View style={styles.plansContainer}>
          {offerings?.annual && (
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => setSelectedPackage(offerings.annual)}
              style={[
                styles.planCard, 
                selectedPackage === offerings.annual && styles.selectedCard
              ]}
            >
              {/* Etiqueta de mejor valor */}
              <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>AHORRA 20%</Text>
              </View>
              
              <View style={styles.planHeader}>
                <Text style={styles.planName}>Anual</Text>
                {selectedPackage === offerings.annual && (
                  <CheckCircle2 size={22} color={COLORS.primary} />
                )}
              </View>
              <Text style={styles.planPrice}>{offerings.annual.product.priceString}</Text>
              <Text style={styles.planPeriod}>Facturado cada 12 meses</Text>
            </TouchableOpacity>
          )}

          {offerings?.monthly && (
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => setSelectedPackage(offerings.monthly)}
              style={[
                styles.planCard, 
                selectedPackage === offerings.monthly && styles.selectedCard
              ]}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>Mensual</Text>
                {selectedPackage === offerings.monthly && (
                  <CheckCircle2 size={22} color={COLORS.primary} />
                )}
              </View>
              <Text style={styles.planPrice}>{offerings.monthly.product.priceString}</Text>
              <Text style={styles.planPeriod}>Facturado mensualmente</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* BOTÓN DE COMPRA */}
        <TouchableOpacity 
          style={styles.buttonContainer} 
          onPress={handlePurchase}
          disabled={isPurchasing || !selectedPackage}
        >
          <LinearGradient
            colors={[COLORS.primary, '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            {isPurchasing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                Comenzar con {selectedPackage?.product?.title || "Premium"}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* FOOTER / LEGAL */}
        <TouchableOpacity onPress={restorePurchases} style={styles.restoreButton}>
          <Text style={styles.restoreText}>Restaurar compras anteriores</Text>
        </TouchableOpacity>
        
        <Text style={styles.disclaimer}>
          La suscripción se renovará automáticamente a menos que se cancele en la configuración de su cuenta al menos 24 horas antes del final del período actual.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
  },
  benefitsContainer: {
    marginBottom: 30,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  plansContainer: {
    gap: 12,
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: "#EEF2FF", // Fondo azul muy suave al seleccionar
  },
  bestValueBadge: {
    position: "absolute",
    top: -10,
    right: 20,
    backgroundColor: "#F59E0B",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestValueText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
  },
  planPeriod: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  buttonContainer: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  restoreButton: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  restoreText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: "600",
  },
  disclaimer: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 10,
    lineHeight: 16,
  },
});