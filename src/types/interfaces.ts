export interface Fornecedor {
    id: string;
    nome: string;
}

export interface Limite {
    id: string;
    valor: number; 
}
export interface Compra {
    id: string;
    nome: string;
    valor: number;
    dia: number;
    mes: number;
    ano: number;
    fornecedorId: string;
}