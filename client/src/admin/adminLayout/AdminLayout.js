import React from 'react';
import clsx from 'clsx';
import { Drawer, AppBar, Toolbar, List, CssBaseline, Typography, Divider, IconButton, Menu, ListItem, ListItemIcon, ListItemText, MenuItem, makeStyles, useTheme } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MoreIcon from '@material-ui/icons/MoreVert';
import WebIcon from '@material-ui/icons/Web';
import LockIcon from '@material-ui/icons/Lock';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
// import AssignmentIcon from '@material-ui/icons/Assignment';
// import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
// import BlockIcon from '@material-ui/icons/Block';
// import BusinessIcon from '@material-ui/icons/Business';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import Switch from "@material-ui/core/Switch";
import { EnhancedTable, AdminForm, DeleteConfirmation } from '../../admin'
import {
  // BrowserRouter as Router,
  Switch as RouterSwitch,
  Link,
  Route,
} from "react-router-dom";
import api from '../../api';
import './AdminLayout.scss';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
      flexGrow: 1
  },
  listItemIcon: {
    //   minWidth: 40,
    paddingLeft: 10
  }
}));


function AdminLayout(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    let color = 'white';
    if (!props.darkState) color = 'black';

    const handleThemeChange = async () => {
      // console.log(!props.darkState)
      props.setDarkState(!props.darkState);
      // console.log(props.darkState)
      // await fetch('http://localhost:4000/api/set-darktheme', {
      //   method: 'POST',
      //   headers: {'Content-Type': 'application/json'},
      //   credentials: 'include',
      //   withCredentials: true,
      //   body: JSON.stringify({darkState:!props.darkState})
      // }); 
    };

    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleDrawerOpen = () => {
      setOpenDrawer(true);
    };
  
    const handleDrawerClose = () => {
      setOpenDrawer(false);
    };

    const handleLogout = async e => {
      // console.log(123);
      e.preventDefault();
      await fetch(`${api}/users/logout`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        withCredentials: true,
      });
      props.setToken(false);
    }

    return (
    // <ThemeProvider theme={darkTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: openDrawer,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: openDrawer,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title} noWrap>
              Flowerworks Admin
            </Typography>
                  <Switch checked={props.darkState} onChange={handleThemeChange} />
                  <IconButton
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                  >
                      <MoreIcon />
                  </IconButton>
                  <Menu
                      // className={classes.root}
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                      }}
                      open={openMenu}
                      onClose={handleClose}
                  >
                      <MenuItem onClick={_ => window.location.pathname = '/'}>
                          <ListItemIcon className={classes.listItemIcon}>
                              <WebIcon fontSize="small" />
                          </ListItemIcon>
                          <Typography variant="body2">Go to website</Typography>
                      </MenuItem>
                      <MenuItem>
                          <ListItemIcon className={classes.listItemIcon}>
                              <LockIcon fontSize="small" />
                          </ListItemIcon>
                          <Typography variant="body2">Change password</Typography>
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                          <ListItemIcon className={classes.listItemIcon}>
                              <ExitToAppIcon fontSize="small" />
                          </ListItemIcon>
                          <Typography variant="body2">Logout</Typography>
                      </MenuItem>
                  </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: openDrawer,
              [classes.drawerClose]: !openDrawer,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
              <Link style={{color: color}} to={'/admin'}>
                <ListItem button key='Dashboard'>
                    <ListItemIcon className={classes.listItemIcon}><DashboardIcon /></ListItemIcon>
                    <ListItemText primary='Dashboard'/>
                </ListItem>
              </Link>
              <Link style={{color: color}} to={'/admin/users'}>
                <ListItem button key='Users'>
                    <ListItemIcon className={classes.listItemIcon}><SupervisorAccountIcon /></ListItemIcon>
                    <ListItemText primary='Users'/>
                </ListItem>
              </Link>
              <Link style={{color: color}} to={'/admin/products'}>
                <ListItem button key='products'>
                    <ListItemIcon className={classes.listItemIcon}><AccountTreeIcon /></ListItemIcon>
                    <ListItemText primary='Products'/>
                </ListItem>
              </Link>
              <Link style={{color: color}} to={'/admin/addons'}>
                <ListItem button key='addons'>
                    <ListItemIcon className={classes.listItemIcon}><AccountTreeIcon /></ListItemIcon>
                    <ListItemText primary='Addons'/>
                </ListItem>
              </Link>
              <Link style={{color: color}} to={'/admin/colors'}>
                <ListItem button key='colors'>
                    <ListItemIcon className={classes.listItemIcon}><AccountTreeIcon /></ListItemIcon>
                    <ListItemText primary='Colors'/>
                </ListItem>
              </Link>
              <Link style={{color: color}} to={'/admin/flowers'}>
                <ListItem button key='flowers'>
                    <ListItemIcon className={classes.listItemIcon}><AccountTreeIcon /></ListItemIcon>
                    <ListItemText primary='Flowers'/>
                </ListItem>
              </Link>
              <Link style={{color: color}} to={'/admin/sizes'}>
                <ListItem button key='sizes'>
                    <ListItemIcon className={classes.listItemIcon}><AccountTreeIcon /></ListItemIcon>
                    <ListItemText primary='Sizes'/>
                </ListItem>
              </Link>
              <Link style={{color: color}} to={'/admin/bases'}>
                <ListItem button key='bases'>
                    <ListItemIcon className={classes.listItemIcon}><PhotoLibraryIcon /></ListItemIcon>
                    <ListItemText primary='Base'/>
                </ListItem>
              </Link>
              <Link style={{color: color}} to={'/admin/areas'}>
                <ListItem button key='bases'>
                    <ListItemIcon className={classes.listItemIcon}><PhotoLibraryIcon /></ListItemIcon>
                    <ListItemText primary='Area'/>
                </ListItem>
              </Link>
          </List>
          <Divider />
          {/* <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List> */}
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {/* <Router> */}
          {/* <TransitionGroup>
            <CSSTransition
              key={location.key}
              classNames="fade"
              timeout={300}
            > */}
              <RouterSwitch>
              {/* <Route path="/admin/newsletter/add" children={<Newsletter />} /> */}
                <Route path="/admin/:model/edit/:id" children={<AdminForm />} />
                <Route path="/admin/:model/add" children={<AdminForm />} />
                <Route path="/admin/:model/delete" children={<DeleteConfirmation />} />
                <Route path="/admin/:model" children={<EnhancedTable />} />
              </RouterSwitch>
            {/* </CSSTransition>
          </TransitionGroup> */}
          {/* </Router> */}
        </main>
      </div>
    // </ThemeProvider>
  );
}

export default AdminLayout;