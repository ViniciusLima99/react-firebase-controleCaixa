import { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { db } from '../firebase'; 
import { useNavigate } from 'react-router-dom'; 
import { auth } from '../firebase'; 
import React, { useEffect } from 'react';

const Home = () => {
  // Estados para o formulário
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');
  const [costDescription, setCostDescription] = useState('');
  const [costAmount, setCostAmount] = useState('');
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(0); 
  const [user, setUser] = useState(null);

  const navigate = useNavigate(); 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); 
      } else {
        setUser(null); 
        navigate('/login')

      }
    });

    return unsubscribe; 
  }, []);

  const handleSaveSale = () => {
    if (!product || !price) {
      setMessage('Preencha todos os campos para a venda');
      return;
    }

    const saleRef = ref(db, 'sales/' + Date.now()); 
    set(saleRef, {
      product,
      price,
      date: new Date().toLocaleString(),
      type: 'sale'
    }).then(() => {
      setMessage('Venda registrada com sucesso!');
      setProduct('');
      setPrice('');
      updateBalance(); 
    }).catch(error => {
      setMessage('Erro ao registrar a venda: ' + error.message);
    });
  };

  const handleSaveCost = () => {
    if (!costDescription || !costAmount) {
      setMessage('Preencha todos os campos para o custo');
      return;
    }

    const costRef = ref(db, 'costs/' + Date.now()); 
    set(costRef, {
      description: costDescription,
      amount: costAmount,
      date: new Date().toLocaleString(),
      type: 'cost'
    }).then(() => {
      setMessage('Custo registrado com sucesso!');
      setCostDescription('');
      setCostAmount('');
      updateBalance();
    }).catch(error => {
      setMessage('Erro ao registrar o custo: ' + error.message);
    });
  };

  // Função para atualizar o saldo
  const updateBalance = () => {
    let totalSales = 0;
    let totalCosts = 0;

    // Busca as vendas
    get(ref(db, 'sales')).then(snapshot => {
      snapshot.forEach(childSnapshot => {
        totalSales += childSnapshot.val().price;
      });

      // Busca os custos
      get(ref(db, 'costs')).then(snapshot => {
        snapshot.forEach(childSnapshot => {
          totalCosts += childSnapshot.val().amount;
        });

        // Calcula o saldo
        setBalance(totalSales - totalCosts);
      }).catch(error => {
        setMessage('Erro ao buscar custos: ' + error.message);
      });
    }).catch(error => {
      setMessage('Erro ao buscar vendas: ' + error.message);
    });
  };

  const handleViewHistory = () => {
    navigate('/history'); 
  };

  return (
    

    <div className="home-container">
  <div className="cash-register">
    <div className="cash-register-container">

      <div className="cash-register-section register1">
        <h3 className="section-title">Entrada de Caixa</h3>
        <div className="form-group">
          <label>Produto:</label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Digite o nome do produto"
          />
        </div>
        <div className="form-group">
          <label>Preço:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Digite o preço do produto"
          />
        </div>
        <button className="primary-button" onClick={handleSaveSale}>
          Registrar Venda
        </button>
      </div>

      <div className="cash-register-section register2">
        <h3 className="section-title">Saída de Caixa</h3>
        <div className="form-group">
          <label>Descrição do Custo:</label>
          <input
            type="text"
            value={costDescription}
            onChange={(e) => setCostDescription(e.target.value)}
            placeholder="Digite a descrição do custo"
          />
        </div>
        <div className="form-group">
          <label>Valor do Custo:</label>
          <input
            type="number"
            value={costAmount}
            onChange={(e) => setCostAmount(e.target.value)}
            placeholder="Digite o valor do custo"
          />
        </div>
        <button className="primary-button" onClick={handleSaveCost}>
          Registrar Custo
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default Home;