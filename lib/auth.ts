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

// ID de Twitch de naigabot. Se comprueba por ID (no por login) porque un
// nombre de usuario de Twitch se puede cambiar; el ID es permanente.
const ADMIN_TWITCH_USER_ID = '1245032038';

/** Solo deja pasar a la cuenta de Twitch autorizada para ver el panel de datos. */
export async function requireAdminSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session || session.twitch_user_id !== ADMIN_TWITCH_USER_ID) return null;
  return session;
}
