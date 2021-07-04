import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router';
import { useHistory } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import {
  Link,
} from "react-router-dom";

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
        flex: '1 1 100%',
    },
}));


function EnhancedTableToolbar(props) {
    const { model } = useParams();
    const classes = useToolbarStyles();
    const { selected, modelName, editAllowed, deleteAllowed, addAllowed } = props;
    const history = useHistory();
    const numSelected = selected.length;

    let editID = '';
    if (selected.length === 1) editID = selected[0];

    function handleRouteChange() {
      history.push(`/admin/${model}/add`);
    }
  
    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography style={{textTransform: 'capitalize'}} className={classes.title} variant="h6" id="tableTitle" component="div">
            {modelName}
          </Typography>
        )}
  
        {numSelected > 0 ? (
          <div style={{display: 'flex'}}>
          {deleteAllowed === true ? (
            <Link to={{
              pathname: `/admin/${model}/delete`,
              state: {selected: selected, modelName: modelName}
            }}>
              <Tooltip title="Delete">
                <IconButton aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Link>
          ) : null}
            {numSelected === 1 && editAllowed ? (
              <Link to={`/admin/${model}/edit/${editID}`}>
                <Tooltip title="Edit">
                  <IconButton aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Link>
            ) : null
          }
          </div>
        ) : (
          <div>
            {addAllowed === true ? (
              <Tooltip onClick={handleRouteChange} title="Add">
                <IconButton aria-label="Add button">
                  <AddIcon />
                </IconButton>
              </Tooltip>
            ) : null}
          </div>
        )}
      </Toolbar>
    );
  }

export default EnhancedTableToolbar;