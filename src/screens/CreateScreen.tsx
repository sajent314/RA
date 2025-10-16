import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { colors } from '../constants/colors';

const CreateScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create</Text>
      <View style={styles.buttonContainer}>
        <Button title="Start a Live Party Stream" onPress={() => navigation.navigate('CreateParty')} color={colors.turquoise} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Create a New Challenge" onPress={() => navigation.navigate('CreateChallenge')} color={colors.turquoise} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 32,
  },
  buttonContainer: {
    marginVertical: 8,
    width: '80%',
  },
});

export default CreateScreen;
