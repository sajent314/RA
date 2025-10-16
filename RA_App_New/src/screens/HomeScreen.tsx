import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { colors } from '../constants/colors';
import { getHomeFeed } from '../lib/api';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
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

  useEffect(() => {
    const fetchFeed = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const feedData = await getHomeFeed(session.user.id);
        if (feedData) {
          setFeed(feedData);
        }
      }
      setLoading(false);
    };

    fetchFeed();
  }, []);

  const renderFeedItem = ({ item }: { item: FeedItem }) => (
    <View style={styles.feedItem}>
      <View style={styles.header}>
        <Image source={{ uri: item.profiles.avatar_url }} style={styles.avatar} />
        <Text style={styles.username}>{item.profiles.username}</Text>
      </View>
      <Image source={{ uri: item.media_url }} style={styles.media} />
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
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text>Your feed is empty. Follow some friends!</Text>}
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
  media: {
    width: '100%',
    height: 400,
  },
  caption: {
    padding: 12,
    fontSize: 14,
    color: colors.darkGray,
  },
});

export default HomeScreen;
