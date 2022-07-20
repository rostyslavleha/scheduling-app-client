import { makeStyles } from "@material-ui/core";
import { blue } from "@mui/material/colors";

export const useStyles = makeStyles((theme) => {
  return {
    drawerPaper: {
      width: "250px",
      marginTop: "64px",
      [theme.breakpoints.down("xs")]: {
        marginTop: "0px",
        display: "none",
      },
    },

    selectedNav: {
      color: `${blue[800]} !important`,
      fontWeight: "bolder",
      " & div": {
        color: `${blue[800]} !important`,
      },
    },
  };
});
