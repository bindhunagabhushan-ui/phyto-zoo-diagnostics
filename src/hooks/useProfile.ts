import { useState, useEffect } from "react";

export interface Profile {
  name: string;
  email: string;
  phone: string;
}

const STORAGE_KEY = "phytozoo-profile";

const defaultProfile: Profile = {
  name: "",
  email: "",
  phone: "",
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load profile:", e);
      }
    }
  }, []);

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
  };

  return { profile, updateProfile };
}
