'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '@/types/user';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
 children,
}: {
 children: ReactNode;
}) {
 const [user, setUser] = useState<User | null>(null);
 const [loading, setLoading] = useState(true);

 return (
  <UserContext.Provider
   value={{
    user,
    setUser,
    loading,
    setLoading,
  }}
  >
   {children}
  </UserContext.Provider>
 );
}

export function useUser() {
 const context = useContext(UserContext);

 if (!context) {
  throw new Error("useUser must be used inside UserProvider");
 }

 return context;
}