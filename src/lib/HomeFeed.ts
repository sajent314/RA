import { supabase } from './supabase';

const getCloseFriends = async (userId: string) => {
  // Placeholder logic: identify users with whom there have been more than 10 interactions
  const { data, error } = await supabase
    .from('positive_energy_interactions')
    .select('sender_id, receiver_id')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

  if (error) {
    console.error('Error fetching interactions:', error);
    return [];
  }

  const interactionCounts = data.reduce((acc: { [key: string]: number }, interaction) => {
    const otherUserId = interaction.sender_id === userId ? interaction.receiver_id : interaction.sender_id;
    acc[otherUserId] = (acc[otherUserId] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(interactionCounts).filter(id => interactionCounts[id] > 10);
};

export const getCuratedHomeFeed = async (userId: string) => {
  const closeFriends = await getCloseFriends(userId);

  const { data: goodEnergyPages, error: pagesError } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId)
    .eq('follow_type', 'good_energy_page');

  if (pagesError) {
    console.error('Error fetching good energy pages:', pagesError);
    return [];
  }

  const pageIds = goodEnergyPages.map(p => p.following_id);
  const feedUserIds = [...new Set([...closeFriends, ...pageIds])];

  const { data, error } = await supabase
    .from('challenge_submissions')
    .select('*, profiles(*)')
    .in('user_id', feedUserIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching curated feed:', error);
    return [];
  }

  return data;
};
