import React, { useState, useEffect } from "react";
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
  Pagination,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { Drawer } from "../components/Drawer";
import { fornecedorService } from "../services/fornecedorService";
import { Fornecedor } from "../types/interfaces";

const PAGE_SIZE = 10;

export const Fornecedores: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [open, setOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(
    null
  );
  const [nome, setNome] = useState("");
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const loadFornecedores = async () => {
    try {
      const { fornecedores, hasNextPage } = await fornecedorService.getPage(
        page,
        PAGE_SIZE
      );
      setFornecedores(fornecedores);
      setHasNextPage(hasNextPage);
      console.log("Fornecedores carregados:", fornecedores);
      console.log("Tem próxima página:", hasNextPage);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    }
  };

  useEffect(() => {
    loadFornecedores();
  }, [page]);

  const handleOpen = () => {
    setOpen(true);
    setNome("");
    setEditingFornecedor(null);
  };

  const handleClose = () => {
    setOpen(false);
    setNome("");
    setEditingFornecedor(null);
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setEditingFornecedor(fornecedor);
    setNome(fornecedor.nome);
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingFornecedor) {
        await fornecedorService.update(editingFornecedor.id, { nome });
      } else {
        await fornecedorService.create({ nome });
      }
      handleClose();
      loadFornecedores();
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fornecedorService.delete(id);
      loadFornecedores();
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
    }
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
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
            <Typography variant="h5">Fornecedores</Typography>
            <Button variant="contained" onClick={handleOpen}>
              Novo Fornecedor
            </Button>
          </Box>

          <List>
            {fornecedores.map((fornecedor) => (
              <ListItem
                key={fornecedor.id}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      onClick={() => handleEdit(fornecedor)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(fornecedor.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText primary={fornecedor.nome} />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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
            {editingFornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome"
              type="text"
              fullWidth
              value={nome}
              onChange={(e) => setNome(e.target.value)}
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
