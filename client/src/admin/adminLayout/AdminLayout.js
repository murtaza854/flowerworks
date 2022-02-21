import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AppBar, Drawer, DrawerHeader } from './layoutHelpers';
import Database from '../database/Database';
import { Link } from 'react-router-dom';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import { Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import HeightIcon from '@mui/icons-material/Height';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import api from '../../api';


export default function AdminLayout() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [linkDisableObject, setLinkDisableObject] = React.useState({
        'dashboard': false,
        'user': false,
        'order': false,
        'product': false,
        'category': false,
        'coupon': false,
        'promotionCode': false,
        'flower': false,
        'color': false,
        'size': false,
        'addon': false,
        'subscribe': false,
        'subscribedUser': false,
    });

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleLinkDisable = (e, link) => {
        if (linkDisableObject[link]) {
            e.preventDefault();
            return;
        }
    }

    const handleLogout = async _ => {
        await fetch(`${api}/user/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
        });
        window.location.reload();
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Flowerworks Admin
                    </Typography>
                    <Tooltip title="Logout">
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleLogout}
                            color="secondary"
                        >
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <List>
                    <Link onClick={e => handleLinkDisable(e, 'dashboard')} style={{ color: 'black', textDecoration: 'none' }} to="/admin">
                        <Tooltip title="Dashboard" placement="right">
                            <ListItem disabled={linkDisableObject.dashboard} button>
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>
                        </Tooltip>
                    </Link>
                </List>
                <Divider />
                <List>
                    <Link onClick={e => handleLinkDisable(e, 'user')} style={{ color: 'black', textDecoration: 'none' }} to="/admin/user">
                        <Tooltip title="Users" placement="right">
                            <ListItem disabled={linkDisableObject.user} button>
                                <ListItemIcon>
                                    <SupervisorAccountIcon />
                                </ListItemIcon>
                                <ListItemText primary="Users" />
                            </ListItem>
                        </Tooltip>
                    </Link>
                </List>
                <Divider />
                <List>
                    <Link onClick={e => handleLinkDisable(e, 'order')} style={{ color: 'black', textDecoration: 'none' }} to="/admin/order">
                        <Tooltip title="Orders" placement="right">
                            <ListItem disabled={linkDisableObject.order} button>
                                <ListItemIcon>
                                    <ReceiptIcon />
                                </ListItemIcon>
                                <ListItemText primary="Orders" />
                            </ListItem>
                        </Tooltip>
                    </Link>
                </List>
                <Divider />
                <List>
                    <Link onClick={e => handleLinkDisable(e, 'product')} style={{ color: 'black', textDecoration: 'none' }} to="/admin/product">
                        <Tooltip title="Products" placement="right">
                            <ListItem disabled={linkDisableObject.product} button>
                                <ListItemIcon>
                                    <LocalFloristIcon />
                                </ListItemIcon>
                                <ListItemText primary="Products" />
                            </ListItem>
                        </Tooltip>
                    </Link>
                    <Link onClick={e => handleLinkDisable(e, 'category')} style={{ color: 'black', textDecoration: 'none' }} to="/admin/base">
                        <Tooltip title="Bases" placement="right">
                            <ListItem disabled={linkDisableObject.category} button>
                                <ListItemIcon>
                                    <CheckBoxOutlineBlankIcon />
                                </ListItemIcon>
                                <ListItemText primary="Bases" />
                            </ListItem>
                        </Tooltip>
                    </Link>
                    <Link onClick={e => handleLinkDisable(e, 'addon')} style={{ color: 'black', textDecoration: 'none' }} to="/admin/addon">
                        <Tooltip title="Addons" placement="right">
                            <ListItem disabled={linkDisableObject.addon} button>
                                <ListItemIcon>
                                    <PlusOneIcon />
                                </ListItemIcon>
                                <ListItemText primary="Addons" />
                            </ListItem>
                        </Tooltip>
                    </Link>
                    <Link onClick={e => handleLinkDisable(e, 'flower')} style={{ color: 'black', textDecoration: 'none' }} to="/admin/flower">
                        <Tooltip title="Flowers" placement="right">
                            <ListItem disabled={linkDisableObject.flower} button>
                                <ListItemIcon>
                                    <FilterVintageIcon />
                                </ListItemIcon>
                                <ListItemText primary="Flowers" />
                            </ListItem>
                        </Tooltip>
                    </Link>
                    <Link onClick={e => handleLinkDisable(e, 'color')} style={{ color: 'black', textDecoration: 'none' }} to="/admin/color">
                        <Tooltip title="Colors" placement="right">
                            <ListItem disabled={linkDisableObject.color} button>
                                <ListItemIcon>
                                    <ColorLensIcon />
                                </ListItemIcon>
                                <ListItemText primary="Colors" />
                            </ListItem>
                        </Tooltip>
                    </Link>
                    <Link onClick={e => handleLinkDisable(e, 'size')} style={{ color: 'black', textDecoration: 'none' }} to="/admin/size">
                        <Tooltip title="Sizes" placement="right">
                            <ListItem disabled={linkDisableObject.size} button>
                                <ListItemIcon>
                                    <HeightIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sizes" />
                            </ListItem>
                        </Tooltip>
                    </Link>
                </List>
                <Divider />
                <List>
                    <Link onClick={e => handleLinkDisable(e, 'coupon')} style={{ color: 'black', textDecoration: 'none' }} to="/admin/coupon">
                        <Tooltip title="Coupons" placement="right">
                            <ListItem disabled={linkDisableObject.coupon} button>
                                <ListItemIcon>
                                    <LocalOfferIcon />
                                </ListItemIcon>
                                <ListItemText primary="Coupons" />
                            </ListItem>
                        </Tooltip>
                    </Link>
                    {/* <Link onClick={e => handleLinkDisable(e, 'promotionCode')} style={{ color: 'black', textDecoration: 'none' }} to="/admin/promotion-code">
                        <Tooltip title="Promotion Codes" placement="right">
                            <ListItem disabled={linkDisableObject.promotionCode} button>
                                <ListItemIcon>
                                    <MoneyOffIcon />
                                </ListItemIcon>
                                <ListItemText primary="Promotion Codes" />
                            </ListItem>
                        </Tooltip>
                    </Link> */}
                </List>
                <Divider />
                <List>
                    <Link onClick={e => handleLinkDisable(e, 'subscribe')} style={{ color: 'black', textDecoration: 'none' }} to="/admin/subscribe">
                        <Tooltip title="Subscribe Packages" placement="right">
                            <ListItem disabled={linkDisableObject.subscribe} button>
                                <ListItemIcon>
                                    <SubscriptionsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Subscribe Packages" />
                            </ListItem>
                        </Tooltip>
                    </Link>
                    <Link onClick={e => handleLinkDisable(e, 'subscribedUser')} style={{ color: 'black', textDecoration: 'none' }} to="/admin/subscribed-user">
                        <Tooltip title="Subscribed Users" placement="right">
                            <ListItem disabled={linkDisableObject.subscribedUser} button>
                                <ListItemIcon>
                                    <CardMembershipIcon />
                                </ListItemIcon>
                                <ListItemText primary="Subscribed Users" />
                            </ListItem>
                        </Tooltip>
                    </Link>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <div className="margin-global-top-6" />
                <Database
                    linkDisableObject={linkDisableObject}
                    setLinkDisableObject={setLinkDisableObject}
                />
            </Box>
        </Box>
    );
}