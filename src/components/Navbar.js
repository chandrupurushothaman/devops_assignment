import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuIcon from '@mui/icons-material/Menu';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import HomeIcon from '@mui/icons-material/Home';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import { Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import './Navbar.css';
import itLogo from './i&tlogo.png';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const version = "v1.0";

const Navbar = ({ userDetail, onLogout }) => {
  const [state, setState] = React.useState({
    left: false,
  });
  const [anchorEl, setAnchorEl] = React.useState(null); // State for dropdown
  const navigate = useNavigate();

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const handleUsernameClick = (event) => {
    setAnchorEl(event.currentTarget); // Set anchor element for dropdown
  };

  const handleClose = () => {
    setAnchorEl(null); // Close dropdown
  };

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
        background: '#070707',
        color: 'white',
        height: '100%',
        boxShadow: '0 4px 12px rgba(0, 0, 1, 0.5)',
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary={
                <Typography variant="body1" fontWeight="bold" fontSize="1.8rem">
                  TAG YOUR IP
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ backgroundColor: 'white' }}/>

        <ListItem disablePadding className="navbar-item">
          <ListItemButton onClick={() => navigate('/profilehome')}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>

        {userDetail.role === 'Admin' && (
        <>
        <ListItem disablePadding className="navbar-item">
        <ListItemButton onClick={() => navigate('/admin')}>
          <ListItemIcon>
            <AdminPanelSettingsIcon />
          </ListItemIcon>
          <ListItemText primary={"All Active IPs"} />
        </ListItemButton>
      </ListItem>
         <ListItem disablePadding className="navbar-item">
          <ListItemButton onClick={() => navigate('/usermanagement')}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={"Manage Users"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding className="navbar-item">
          <ListItemButton onClick={() => navigate('/userapproval')}>
            <ListItemIcon>
              <PersonAddAltIcon />
            </ListItemIcon>
            <ListItemText primary={"Approval Request"} />
          </ListItemButton>
        </ListItem>
        </>
        )}
        <ListItem disablePadding className="navbar-item">
          <ListItemButton onClick={() => navigate('/iprequest')}>
            <ListItemIcon>
              <CompareArrowsIcon />
            </ListItemIcon>
            <ListItemText primary={"Request Multicast IP"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding className="navbar-item">
          <ListItemButton onClick={() => navigate('/manage')}>
            <ListItemIcon>
              <ManageHistoryIcon />
            </ListItemIcon>
            <ListItemText primary={"My IPs"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding className="navbar-item">
          <ListItemButton onClick={() => navigate('/documentation')}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary={"Documentation"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding className="navbar-item">
          <ListItemButton onClick={handleLogoutClick}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className='Navbar'>
      <MenuIcon
        onClick={toggleDrawer("left", true)}
        className="Menu-icon"
        sx={{ fontSize: '2.0rem' }}
      />
      <Typography variant="h5" component="h1" className="Navbar-title">
      TAG YOUR IP <span className="Navbar-version">{version}</span> <img src={itLogo} alt="Logo" className="Navbar-logo"/>
      </Typography>

      {/* Centered username button container */}
      <div className="username-container">
        {userDetail?.name && (
          <>
            <Button
              className="username-button"
              onClick={handleUsernameClick}
              endIcon={<ArrowDropDownIcon />} // Add arrow down icon
            >
              {userDetail.name}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                style: {
                  right: 0,
                  marginRight: '10px',
                  width: '200px'
                },
              }}
            >
              <MenuItem >Edit Profile</MenuItem>
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </div>

      <Drawer
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
        className="navbar-drawer"
      >
        {list("left")}
      </Drawer>
    </div>
  );
};

export default Navbar;
