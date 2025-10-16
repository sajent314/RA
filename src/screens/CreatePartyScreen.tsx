import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { createPartyStream } from '../lib/api';
import { supabase } from '../lib/supabase';

const CreatePartyScreen = ({ navigation }: { navigation: any }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [loading, setLoading] = useState(false);

  const handleCreateParty = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await createPartyStream({
        creator_id: session.user.id,
        title,
        description,
        category,
        privacy_level: privacy,
      });
      navigation.goBack();
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Party Stream</Text>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
      {/* Add a picker for privacy level here */}
      <Button title="Create Party" onPress={handleCreateParty} disabled={loading} color={colors.turquoise} />
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

export default CreatePartyScreen;
