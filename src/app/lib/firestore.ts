import { supabase } from './firebase';
import { type Station, mockStations } from './data';

function dbToStation(row: Record<string, any>): Station {
  return {
    id: String(row.id),
    name: row.name,
    city: row.city,
    type: row.type,
    crowd: row.crowd ?? null,
    wait: row.wait ?? 'Unknown',
    fresh: row.fresh ?? row.updated_at ?? row.created_at ?? 'Unknown',
    address: row.address ?? '',
    note: row.note ?? '',
  };
}

export function subscribeToStationsByCity(
  city: string,
  callback: (stations: Station[]) => void
): () => void {
  let active = true;

  async function load() {
    const { data, error } = await supabase
      .from('stations')
      .select('*')
      .eq('city', city)
      .eq('status', 'approved');

    if (!active) return;
    if (error) {
      console.error('[Binz] Supabase stations error:', error.message);
      callback([]);
      return;
    }
    callback((data ?? []).map(dbToStation));
  }

  load();

  const channel = supabase
    .channel(`stations-${city}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stations' }, load)
    .subscribe();

  return () => {
    active = false;
    supabase.removeChannel(channel);
  };
}

export function subscribeToStation(
  stationId: string,
  callback: (station: Station | null) => void
): () => void {
  let active = true;

  async function load() {
    const { data, error } = await supabase
      .from('stations')
      .select('*')
      .eq('id', stationId)
      .maybeSingle();

    if (!active) return;
    if (error) {
      console.error('[Binz] Supabase station error:', error.message);
      callback(null);
      return;
    }
    callback(data ? dbToStation(data) : null);
  }

  load();

  const channel = supabase
    .channel(`station-${stationId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stations' }, load)
    .subscribe();

  return () => {
    active = false;
    supabase.removeChannel(channel);
  };
}

export async function reportCrowd(stationId: string, crowd: number): Promise<void> {
  const wait = crowd < 50 ? '15 min' : crowd < 70 ? '45 min' : '90+ min';
  const { error } = await supabase
    .from('stations')
    .update({ crowd, wait, fresh: new Date().toISOString() })
    .eq('id', stationId);
  if (error) console.error('[Binz] reportCrowd error:', error.message);
}

export async function submitStation(
  data: { name: string; city: string; type: string; address: string; note?: string },
  userId: string
): Promise<void> {
  const { error } = await supabase.from('pending_stations').insert([{ ...data, submitted_by: userId }]);
  if (error) console.error('[Binz] submitStation error:', error.message);
}

export function subscribeToPendingStations(
  callback: (stations: Record<string, any>[]) => void
): () => void {
  let active = true;

  async function load() {
    const { data, error } = await supabase.from('pending_stations').select('*');
    if (!active) return;
    if (error) {
      console.error('[Binz] pending stations error:', error.message);
      callback([]);
      return;
    }
    callback(data ?? []);
  }

  load();

  const channel = supabase
    .channel('pending-stations')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pending_stations' }, load)
    .subscribe();

  return () => {
    active = false;
    supabase.removeChannel(channel);
  };
}

export async function approveStation(pendingId: string, data: Record<string, any>): Promise<void> {
  const { error: insertError } = await supabase.from('stations').insert([{
    name: data.name,
    city: data.city,
    type: data.type,
    address: data.address || '',
    note: data.note || '',
    status: 'approved',
    crowd: null,
    wait: 'Unknown',
    fresh: new Date().toISOString(),
  }]);

  if (insertError) {
    console.error('[Binz] approveStation insert error:', insertError.message);
    return;
  }

  const { error: deleteError } = await supabase
    .from('pending_stations')
    .delete()
    .eq('id', pendingId);

  if (deleteError) console.error('[Binz] approveStation delete error:', deleteError.message);
}

export async function rejectStation(pendingId: string): Promise<void> {
  const { error } = await supabase.from('pending_stations').delete().eq('id', pendingId);
  if (error) console.error('[Binz] rejectStation error:', error.message);
}

export function subscribeToFavorites(userId: string, callback: (stationIds: string[]) => void): () => void {
  let active = true;

  async function load() {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('station_id')
      .eq('user_id', userId);

    if (!active) return;
    if (error) {
      console.error('[Binz] favorites error:', error.message);
      callback([]);
      return;
    }
    callback((data ?? []).map((r: any) => String(r.station_id)));
  }

  load();

  const channel = supabase
    .channel(`favorites-${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'user_favorites' }, load)
    .subscribe();

  return () => {
    active = false;
    supabase.removeChannel(channel);
  };
}

export async function toggleFavorite(userId: string, stationId: string, current: string[]): Promise<void> {
  if (current.includes(stationId)) {
    await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('station_id', stationId);
  } else {
    await supabase.from('user_favorites').insert([{ user_id: userId, station_id: stationId }]);
  }
}

export async function getFavoriteStations(ids: string[]): Promise<Station[]> {
  if (!ids.length) return [];
  const { data, error } = await supabase.from('stations').select('*').in('id', ids);
  if (error) {
    console.error('[Binz] getFavoriteStations error:', error.message);
    return [];
  }
  return (data ?? []).map(dbToStation);
}

export async function seedInitialData(): Promise<void> {
  const { count } = await supabase
    .from('stations')
    .select('*', { count: 'exact', head: true });

  if ((count ?? 0) >= 16) return;

  const rows = mockStations.map((s) => ({
    id: s.id,
    name: s.name,
    city: s.city,
    type: s.type,
    crowd: s.crowd,
    wait: s.wait,
    address: s.address || '',
    note: s.note || '',
    status: 'approved',
    fresh: new Date().toISOString(),
  }));

  const { error } = await supabase.from('stations').upsert(rows);
  if (error) console.error('[Binz] seedInitialData error:', error.message);
}
