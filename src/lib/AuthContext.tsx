
import React from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth'
import { auth, provider } from './firebase'

type Ctx = { user: User | null; loading: boolean; login: () => Promise<void>; logout: () => Promise<void> }
const AuthCtx = React.createContext<Ctx>({user:null,loading:true,login:async()=>{},logout:async()=>{}})

export function AuthProvider({ children }:{ children: React.ReactNode }){
  const [user, setUser] = React.useState<User|null>(null)
  const [loading, setLoading] = React.useState(true)
  React.useEffect(()=> onAuthStateChanged(auth, u=>{ setUser(u); setLoading(false) }), [])
  const login = async ()=>{ await signInWithPopup(auth, provider) }
  const logout = async ()=>{ await signOut(auth) }
  return <AuthCtx.Provider value={{ user, loading, login, logout }}>{children}</AuthCtx.Provider>
}
export const useAuth = ()=> React.useContext(AuthCtx)
