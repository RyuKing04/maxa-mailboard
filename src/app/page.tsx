'use client';

import { FormEvent, useState } from 'react';

export default function HomePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Error al crear usuario');
        return;
      }

      setMessage(`Usuario creado: ${data.email}`);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
      setMessage('Error de red o del servidor');
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          padding: 24,
          border: '1px solid #333',
          borderRadius: 12,
        }}
      >
        <h1 style={{ marginBottom: 16 }}>Registro de usuario (test)</h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <label>
            Nombre
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </label>

          <label>
            Correo
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </label>

          <button
            type="submit"
            style={{ marginTop: 12, padding: 10, fontWeight: 600 }}
          >
            Crear usuario
          </button>
        </form>

        {message && <p style={{ marginTop: 16 }}>{message}</p>}
      </div>
    </main>
  );
}
