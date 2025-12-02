import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Onboarding
import Onboarding1 from './screens/Onboarding1';
import Onboarding2 from './screens/Onboarding2';
import Onboarding3 from './screens/Onboarding3';

// Auth & Login
import LoginScreen from './screens/LoginScreen';
import SingUp from './screens/SingUp';
import PhoneInput from './screens/PhoneInput';
import ConfirmPhoneScreen from './screens/ConfirmPhoneScreen';
import VerifyNumberScreen from './screens/VerifyNumberScreen';
import CreatePasscodeScreen from './screens/CreatePasscodeScreen';

// Personal setup
import AddEmailScreen from './screens/AddEmailScreen';
import CountryResidenceScreen from './screens/CountryResidenceScreen';
import PersonalInfoScreen from './screens/PersonalInfoScreen';
import AddressScreen from './screens/AddressScreen';
import SupportChatScreen from './screens/SupportChatScreen';
import ProfileScreen from './screens/ProfileScreen'

// Home
import HomeScreen from './screens/HomeScreen';

// Tarjetas
import AddCardIntroScreen from './screens/AddCardIntroScreen';
import AddCardFormScreen from "./screens/AddCardFormScreen";
import AddCardVerifyScreen from "./screens/AddCardVerifyScreen";
import CardListScreen from "./screens/CardListScreen"


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Onboarding1" screenOptions={{ headerShown: false }}>

        {/* Onboarding */}
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} />
        <Stack.Screen name="Onboarding3" component={Onboarding3} />

        {/* Auth */}
        <Stack.Screen name="SingUp" component={SingUp} />
        <Stack.Screen name="PhoneInput" component={PhoneInput} />
        <Stack.Screen name="ConfirmPhoneScreen" component={ConfirmPhoneScreen} />
        <Stack.Screen name="VerifyNumberScreen" component={VerifyNumberScreen} />
        <Stack.Screen name="CreatePasscodeScreen" component={CreatePasscodeScreen} />

        {/* Personal info */}
        <Stack.Screen name="AddEmailScreen" component={AddEmailScreen} />
        <Stack.Screen name="CountryResidenceScreen" component={CountryResidenceScreen} />
        <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
        <Stack.Screen name="AddressScreen" component={AddressScreen} />
        <Stack.Screen name="SupportChat" component={SupportChatScreen} />
        <Stack.Screen name="ProfileSreen" component={ProfileScreen} />

        {/* App */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="AddCardIntro" component={AddCardIntroScreen} />
        <Stack.Screen name="AddCardForm" component={AddCardFormScreen} />
        <Stack.Screen name="AddCardVerify" component={AddCardVerifyScreen} />
        <Stack.Screen name="CardList" component={CardListScreen} />
        


      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
