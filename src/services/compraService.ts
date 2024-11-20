import { ref, push, get, update, remove, query, limitToFirst, orderByKey, equalTo, orderByChild, startAfter } from 'firebase/database';
import { db } from '../config/firebase';
import { Compra } from '../types/interfaces';

export const compraService = {
  async create(compra: Omit<Compra, 'id'>) {
    const reference = ref(db, 'compras');
    const newRef = await push(reference, compra);
    return { ...compra, id: newRef.key };
  },
  async getPage(page: number, pageSize: number) {
    const comprasRef = ref(db, 'compras');
    let comprasQuery;

    if (page === 0) {
      comprasQuery = query(comprasRef, orderByKey(), limitToFirst(pageSize + 1));
    } else {
      const snapshot = await get(query(comprasRef, orderByKey(), limitToFirst(page * pageSize)));
      const lastVisible = Object.keys(snapshot.val() || {})[snapshot.size - 1];
      comprasQuery = query(comprasRef, orderByKey(), startAfter(lastVisible), limitToFirst(pageSize + 1));
    }

    const snapshot = await get(comprasQuery);
    const compras: Compra[] = [];
    let hasNextPage = false;

    snapshot.forEach((childSnapshot) => {
      if (compras.length < pageSize) {
        compras.push({
          id: childSnapshot.key as string,
          ...childSnapshot.val()
        });
      } else {
        hasNextPage = true;
      }
    });

    return { compras, hasNextPage };
  },
  async getTodos() {
    const reference = ref(db, 'compras');
    const snapshot = await get(reference);
    const compras: Compra[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        compras.push({
          id: child.key as string,
          ...child.val()
        });
      });
    }
    
    return compras;
  },

  async getByMonth(mes: number, ano: number) {
    const reference = ref(db, 'compras');
    const snapshot = await get(reference);
    const compras: Compra[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        const compra = { id: child.key as string, ...child.val() } as Compra;
        if (compra.mes === mes && compra.ano === ano) {
          compras.push(compra);
        }
      });
    }
    
    return compras;
  },

  async update(id: string, compra: Partial<Compra>) {
    const reference = ref(db, `compras/${id}`);
    await update(reference, compra);
    return { ...compra, id };
  },

  async delete(id: string) {
    const reference = ref(db, `compras/${id}`);
    await remove(reference);
  },
  async getTotalGastosAnoAtual() {
    const anoAtual = new Date().getFullYear();
    const reference = ref(db, 'compras');
    const snapshot = await get(query(reference, orderByChild('ano'), equalTo(anoAtual)));
    let total = 0;
    
    snapshot.forEach((child) => {
      const compra = child.val() as Compra;
      total += compra.valor;
    });
    
    return total;
  },

  async getGastosMesAtual() {
    const anoAtual = new Date().getFullYear();
    const mesAtual = new Date().getMonth() + 1; // getMonth() retorna 0-11
    const reference = ref(db, 'compras');
    const snapshot = await get(query(
      reference, 
      orderByChild('ano'), 
      equalTo(anoAtual)
    ));
    let total = 0;
    
    snapshot.forEach((child) => {
      const compra = child.val() as Compra;
      if (compra.mes === mesAtual) {
        total += compra.valor;
      }
    });
    
    return total;
  },

  async getMediaDiaria() {
    const anoAtual = new Date().getFullYear();
    const mesAtual = new Date().getMonth() + 1;
    const reference = ref(db, 'compras');
    const snapshot = await get(query(
      reference, 
      orderByChild('ano'), 
      equalTo(anoAtual)
    ));
    let totalMes = 0;
    let diasComGastos = new Set();
    
    snapshot.forEach((child) => {
      const compra = child.val() as Compra;
      if (compra.mes === mesAtual) {
        totalMes += compra.valor;
        diasComGastos.add(compra.dia);
      }
    });
    
    const numeroDeDias = diasComGastos.size || 1; // evita divisão por zero
    return totalMes / numeroDeDias;
  }
};