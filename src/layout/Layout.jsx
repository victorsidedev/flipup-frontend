import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useTheme } from '@mui/material/styles';

const DRAWER_WIDTH = 240;
const BOTTOM_NAV_HEIGHT = 56;
// Below this width, switch from the sidebar to the bottom nav.
const MOBILE_BREAKPOINT = 900;

const navItems = [
  { to: '/overview', label: 'Overview', icon: <DashboardOutlinedIcon /> },
  { to: '/inventory', label: 'Inventory', icon: <Inventory2OutlinedIcon /> },
  { to: '/settings', label: 'Settings', icon: <SettingsOutlinedIcon /> },
];

// Placeholder until user accounts/auth are implemented.
const CURRENT_USER_NAME = 'Victor';

function Layout() {
  const theme = useTheme();
  const { sidebar } = theme.custom;
  const location = useLocation();
  const navigate = useNavigate();
  const activeNav = navItems.find((item) => location.pathname.startsWith(item.to))?.to ?? false;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 0,
          flexShrink: 0,
          display: 'none',
          [`@media (min-width:${MOBILE_BREAKPOINT}px)`]: {
            width: DRAWER_WIDTH,
            display: 'block',
          },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: sidebar.background,
            color: sidebar.text,
            border: 'none',
            padding: '1.5rem 1rem',
            gap: '1.5rem',
          },
        }}
      >
        <Typography sx={{ color: '#fff', fontWeight: 700, px: 1, mb: 2 }}>
          Resale Inventory System
        </Typography>

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, px: 0 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              sx={{
                borderRadius: 1,
                color: sidebar.text,
                '&:hover': { backgroundColor: sidebar.hoverBackground, color: sidebar.activeText },
                '&.active': {
                  backgroundColor: theme.palette.primary.main,
                  color: sidebar.activeText,
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { fontWeight: 600, fontSize: '0.92rem' } }}
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ flex: 1 }} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            px: 1,
            py: 1,
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
          }}
        >
          <AccountCircleOutlinedIcon sx={{ color: sidebar.text }} />
          <Typography sx={{ color: sidebar.activeText, fontWeight: 600, fontSize: '0.92rem' }}>
            {CURRENT_USER_NAME}
          </Typography>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flex: 1,
          p: 2,
          pb: `${BOTTOM_NAV_HEIGHT + 16}px`,
          overflowY: 'auto',
          [`@media (min-width:${MOBILE_BREAKPOINT}px)`]: {
            p: 4,
            pb: 4,
          },
        }}
      >
        <Outlet />
      </Box>

      <Paper
        elevation={0}
        sx={{
          display: 'block',
          [`@media (min-width:${MOBILE_BREAKPOINT}px)`]: { display: 'none' },
          position: 'fixed',
          zIndex: theme.zIndex.appBar,
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: 0,
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          backgroundColor: sidebar.background,
        }}
      >
        <BottomNavigation
          showLabels
          value={activeNav}
          onChange={(_event, value) => navigate(value)}
          sx={{
            height: BOTTOM_NAV_HEIGHT,
            backgroundColor: sidebar.background,
            '& .MuiBottomNavigationAction-root': {
              color: sidebar.text,
              '&.Mui-selected': { color: sidebar.activeText },
            },
          }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.to}
              label={item.label}
              value={item.to}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default Layout;
