import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { createUserChallenge, getProfile } from '../lib/api';
import { supabase } from '../lib/supabase';

const CreateChallengeScreen = ({ navigation }: { navigation: any }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [userGrade, setUserGrade] = useState('');

  useEffect(() => {
    const fetchUserGrade = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        if (profile) {
          setUserGrade(profile.current_grade);
        }
      }
    };
    fetchUserGrade();
  }, []);

  const handleCreateChallenge = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const status = userGrade.startsWith('A') || userGrade.startsWith('B') ? 'approved' : 'pending';
      await createUserChallenge({
        creator_id: session.user.id,
        title,
        description,
        category,
        difficulty,
        estimated_time: estimatedTime,
        status,
      });
      navigation.goBack();
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Challenge</Text>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
      <TextInput style={styles.input} placeholder="Difficulty (e.g., Easy, Medium, Hard)" value={difficulty} onChangeText={setDifficulty} />
      <TextInput style={styles.input} placeholder="Estimated Time (e.g., 5 minutes)" value={estimatedTime} onChangeText={setEstimatedTime} />
      <Button title="Create Challenge" onPress={handleCreateChallenge} disabled={loading} color={colors.turquoise} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});

export default CreateChallengeScreen;
