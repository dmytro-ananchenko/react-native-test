import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { firebaseAuth } from './FirebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import Home from './app/screens/Home';
import Login from './app/screens/Login';
import Signup from './app/screens/Signup';
import Note from './app/screens/Note';

const Stack = createNativeStackNavigator();
const PublicStack = createNativeStackNavigator();
const ProtectedStack = createNativeStackNavigator();

const PublicStackScreen = () => {
  return (
    <PublicStack.Navigator>
      <PublicStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <PublicStack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
    </PublicStack.Navigator>
  );
}

const ProtectedStackScreen = () => {
  return (
    <ProtectedStack.Navigator>
      <ProtectedStack.Screen name="Home" component={Home} />
      <ProtectedStack.Screen name="Note" component={Note} options={{ headerShown: false }} />
    </ProtectedStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return () => unsubscribe();
  }, [initializing]);

  if (initializing) return null; // Render a loading screen or null while checking auth state

  return (
    <NavigationContainer>
      {user ? <ProtectedStackScreen /> : <PublicStackScreen />}
    </NavigationContainer>
  );
}