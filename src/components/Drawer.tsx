import {
    Drawer as MuiDrawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
    styled,
    Box,
    Typography,
    AppBar,
    Toolbar
  } from '@mui/material';
  import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Business as BusinessIcon,
    AttachMoney as AttachMoneyIcon,
    ShoppingCart as ShoppingCartIcon,
    ExitToApp as LogoutIcon
  } from '@mui/icons-material';
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useAuth } from '../contexts/AuthContext';
  
  const drawerWidth = 280;
  
  const StyledDrawer = styled(MuiDrawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      borderRight: 'none',
      boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
    },
    '& .MuiListItemIcon-root': {
      color: '#fff',
      minWidth: '40px'
    },
    '& .MuiListItemButton-root': {
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
      padding: theme.spacing(2),
    },
    '& .MuiDivider-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      margin: theme.spacing(1, 2),
    }
  }));
  
  const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: '#fff',
    color: theme.palette.primary.main,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }));
  
  const MenuButton = styled(IconButton)(({ theme }) => ({
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
  }));
  
  export const Drawer = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { signOut, user } = useAuth();
  
    const handleDrawerToggle = () => {
      setOpen(!open);
    };
  
    const handleNavigation = (path: string) => {
      navigate(path);
      setOpen(false);
    };
  
    const handleLogout = async () => {
      await signOut();
      navigate('/login');
    };
  
    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Fornecedores', icon: <BusinessIcon />, path: '/fornecedores' },
        { text: 'Limites', icon: <AttachMoneyIcon />, path: '/limites' },
        { text: 'Compras', icon: <ShoppingCartIcon />, path: '/compras' },
      ];
  
    return (
      <>
        <StyledAppBar position="fixed">
          <Toolbar>
            <MenuButton
              edge="start"
              onClick={handleDrawerToggle}
              aria-label="menu"
            >
              <MenuIcon />
            </MenuButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sistema de Gastos
            </Typography>
            {user && (
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            )}
          </Toolbar>
        </StyledAppBar>
        <StyledDrawer
          anchor="left"
          open={open}
          onClose={handleDrawerToggle}
          variant="temporary"
        >
          <Box sx={{ pt: 2, pb: 2 }}>
            <Typography 
              variant="h6" 
              align="center" 
              sx={{ 
                mb: 2,
                color: '#fff',
                fontWeight: 'bold'
              }}
            >
              Menu
            </Typography>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton 
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: '0 50px 50px 0',
                      margin: '4px 16px 4px 0',
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '1rem',
                        fontWeight: 'medium'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider />
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={handleLogout}
                  sx={{
                    borderRadius: '0 50px 50px 0',
                    margin: '4px 16px 4px 0',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <ListItemIcon><LogoutIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Sair"
                    primaryTypographyProps={{
                      fontSize: '1rem',
                      fontWeight: 'medium'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </StyledDrawer>
        <Toolbar /> {/* Espaçamento para o conteúdo não ficar sob a AppBar */}
      </>
    );
  };
  