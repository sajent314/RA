import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, RefreshControl, Platform } from 'react-native';
import { colors } from '../constants/colors';
import { getCuratedHomeFeed, sendPositiveEnergy } from '../lib/api';
import { supabase } from '../lib/supabase';
import { Heart } from 'lucide-react-native';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  is_verified: boolean;
}

interface FeedItem {
  id: string;
  media_url: string;
  caption: string;
  profiles: Profile;
}

const HomeScreen = () => {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setCurrentUser(session.user);
      const feedData = await getCuratedHomeFeed(session.user.id);
      if (feedData) {
        setFeed(feedData);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const handleSendPositiveEnergy = async (receiverId: string, targetId: string) => {
    if (currentUser) {
      await sendPositiveEnergy({
        sender_id: currentUser.id,
        receiver_id: receiverId,
        target_type: 'submission',
        target_id: targetId,
      });
      if (Platform.OS === 'web') {
        // @ts-ignore
        alert('Positive Energy Sent!');
      } else {
        Alert.alert('Positive Energy Sent!');
      }
    }
  };

  const renderFeedItem = ({ item }: { item: FeedItem }) => (
    <View style={styles.feedItem}>
      <View style={styles.header}>
        <Image source={{ uri: item.profiles.avatar_url }} style={styles.avatar} />
        <Text style={styles.username}>{item.profiles.username}</Text>
        {item.profiles.is_verified && <View style={styles.badge}><Text style={styles.badgeText}>GEP</Text></View>}
      </View>
      <Image source={{ uri: item.media_url }} style={styles.media} />
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleSendPositiveEnergy(item.profiles.id, item.id)}>
          <Heart color={colors.turquoise} />
        </TouchableOpacity>
      </View>
      <Text style={styles.caption}>{item.caption}</Text>
    </View>
  );

  if (loading) {
    return <View style={styles.container}><Text>Loading feed...</Text></View>;
  }

  return (
    <FlatList
      style={styles.container}
      data={feed}
      renderItem={renderFeedItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={<Text style={styles.emptyText}>Your feed is empty. Follow some friends and Good Energy Pages!</Text>}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  feedItem: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  badge: {
    backgroundColor: colors.turquoise,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  media: {
    width: '100%',
    height: 400,
  },
  actions: {
    padding: 12,
  },
  caption: {
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.darkGray,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 16,
    color: colors.darkGray,
  },
});

export default HomeScreen;
