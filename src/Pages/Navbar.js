import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Usuário logado
      } else {
        setUser(null); // Nenhum usuário logado
      }
    });

    return unsubscribe; // Limpa o listener ao desmontar o componente
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('Logout bem-sucedido!');
        setUser(null); 
        navigate('/login'); 
      })
      .catch((error) => {
        console.error('Erro ao fazer logout:', error.message);
      });
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/path-to-your-logo.png" alt="Logo" />
      </div>
      <ul className="navbar-links">
        <li><Link to="/dados">Dados</Link></li>
        <li><Link to="/transacoes">Transações</Link></li>
        <li><Link to="/history">Histórico</Link></li>

        {user ? (
          <li>
            <h5 className='botaoLogout' onClick={handleLogout}>Logout</h5>
          </li>
        ) : (
          <li><Link to="/login"><h5 className='botaoLogin'>Login</h5></Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
