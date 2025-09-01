import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebaseConfig';

// Import Screens
import Login from './screens/Login';
import Register from './screens/Register';
import ForgotPassword from './screens/ForgotPassword';
import Dashboard from './screens/Dashboard';
import AddExpense from './screens/AddExpense';
import ViewExpense from './screens/ViewExpense';
import Profile from './screens/Profile';

const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Authentication Screens
function AuthScreens({ setUserLoggedIn }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login">
        {(props) => <Login {...props} setUserLoggedIn={setUserLoggedIn} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthStack.Navigator>
  );
}

// Bottom Tab Navigator
function BottomTabs({ setUserLoggedIn }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'dashboard';
          else if (route.name === 'Add Expense') iconName = 'add-circle-outline';
          else if (route.name === 'View Expenses') iconName = 'list';
          else if (route.name === 'Profile') iconName = 'person';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFC107',
        tabBarInactiveTintColor: '#555',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Add Expense" component={AddExpense} />
      <Tab.Screen name="View Expenses" component={ViewExpense} />
      <Tab.Screen name="Profile">
        {(props) => <Profile {...props} setUserLoggedIn={setUserLoggedIn} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? <BottomTabs setUserLoggedIn={setIsLoggedIn} /> : <AuthScreens setUserLoggedIn={setIsLoggedIn} />}
    </NavigationContainer>
  );
}
