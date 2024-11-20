import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  MenuItem,
  Grid,
  Pagination
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Drawer } from '../components/Drawer';
import { compraService } from '../services/compraService';
import { fornecedorService } from '../services/fornecedorService';
import { Compra, Fornecedor } from '../types/interfaces';

const PAGE_SIZE = 10;

export const Compras: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCompra, setEditingCompra] = useState<Compra | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    fornecedorId: '',
    dia: new Date().getDate(),
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear()
  });
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const loadCompras = async () => {
    try {
      const { compras, hasNextPage } = await compraService.getPage(page, PAGE_SIZE);
      setCompras(compras);
      setHasNextPage(hasNextPage);
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
    }
  };

  const loadFornecedores = async () => {
    try {
      const data = await fornecedorService.getAll();
      setFornecedores(data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    }
  };

  useEffect(() => {
    loadCompras();
    loadFornecedores();
  }, [page]);

  const handleOpen = () => {
    setOpen(true);
    setEditingCompra(null);
    setFormData({
      nome: "",
      valor: "",
      fornecedorId: "",
      dia: new Date().getDate(),
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear(),
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (compra: Compra) => {
    setEditingCompra(compra);
    setFormData({
      nome: compra.nome,
      valor: compra.valor.toString(),
      fornecedorId: compra.fornecedorId,
      dia: compra.dia,
      mes: compra.mes,
      ano: compra.ano,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const compraData = {
        ...formData,
        valor: Number(formData.valor),
        dia: Number(formData.dia),
        mes: Number(formData.mes),
        ano: Number(formData.ano),
      };

      if (editingCompra) {
        await compraService.update(editingCompra.id, compraData);
      } else {
        await compraService.create(compraData);
      }
      handleClose();
      loadCompras();
    } catch (error) {
      console.error("Erro ao salvar compra:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await compraService.delete(id);
      loadCompras();
    } catch (error) {
      console.error("Erro ao deletar compra:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    event.stopPropagation();    
    setPage(value - 1);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer />
      <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">Compras</Typography>
            <Button variant="contained" onClick={handleOpen}>
              Nova Compra
            </Button>
          </Box>

          <List>
          {compras.map((compra) => (
              <ListItem
                key={compra.id}
                secondaryAction={
                  <Box>
                    <IconButton edge="end" onClick={() => handleEdit(compra)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(compra.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText 
                  primary={compra.nome} 
                  secondary={`R$ ${compra.valor.toFixed(2)} - ${compra.dia}/${compra.mes}/${compra.ano}`} 
                />
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={hasNextPage ? page + 2 : page + 1}
              page={page + 1}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </Paper>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editingCompra ? "Editar Compra" : "Nova Compra"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="nome"
                  label="Nome"
                  type="text"
                  fullWidth
                  value={formData.nome}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="valor"
                  label="Valor"
                  type="number"
                  fullWidth
                  value={formData.valor}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  margin="dense"
                  name="fornecedorId"
                  label="Fornecedor"
                  fullWidth
                  value={formData.fornecedorId}
                  onChange={handleChange}
                >
                  {fornecedores.map((fornecedor) => (
                    <MenuItem key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  name="dia"
                  label="Dia"
                  type="number"
                  fullWidth
                  value={formData.dia}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  name="mes"
                  label="Mês"
                  type="number"
                  fullWidth
                  value={formData.mes}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  name="ano"
                  label="Ano"
                  type="number"
                  fullWidth
                  value={formData.ano}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};
