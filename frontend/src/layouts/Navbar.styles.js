import { styled } from '@mui/material/styles';
import { 
  Box, 
  Container, 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem 
} from '@mui/material';

export const TopBar = styled(Box)({
  backgroundColor: '#0d47a1',
  color: 'white',
  padding: '8px 0',
  display: { xs: 'none', md: 'block' }
});

export const TopBarContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'flex-end'
});

export const TopBarContent = styled(Box)({
  display: 'flex',
  alignItems: 'center'
});

export const StyledAppBar = styled(AppBar)({
  backgroundColor: 'white',
  color: '#333',
  boxShadow: 'none',
  position: 'sticky'
});

export const ToolbarContainer = styled(Toolbar)({
  minHeight: 80,
  justifyContent: 'space-between',
  padding: '0 !important'
});

export const LogoContainer = styled(Box)({
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center'
});

export const LogoImage = styled('img')({
  height: 50,
  marginRight: 8
});

export const DesktopMenu = styled(Box)(({ theme }) => ({
  display: { xs: 'none', md: 'flex' },
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

export const NavButton = styled(Button)({
  color: '#333',
  textTransform: 'uppercase',
  fontWeight: 600,
  fontSize: '0.9rem',
  margin: '0 8px',
  '&:hover': {
    color: '#0d47a1',
    backgroundColor: 'transparent'
  }
});

export const AppointmentButton = styled(Button)({
  marginLeft: 24,
  backgroundColor: '#e53935',
  color: 'white',
  borderRadius: 0,
  padding: '8px 32px',
  fontWeight: 600,
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: '#c62828',
  }
});

export const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  display: { md: 'none' },
  color: '#333',
  [theme.breakpoints.up('md')]: {
    display: 'none'
  }
}));

export const MobileMenu = styled(Box)(({ theme }) => ({
  display: { xs: 'block', md: 'none' },
  padding: '16px 0',
  backgroundColor: 'white',
  boxShadow: 1
}));

export const MobileMenuItem = styled(Button)({
  color: '#333',
  textTransform: 'uppercase',
  width: '100%',
  justifyContent: 'flex-start',
  padding: '12px 24px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  }
});

export const UserMenu = styled(Menu)({
  '& .MuiPaper-root': {
    minWidth: 180,
    marginTop: 8,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
});

export const UserMenuItem = styled(MenuItem)({
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: 'rgba(13, 71, 161, 0.08)'
  }
});
