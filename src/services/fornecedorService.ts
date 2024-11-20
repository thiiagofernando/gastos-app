import { ref, push, get, update, remove, query, limitToFirst, orderByKey, startAfter } from 'firebase/database';
import { db } from '../config/firebase';
import { Fornecedor } from '../types/interfaces';

export const fornecedorService = {
  async create(fornecedor: Omit<Fornecedor, 'id'>) {
    const reference = ref(db, 'fornecedores');
    const newRef = await push(reference, fornecedor);
    return { ...fornecedor, id: newRef.key };
  },
  async getPage(page: number, pageSize: number) {
    const fornecedoresRef = ref(db, 'fornecedores');
    let fornecedoresQuery;

    if (page === 0) {
      fornecedoresQuery = query(fornecedoresRef, orderByKey(), limitToFirst(pageSize + 1));
    } else {
      const snapshot = await get(query(fornecedoresRef, orderByKey(), limitToFirst(page * pageSize)));
      const lastVisible = Object.keys(snapshot.val() || {})[snapshot.size - 1];
      fornecedoresQuery = query(fornecedoresRef, orderByKey(), startAfter(lastVisible), limitToFirst(pageSize + 1));
    }

    const snapshot = await get(fornecedoresQuery);
    const fornecedores: Fornecedor[] = [];
    let hasNextPage = false;

    snapshot.forEach((childSnapshot) => {
      if (fornecedores.length < pageSize) {
        fornecedores.push({
          id: childSnapshot.key as string,
          ...childSnapshot.val()
        });
      } else {
        hasNextPage = true;
      }
    });

    return { fornecedores, hasNextPage };
  },
  async getAll() {
    const reference = ref(db, 'fornecedores');
    const snapshot = await get(reference);
    const fornecedores: Fornecedor[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        fornecedores.push({
          id: child.key as string,
          ...child.val()
        });
      });
    }
    
    return fornecedores;
  },

  async update(id: string, fornecedor: Partial<Fornecedor>) {
    const reference = ref(db, `fornecedores/${id}`);
    await update(reference, fornecedor);
    return { ...fornecedor, id };
  },

  async delete(id: string) {
    const reference = ref(db, `fornecedores/${id}`);
    await remove(reference);
  }
};

