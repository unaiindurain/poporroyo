import { getSession, type SessionPayload } from '@/lib/session';
import { getStreamerChannel } from '@/lib/db';

/** Comprueba que la sesión activa pertenece al streamer vinculado al canal. */
export async function requireStreamerSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session || session.role !== 'streamer') return null;

  const channel = await getStreamerChannel();
  if (!channel || channel.broadcaster_user_id !== session.twitch_user_id) return null;

  return session;
}
