import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateScreen from '../screens/CreateScreen';
import CreatePartyScreen from '../screens/CreatePartyScreen';
import CreateChallengeScreen from '../screens/CreateChallengeScreen';

const Stack = createStackNavigator();

const CreateNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreateMain" component={CreateScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateParty" component={CreatePartyScreen} options={{ title: 'Create Party' }} />
      <Stack.Screen name="CreateChallenge" component={CreateChallengeScreen} options={{ title: 'Create Challenge' }} />
    </Stack.Navigator>
  );
};

export default CreateNavigator;
