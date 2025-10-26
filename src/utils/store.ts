// util riwayat baca (max 6), selalu aman (return [] kalau gagal)
export type HistoryItem = {
  slug: string;
  title: string;
  cover: string;
  at: number; // timestamp terakhir baca
};

const KEY = 'mr.history';

export const history = {
  get(): HistoryItem[] {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = JSON.parse(raw || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  },

  push(item: HistoryItem) {
    const arr = this.get();
    // hapus duplikat slug
    const filtered = arr.filter((x) => x.slug !== item.slug);
    filtered.unshift(item);
    const limited = filtered.slice(0, 6); // <= batasi 6 item
    localStorage.setItem(KEY, JSON.stringify(limited));
  },
};
