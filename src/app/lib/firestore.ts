import {
  collection, doc, getDoc, getDocs, setDoc, addDoc,
  updateDoc, deleteDoc, onSnapshot, query, where,
  serverTimestamp, Timestamp, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { type Station, mockStations } from './data';

function formatFresh(ts: Timestamp): string {
  const s = Math.floor((Date.now() - ts.toMillis()) / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function docToStation(id: string, data: Record<string, any>): Station {
  const fresh =
    data.fresh && typeof data.fresh.toMillis === 'function'
      ? formatFresh(data.fresh as Timestamp)
      : (data.fresh as string) || 'Unknown';
  return {
    id,
    name: data.name,
    city: data.city,
    type: data.type,
    crowd: data.crowd ?? null,
    wait: data.wait,
    fresh,
    address: data.address,
    note: data.note,
  };
}

// ─── Stations ────────────────────────────────────────────────────────────────

export function subscribeToStationsByCity(
  city: string,
  callback: (stations: Station[]) => void
): () => void {
  const q = query(collection(db, 'stations'), where('city', '==', city));
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => docToStation(d.id, d.data())))
  );
}

export function subscribeToStation(
  stationId: string,
  callback: (station: Station | null) => void
): () => void {
  return onSnapshot(doc(db, 'stations', stationId), (snap) =>
    callback(snap.exists() ? docToStation(snap.id, snap.data()) : null)
  );
}

export async function reportCrowd(stationId: string, crowd: number): Promise<void> {
  const wait =
    crowd < 50 ? '15 min' : crowd < 70 ? '45 min' : '90+ min';
  await updateDoc(doc(db, 'stations', stationId), {
    crowd,
    wait,
    fresh: serverTimestamp(),
  });
}

// ─── Pending Stations ─────────────────────────────────────────────────────────

export async function submitStation(
  data: { name: string; city: string; type: string; address: string; note?: string },
  userId: string
): Promise<void> {
  await addDoc(collection(db, 'pendingStations'), {
    ...data,
    submittedBy: userId,
    submittedAt: serverTimestamp(),
  });
}

export function subscribeToPendingStations(
  callback: (stations: Record<string, any>[]) => void
): () => void {
  return onSnapshot(collection(db, 'pendingStations'), (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

export async function approveStation(
  pendingId: string,
  data: Record<string, any>
): Promise<void> {
  const batch = writeBatch(db);
  const newRef = doc(collection(db, 'stations'));
  batch.set(newRef, {
    name: data.name,
    city: data.city,
    type: data.type,
    address: data.address || '',
    note: data.note || '',
    crowd: null,
    wait: 'Unknown',
    fresh: serverTimestamp(),
  });
  batch.delete(doc(db, 'pendingStations', pendingId));
  await batch.commit();
}

export async function rejectStation(pendingId: string): Promise<void> {
  await deleteDoc(doc(db, 'pendingStations', pendingId));
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export function subscribeToFavorites(
  userId: string,
  callback: (stationIds: string[]) => void
): () => void {
  return onSnapshot(doc(db, 'userFavorites', userId), (snap) =>
    callback(snap.exists() ? (snap.data().stationIds as string[]) || [] : [])
  );
}

export async function toggleFavorite(
  userId: string,
  stationId: string,
  current: string[]
): Promise<void> {
  const next = current.includes(stationId)
    ? current.filter((id) => id !== stationId)
    : [...current, stationId];
  await setDoc(doc(db, 'userFavorites', userId), { stationIds: next }, { merge: true });
}

export async function getFavoriteStations(ids: string[]): Promise<Station[]> {
  if (!ids.length) return [];
  const results = await Promise.all(
    ids.map(async (id) => {
      const snap = await getDoc(doc(db, 'stations', id));
      return snap.exists() ? docToStation(snap.id, snap.data()) : null;
    })
  );
  return results.filter((s): s is Station => s !== null);
}

// ─── Seed ────────────────────────────────────────────────────────────────────

export async function seedInitialData(): Promise<void> {
  const snap = await getDocs(collection(db, 'stations'));
  if (snap.size >= 10) return;

  const batch = writeBatch(db);
  mockStations.forEach((s) => {
    const ref = doc(collection(db, 'stations'));
    batch.set(ref, {
      name: s.name,
      city: s.city,
      type: s.type,
      crowd: s.crowd,
      wait: s.wait,
      address: s.address || '',
      note: s.note || '',
      fresh: serverTimestamp(),
    });
  });
  await batch.commit();
}
