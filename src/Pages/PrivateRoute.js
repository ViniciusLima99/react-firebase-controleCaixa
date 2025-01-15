import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth'; 
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); 
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado, caso contrário redireciona
  useEffect(() => {
    if (user) {
      navigate('/dados'); 
    }
  }, [user, navigate]);

  return !user ? children : <Navigate to="/dados" />;
};

export default PrivateRoute;
