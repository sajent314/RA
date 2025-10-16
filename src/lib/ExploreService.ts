import { supabase } from './supabase';

// --- Positive Energy Trending ---
export const getTrendingContent = async () => {
  const { data, error } = await supabase.rpc('get_trending_submissions');

  if (error) {
    console.error('Error fetching trending content:', error);
    return [];
  }

  const submissionIds = data.map((item: any) => item.submission_id);
  const { data: submissions, error: submissionsError } = await supabase
    .from('challenge_submissions')
    .select('*, profiles(*)')
    .in('id', submissionIds);

  if (submissionsError) {
    console.error('Error fetching trending submissions:', submissionsError);
    return [];
  }

  return submissions;
};

// --- Discovery ---
export const getNewGoodEnergyCreators = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_verified', true)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching new good energy creators:', error);
    return [];
  }
  return data;
};

export const getUsersWithSimilarInterests = async (userId: string) => {
  const { data: currentUser, error: currentUserError } = await supabase
    .from('profiles')
    .select('interests')
    .eq('id', userId)
    .single();

  if (currentUserError || !currentUser) {
    console.error('Error fetching current user interests:', currentUserError);
    return [];
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', userId)
    .overlaps('interests', currentUser.interests)
    .limit(10);

  if (error) {
    console.error('Error fetching users with similar interests:', error);
    return [];
  }
  return data;
};
