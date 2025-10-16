import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, FlatList, Image } from 'react-native';
import { colors } from '../constants/colors';
import { getTrendingContent, getNewGoodEnergyCreators, getUsersWithSimilarInterests } from '../lib/ExploreService';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
}

interface Submission {
  id: string;
  profiles: Profile;
}

const ExploreScreen = () => {
  const [trending, setTrending] = useState<Submission[]>([]);
  const [newCreators, setNewCreators] = useState<Profile[]>([]);
  const [similarUsers, setSimilarUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const [trendingData, creatorsData, similarUsersData] = await Promise.all([
          getTrendingContent(),
          getNewGoodEnergyCreators(),
          getUsersWithSimilarInterests(session.user.id),
        ]);
        setTrending(trendingData);
        setNewCreators(creatorsData);
        setSimilarUsers(similarUsersData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const renderCreator = ({ item }: { item: Profile }) => (
    <View style={styles.creatorCard}>
      <Image source={{ uri: item.avatar_url }} style={styles.creatorAvatar} />
      <Text style={styles.creatorUsername}>{item.username}</Text>
    </View>
  );

  if (loading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput style={styles.searchBar} placeholder="Search by interests..." />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Positive Energy</Text>
        {/* Placeholder for trending content */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Good Energy Creators</Text>
        <FlatList
          data={newCreators}
          renderItem={renderCreator}
          keyExtractor={(item) => item.id}
          horizontal
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Users With Similar Interests</Text>
        <FlatList
          data={similarUsers}
          renderItem={renderCreator}
          keyExtractor={(item) => item.id}
          horizontal
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchBar: {
    height: 50,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginLeft: 16,
    marginBottom: 12,
  },
  creatorCard: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  creatorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  creatorUsername: {
    marginTop: 8,
    fontSize: 14,
    color: colors.darkGray,
  },
});

export default ExploreScreen;
