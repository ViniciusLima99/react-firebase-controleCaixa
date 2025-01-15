import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Atualiza o estado com o usuário autenticado
      } else {
        setUser(null); // Caso o usuário não esteja logado, o estado é null
      }
    });

    return unsubscribe;
  }, []);

  return { user };
};
