import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import Purchases from 'react-native-purchases';

// API KEYS DE REVENUECAT (Obtenlas en el Dashboard de RevenueCat)
const APIKeys = {
  apple: "test_ODEjtGXbsFUoKkzepJrMtVbimWj",
  google: "test_ODEjtGXbsFUoKkzepJrMtVbimWj" // Usa esta para emulador Android
};

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [offerings, setOfferings] = useState(null); // Productos disponibles
  const [isPro, setIsPro] = useState(false); // Estado de la suscripción
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      try {
        if (Platform.OS === 'android') {
          await Purchases.configure({ apiKey: APIKeys.google });
        } else {
          await Purchases.configure({ apiKey: APIKeys.apple });
        }

        // Cargar información del usuario actual
        const customerInfo = await Purchases.getCustomerInfo();
        checkProStatus(customerInfo);

        // Cargar Ofertas (Productos configurados en RevenueCat)
        loadOfferings();
      } catch (e) {
        console.log("Error configurando RevenueCat", e);
      } finally {
        setLoading(false);
      }
    };

    setup();
  }, []);

  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        setOfferings(offerings.current);
      }
    } catch (e) {
      console.log("Error cargando ofertas", e);
    }
  };

  const checkProStatus = (customerInfo) => {
    // 'premium' debe coincidir con el ID de tu Entitlement en RevenueCat
    if (customerInfo.entitlements.active['FintechApp Premium']) {
      setIsPro(true);
    } else {
      setIsPro(false);
    }
  };

  // Función de Compra
  const purchasePackage = async (pack) => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pack);
      checkProStatus(customerInfo);
      return true; // Compra exitosa
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert("Error", e.message);
      }
      return false; // Error o cancelado
    }
  };

  // Restaurar compras (Obligatorio por Apple/Google)
  const restorePurchases = async () => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      checkProStatus(customerInfo);
      Alert.alert("Éxito", "Compras restauradas correctamente");
    } catch (e) {
      Alert.alert("Error", "No se pudieron restaurar las compras");
    }
  };
  useEffect(() => {
  console.log("Offerings loaded: ", offerings);
}, [offerings]);

  return (
    <SubscriptionContext.Provider value={{ offerings, isPro, purchasePackage, restorePurchases, loading }}>
      {children}
      
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);