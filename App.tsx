import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/lib/supabase';
import AuthNavigator from './src/navigation/AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Compass, Trophy, PlusCircle, User } from 'lucide-react-native';
import { colors } from './src/constants/colors';
import { startLocationTracking } from './src/lib/LocationTracker';

import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import ChallengesScreen from './src/screens/ChallengesScreen';
import CreateNavigator from './src/navigation/CreateNavigator';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // startLocationTracking();
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // startLocationTracking();
      }
    });
  }, []);

  return (
    <NavigationContainer>
      {session && session.user ? (
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            tabBarActiveTintColor: colors.turquoise,
            tabBarInactiveTintColor: colors.darkGray,
            tabBarStyle: {
              backgroundColor: colors.white,
              borderTopColor: colors.lightGray,
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 5,
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            }}
          />
          <Tab.Screen
            name="Explore"
            component={ExploreScreen}
            options={{
              tabBarLabel: 'Explore',
            tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
            }}
          />
          <Tab.Screen
            name="Challenge"
            component={ChallengesScreen}
            options={{
              tabBarLabel: 'Challenge',
            tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
            }}
          />
          <Tab.Screen
            name="Create"
            component={CreateNavigator}
            options={{
              tabBarLabel: 'Create',
            tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
        </Tab.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
