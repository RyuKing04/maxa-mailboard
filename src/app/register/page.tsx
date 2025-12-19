'use client';

import { FormEvent, useState } from 'react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al crear usuario');
        return;
      }

      setMessage(`Usuario creado correctamente: ${data.email}`);
      setName('');
      setEmail('');
      setPassword('');
    } catch {
      setError('Error de red o del servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0f0f0f',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          padding: 28,
          borderRadius: 14,
          border: '1px solid #2a2a2a',
          background: '#111',
        }}
      >
        <h1 style={{ marginBottom: 8, fontSize: 22 }}>
          Registro de usuario
        </h1>
        <p style={{ marginBottom: 20, color: '#aaa', fontSize: 14 }}>
          Formulario de prueba (API /create-user)
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <Field
            label="Nombre"
            value={name}
            onChange={setName}
            type="text"
          />

          <Field
            label="Correo"
            value={email}
            onChange={setEmail}
            type="email"
          />

          <Field
            label="Contraseña"
            value={password}
            onChange={setPassword}
            type="password"
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 10,
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid #333',
              background: loading ? '#1a1a1a' : '#161616',
              color: '#fff',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creando usuario...' : 'Crear usuario'}
          </button>
        </form>

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 10,
              border: '1px solid #5c1e1e',
              background: '#1a0f0f',
              color: '#ffb4b4',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 10,
              border: '1px solid #1e5c2c',
              background: '#0f1a12',
              color: '#a6f4c5',
              fontSize: 14,
            }}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------- Helper Input ---------- */

function Field({
  label,
  value,
  onChange,
  type,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13, color: '#ccc' }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        style={{
          padding: '10px 12px',
          borderRadius: 10,
          border: '1px solid #333',
          background: '#0e0e0e',
          color: '#fff',
          outline: 'none',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#555')}
        onBlur={(e) => (e.target.style.borderColor = '#333')}
      />
    </label>
  );
}
