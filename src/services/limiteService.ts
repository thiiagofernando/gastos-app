import { ref, push, get, update, remove, limitToFirst, orderByKey, query } from 'firebase/database';
import { db } from '../config/firebase';
import { Limite } from '../types/interfaces';

export const limiteService = {
  async create(limite: Omit<Limite, 'id'>) {
    const reference = ref(db, 'limites');
    const newRef = await push(reference, limite);
    return { ...limite, id: newRef.key };
  },
  async getPage(page: number, pageSize: number) {
    const reference = ref(db, 'limites');
    const snapshot = await get(query(reference, orderByKey(), limitToFirst((page * pageSize) + 1)));
    const limites: Limite[] = [];
    let hasNextPage = false;
  
    snapshot.forEach((child) => {
      if (limites.length < pageSize) {
        limites.push({
          id: child.key as string,
          ...child.val()
        });
      } else {
        hasNextPage = true;
      }
    });
  
    return { limites, hasNextPage };
  },
  async getAll() {
    const reference = ref(db, 'limites');
    const snapshot = await get(reference);
    const limites: Limite[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        limites.push({
          id: child.key as string,
          ...child.val()
        });
      });
    }
    
    return limites;
  },

  async update(id: string, limite: Partial<Limite>) {
    const reference = ref(db, `limites/${id}`);
    await update(reference, limite);
    return { ...limite, id };
  },

  async delete(id: string) {
    const reference = ref(db, `limites/${id}`);
    await remove(reference);
  }
};
