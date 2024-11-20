import { useState, useEffect } from 'react';
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
  ListItemSecondaryAction,
  IconButton,
  Box
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Drawer } from '../components/Drawer';
import { limiteService } from '../services/limiteService';
import { Limite } from '../types/interfaces';

export const Limites = () => {
  const [limites, setLimites] = useState<Limite[]>([]);
  const [open, setOpen] = useState(false);
  const [editingLimite, setEditingLimite] = useState<Limite | null>(null);
  const [valor, setValor] = useState('');

  const loadLimites = async () => {
    const data = await limiteService.getAll();
    setLimites(data);
  };

  useEffect(() => {
    loadLimites();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setValor('');
    setEditingLimite(null);
  };

  const handleClose = () => {
    setOpen(false);
    setValor('');
    setEditingLimite(null);
  };

  const handleEdit = (limite: Limite) => {
    setEditingLimite(limite);
    setValor(limite.valor.toString());
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingLimite) {
        await limiteService.update(editingLimite.id, { valor: Number(valor) });
      } else {
        await limiteService.create({ valor: Number(valor) });
      }
      handleClose();
      loadLimites();
    } catch (error) {
      console.error('Erro ao salvar limite:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await limiteService.delete(id);
      loadLimites();
    } catch (error) {
      console.error('Erro ao deletar limite:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer />
      <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Limites</Typography>
            <Button variant="contained" onClick={handleOpen}>
              Novo Limite
            </Button>
          </Box>

          <List>
            {limites.map((limite) => (
              <ListItem key={limite.id}>
                <ListItemText 
                  primary={`R$ ${limite.valor.toFixed(2)}`} 
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEdit(limite)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(limite.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editingLimite ? 'Editar Limite' : 'Novo Limite'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Valor"
              type="number"
              fullWidth
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
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
