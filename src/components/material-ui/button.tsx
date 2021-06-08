import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
    }),
);

export default function FloatingActionButtons() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {/* <Fab color="primary" aria-label="add">
                <AddIcon />
            </Fab> */}
            <Fab color="primary" aria-label="add">
                <RemoveIcon />
            </Fab>
        </div>
    );
}
