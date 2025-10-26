
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Login(){
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation() as any
  const from = loc.state?.from?.pathname || '/'

  async function handleLogin(){
    try{ await login(); nav(from,{replace:true}) }
    catch(e:any){ alert('Gagal login: '+e.message) }
  }

  return (
    <main className="container-page flex flex-col items-center gap-4">
      <h1 className="text-xl font-bold">Masuk untuk melanjutkan</h1>
      <button className="btn" onClick={handleLogin}>🔐 Lanjutkan dengan Google</button>
      <p className="muted text-center max-w-md">Kamu perlu login Google untuk mengakses aplikasi.</p>
    </main>
  )
}
