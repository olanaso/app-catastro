import React, { useState } from 'react';
import { Page, LoginScreenTitle, List, ListInput, ListButton, BlockFooter } from 'framework7-react';
import { useRouter } from 'framework7-react';
import { login } from '../services/api.js';
import { useAppContext } from '../store/AppContext.jsx';

const LoginPage = () => {
  const router = useRouter();
  const { setUser, isOffline } = useAppContext();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!usuario || !password) {
      setError('Ingrese sus credenciales');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isOffline) {
        setUser({ usuario, offline: true });
      } else {
        const data = await login({ usuario, password });
        setUser(data.usuario || { usuario });
      }
      router.navigate('/home');
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page loginScreen>
      <LoginScreenTitle>Ingreso</LoginScreenTitle>
      <List form>
        <ListInput
          label="Usuario"
          type="text"
          placeholder="Ingrese usuario"
          clearButton
          value={usuario}
          onInput={(event) => setUsuario(event.target.value)}
        />
        <ListInput
          label="Contraseña"
          type="password"
          placeholder="Ingrese contraseña"
          clearButton
          value={password}
          onInput={(event) => setPassword(event.target.value)}
        />
      </List>
      <List inset>
        <ListButton onClick={handleSubmit} disabled={loading}>
          {loading ? 'Validando...' : 'Ingresar'}
        </ListButton>
      </List>
      <BlockFooter>
        {error && <p style={{ color: 'var(--f7-color-red)' }}>{error}</p>}
        {isOffline && <p>Se iniciará sesión en modo offline.</p>}
      </BlockFooter>
    </Page>
  );
};

export default LoginPage;
