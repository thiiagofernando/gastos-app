import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { Drawer } from '../components/Drawer';
import { compraService } from '../services/compraService';

export const Home = () => {
  const [totalAno, setTotalAno] = useState<number | null>(null);
  const [totalMes, setTotalMes] = useState<number | null>(null);
  const [mediaDiaria, setMediaDiaria] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [anoTotal, mesTotal, diaria] = await Promise.all([
        compraService.getTotalGastosAnoAtual(),
        compraService.getGastosMesAtual(),
        compraService.getMediaDiaria()
      ]);

      setTotalAno(anoTotal);
      setTotalMes(mesTotal);
      setMediaDiaria(diaria);
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer />
      <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total de Gastos do Ano Atual
                </Typography>
                <Typography variant="h5">
                  {totalAno !== null ? `R$ ${totalAno.toFixed(2)}` : <CircularProgress size={20} />}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Gastos do Mês Atual
                </Typography>
                <Typography variant="h5">
                  {totalMes !== null ? `R$ ${totalMes.toFixed(2)}` : <CircularProgress size={20} />}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total de Gastos no Dia
                </Typography>
                <Typography variant="h5">
                  {mediaDiaria !== null ? `R$ ${mediaDiaria.toFixed(2)}` : <CircularProgress size={20} />}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
