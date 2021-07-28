import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import './Sidebar.scss';

const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

function Sidebar(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        right: false,
    });
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={classes.root}
            >
                <ListItem disableRipple={true} button>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem disableRipple={true} button onClick={handleClick}>
                    <ListItemText primary="Shop" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button className={classes.nested}>
                            <ListItemText primary="Starred" />
                        </ListItem>
                        <ListItem button className={classes.nested}>
                            <ListItemText primary="Starred" />
                        </ListItem>
                    </List>
                </Collapse>
                <ListItem disableRipple={true} button>
                    <ListItemText primary="DIY" />
                </ListItem>
                <ListItem disableRipple={true} button>
                    <ListItemText primary="Contact Us" />
                </ListItem>
            </List>
        </div>
    );
    return (
        <div className="sidebar unhide-991">
            <React.Fragment>
                <div className="hamburger-icon" onClick={toggleDrawer("right", true)}><i className="fa fa-bars"></i></div>
                <SwipeableDrawer
                    className="unhide-991"
                    anchor={"right"}
                    open={state["right"]}
                    onClose={toggleDrawer("right", false)}
                    onOpen={toggleDrawer("right", true)}
                >
                    {list("right")}
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    );
}

export default Sidebar;