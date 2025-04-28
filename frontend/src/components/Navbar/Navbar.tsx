import React from "react";
import { AppBar, Typography, Toolbar, Avatar, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import * as actionType from "../../constants/actionTypes";
import { styles } from "./styles";
import { UserData } from "../../types/actionTypes";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useUser } from "../../contexts/UserContext";

const Navbar: React.FC = () => {
  const { profile, setProfile } = useUser();
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const history = useNavigate();

  const userData: UserData | null = profile
    ? jwtDecode<UserData>(profile.token)
    : null;

  const logout = () => {
    localStorage.removeItem("profile");
    setProfile(null);
    dispatch({ type: actionType.LOGOUT });
    history("/auth");
  };

  return (
    <AppBar sx={styles.appBar} position="static" color="inherit">
      <div style={styles.brandContainer}>
        <Typography
          component={Link}
          to="/"
          sx={styles.heading}
          variant="h5"
          align="center"
        >
          CoinToss
        </Typography>
      </div>
      <Toolbar sx={styles.toolbar}>
        {profile && userData ? (
          <div style={styles.profile}>
            <Avatar
              sx={styles.purple}
              alt={userData.name}
              src={userData.picture}
            >
              {userData.name.charAt(0)}
            </Avatar>
            <Typography sx={styles.userName} variant="h6">
              {userData.name}
            </Typography>
            <Typography sx={styles.userName} variant="h6">
              Balance:
              {profile.balance == null ? userData.balance : profile.balance}$
            </Typography>
            <Button
              variant="contained"
              sx={styles.logout}
              color="secondary"
              onClick={logout}
            >
              Logout
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                history("/password");
              }}
            >
              Set Password
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
