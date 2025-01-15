import React, { useState, useEffect } from 'react';
import { setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Atualiza o estado do usuário
        console.log('está logado')
      } else {
        setUser(null); // Usuário não logado
      }
    });

    return unsubscribe; // Limpa o listener ao desmontar o componente
  }, []);

  const handleLogin = (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    console.log('Formulário enviado');
    
    console.log('Tentando definir persistência...');
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Persistência configurada com sucesso');
        console.log('Tentando fazer login com:', email, password);
        
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        console.log('Login bem-sucedido! Credenciais do usuário:', userCredential);
        console.log('Usuário logado:', userCredential.user);
        setError(''); 
      })
      .catch((error) => {
        console.error('Erro ao logar:', error.message);
        setError(error.message); 
      });
  };

  return (
<div className="containerX">
  {user ? (
    navigate('/')
  ) : (
    <div className="login-form">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )}
</div>
  );
};

export default Login;
