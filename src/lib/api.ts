import { supabase } from './supabase';
import { Alert, Platform } from 'react-native';
import { incrementPebiScore, incrementAiScore } from './ActivityTracker';

const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    // @ts-ignore
    alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

// --- Authentication ---
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    showAlert('Error signing up', error.message);
    return null;
  }
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    showAlert('Error signing in', error.message);
    return null;
  }
  return true;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    showAlert('Error signing out', error.message);
  }
};

// --- Profiles & Grading ---
export const createProfile = async (id: string, username: string, interests: string[]) => {
  const { data, error } = await supabase.from('profiles').insert({ id, username, interests }).select().single();
  if (error) {
    showAlert('Error creating profile', error.message);
    return null;
  }
  return data;
};

export const getProfile = async (id: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) {
    showAlert('Error fetching profile', error.message);
    return null;
  }
  return data;
};

// --- Activity Logs & Grading ---
export const getActivityLog = async (userId: string, date: string) => {
  const { data, error } = await supabase.from('activity_logs').select('*').eq('user_id', userId).eq('log_date', date).single();
  if (error) {
    console.log('No activity log for today, one will be created.');
    return null;
  }
  return data;
};

export const upsertActivityLog = async (log: { user_id: string; pebi_score?: number; ai_score?: number; at_score?: number; }) => {
  const { data, error } = await supabase.from('activity_logs').upsert(log, { onConflict: 'user_id, log_date' }).select().single();
  if (error) {
    showAlert('Error updating activity log', error.message);
    return null;
  }
  return data;
};

// --- Hourly Challenges ---
export const getHourlyChallenge = async (hour: number) => {
  const { data, error } = await supabase.from('hourly_challenges').select('*').eq('hour', hour).single();
  if (error) {
    showAlert('Error fetching hourly challenge', error.message);
    return null;
  }
  return data;
};

export const submitToChallenge = async (submission: { user_id: string; challenge_id: number; media_url?: string; media_type?: string; }) => {
  const { data, error } = await supabase.from('challenge_submissions').insert(submission).select().single();
  if (error) {
    showAlert('Error submitting to challenge', error.message);
    return null;
  }
  if (data) {
    await incrementAiScore(submission.user_id);
  }
  return data;
};

// --- Home Feed ---
export const getHomeFeed = async (userId: string) => {
  // This is a simplified version. The full algorithm will be in HomeFeed.ts
  const { data: following, error: followError } = await supabase.from('follows').select('following_id').eq('follower_id', userId);
  if (followError) {
    showAlert('Error fetching feed', followError.message);
    return null;
  }
  const followingIds = following.map(f => f.following_id);

  const { data, error } = await supabase.from('challenge_submissions').select('*, profiles(*)').in('user_id', followingIds).order('created_at', { ascending: false });
  if (error) {
    showAlert('Error fetching feed', error.message);
    return null;
  }
  return data;
};

export const getCuratedHomeFeed = async (userId: string) => {
  // This is a simplified version. The full algorithm will be in HomeFeed.ts
  const { data: following, error: followError } = await supabase.from('follows').select('following_id').eq('follower_id', userId);
  if (followError) {
    showAlert('Error fetching feed', followError.message);
    return null;
  }
  const followingIds = following.map(f => f.following_id);

  const { data, error } = await supabase.from('challenge_submissions').select('*, profiles(*)').in('user_id', followingIds).order('created_at', { ascending: false });
  if (error) {
    showAlert('Error fetching feed', error.message);
    return null;
  }
  return data;
};

// --- Social & Energy ---
export const sendPositiveEnergy = async (interaction: { sender_id: string; receiver_id: string; target_type: string; target_id: string; }) => {
  const { data, error } = await supabase.from('positive_energy_interactions').insert(interaction).select().single();
  if (error) {
    showAlert('Error sending positive energy', error.message);
    return null;
  }
  if (data) {
    await incrementPebiScore(interaction.sender_id);
    await incrementPebiScore(interaction.receiver_id);
  }
  return data;
};

export const followUser = async (follower_id: string, following_id: string, follow_type: 'user' | 'good_energy_page' = 'user') => {
  const { data, error } = await supabase.from('follows').insert({ follower_id, following_id, follow_type }).select().single();
  if (error) {
    showAlert('Error following', error.message);
    return null;
  }
  return data;
};

export const unfollowUser = async (follower_id: string, following_id: string) => {
  const { error } = await supabase.from('follows').delete().eq('follower_id', follower_id).eq('following_id', following_id);
  if (error) {
    showAlert('Error unfollowing', error.message);
  }
};

export const getGoodEnergyPages = async () => {
  const { data, error } = await supabase.from('profiles').select('*').eq('is_verified', true);
  if (error) {
    showAlert('Error fetching Good Energy Pages', error.message);
    return [];
  }
  return data;
};

// --- Create Features ---
export const createPartyStream = async (party: { creator_id: string; title: string; description: string; category: string; privacy_level: 'public' | 'private'; max_viewers?: number; }) => {
  const { data, error } = await supabase.from('parties').insert(party).select().single();
  if (error) {
    showAlert('Error creating party stream', error.message);
    return null;
  }
  return data;
};

export const createUserChallenge = async (challenge: { creator_id: string; title: string; description: string; category: string; difficulty: string; estimated_time: string; media_url?: string; status: 'pending' | 'approved'; }) => {
  const { data, error } = await supabase.from('user_challenges').insert(challenge).select().single();
  if (error) {
    showAlert('Error creating challenge', error.message);
    return null;
  }
  return data;
};
