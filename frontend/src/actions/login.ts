import { LOGIN, LOGOUT } from "../constants/actionTypes";
import * as api from "../api";
import * as messages from "../messages";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { NavigateFunction } from "react-router-dom";
import {
  SignupFormData,
  LoginFormData,
  PasswordChangeFormData,
  UserData,
} from "../types/actionTypes";
import { jwtDecode } from "jwt-decode";

export const signup =
  (formData: SignupFormData) =>
  async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    try {
      const { data } = await api.signUp(formData);
      const info = jwtDecode<UserData>(data.token);
      const profile = {
        token: data.token,
        name: info.name,
        email: info.email,
        balance: info.balance,
        winStreak: info.winStreak,
      };
      localStorage.setItem("profile", JSON.stringify(profile));
      dispatch({ type: LOGIN, data });
      messages.success("Login Successful");
    } catch (error: any) {
      messages.error(error.response?.data?.message || "Signup failed");
    }
  };

export const login =
  (formData: LoginFormData) =>
  async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    try {
      const { data } = await api.login(formData);
      const info = jwtDecode<UserData>(data.token);
      const profile = {
        token: data.token,
        name: info.name,
        email: info.email,
        balance: info.balance,
        winStreak: info.winStreak,
      };
      localStorage.setItem("profile", JSON.stringify(profile));
      dispatch({ type: LOGIN, data });
      messages.success("Login Successful");
    } catch (error: any) {
      messages.error(error.response?.data?.message || "Login failed");
    }
  };

export const changePassword =
  (formData: PasswordChangeFormData, history: NavigateFunction) =>
  async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    try {
      const { data } = await api.changePassword(formData);
      dispatch({ type: LOGOUT, data });
      messages.success("Password Change Was Successful");
      history("/");
    } catch (error: any) {
      messages.error(error.response?.data?.message || "Password change failed");
    }
  };
