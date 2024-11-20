import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography,
  Box,
  styled
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const BackgroundContainer = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url(${'https://wallpapers.com/downloads/high/finance-graph-report-on-table-70832yape6vhj7ws.webp'})`, // Substitua pelo caminho correto da sua imagem
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
});

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '400px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fundo semi-transparente
  backdropFilter: 'blur(5px)', // Efeito de blur no fundo
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
}));

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      setError('Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <BackgroundContainer>
      <Container maxWidth="xs" sx={{ m: 0 }}>
        <LoginPaper elevation={6}>
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            sx={{ 
              mb: 4,
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Sistema de Gastos
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 1
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 1
              }}
            />
            {error && (
              <Typography 
                color="error" 
                align="center" 
                sx={{ mt: 2 }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              Entrar
            </Button>
          </Box>
        </LoginPaper>
      </Container>
    </BackgroundContainer>
  );
};
