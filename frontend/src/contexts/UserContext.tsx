import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useContext } from "react";
import { UserData } from "../types/actionTypes";

export interface Profile {
  token: string;
  name: string;
  email: string;
  balance: number;
  winStreak: number;
}

interface UserContextValue {
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const raw = localStorage.getItem("profile");
  let initial: Profile | null = null;
  if (raw) {
    const parsed = JSON.parse(raw);

    if (parsed.token && parsed.balance == null) {
      const info = jwtDecode<UserData>(parsed.token);
      initial = {
        token: parsed.token,
        name: info.name,
        email: info.email,
        balance: info.balance,
        winStreak: info.winStreak,
      };
      localStorage.setItem("profile", JSON.stringify(initial));
    } else {
      initial = parsed as Profile;
    }
  }

  const [profile, setProfile] = useState<Profile | null>(initial);

  return (
    <UserContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
};
