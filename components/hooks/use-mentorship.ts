import { useState, useEffect } from 'react';
import { Mentorship, MentorshipSession, getMentorships, requestMentorship, getMentorshipSessions, scheduleMentorshipSession } from '@/lib/mentorship-utils';

export function useMentorship(userId: string | undefined) {
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedMentorships, fetchedSessions] = await Promise.all([
          getMentorships(userId),
          getMentorshipSessions(userId)
        ]);
        
        setMentorships(fetchedMentorships);
        setSessions(fetchedSessions);
      } catch (err) {
        setError('Failed to fetch mentorship data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const requestMentor = async (mentorId: string, message: string) => {
    try {
      const newMentorship = await requestMentorship(mentorId, message);
      setMentorships([...mentorships, newMentorship]);
      return newMentorship;
    } catch (err) {
      setError('Failed to request mentorship');
      console.error(err);
      throw err;
    }
  };

  const scheduleSession = async (
    mentorshipId: string,
    scheduledAt: Date,
    duration: number,
    topic: string
  ) => {
    try {
      const newSession = await scheduleMentorshipSession(mentorshipId, scheduledAt, duration, topic);
      setSessions([...sessions, newSession]);
      return newSession;
    } catch (err) {
      setError('Failed to schedule session');
      console.error(err);
      throw err;
    }
  };

  return {
    mentorships,
    sessions,
    loading,
    error,
    requestMentor,
    scheduleSession
  };
}