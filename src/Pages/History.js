import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [sales, setSales] = useState([]);
  const [costs, setCosts] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchName, setSearchName] = useState(''); // Filtro por nome
  const [filteredSales, setFilteredSales] = useState([]);
  const [filteredCosts, setFilteredCosts] = useState([]);
  const navigate = useNavigate();

  const auth = getAuth();

  useEffect(() => {
    // Verificando se o usuário está logado
    const user = auth.currentUser;
    if (!user) {
      navigate('/login')
    } 

    // Buscar vendas
    get(ref(db, 'sales')).then(snapshot => {
      let salesData = [];
      if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
          salesData.push(childSnapshot.val());
        });
        setSales(salesData);
      } else {
        console.log('Nenhuma venda encontrada');
      }
    }).catch(error => {
      console.error('Erro ao buscar vendas:', error.message);
    });

    // Buscar custos
    get(ref(db, 'costs')).then(snapshot => {
      let costsData = [];
      if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
          costsData.push(childSnapshot.val());
        });
        setCosts(costsData);
      } else {
        console.log('Nenhum custo encontrado');
      }
    }).catch(error => {
      console.error('Erro ao buscar custos:', error.message);
    });
  }, []);

  useEffect(() => {
    console.log('Filtrando dados...');
    const filteredSales = sales.filter(sale => {
      if (searchDate && searchName) {
        return sale.date.includes(searchDate) && sale.product.toLowerCase().includes(searchName.toLowerCase());
      } else if (searchDate) {
        return sale.date.includes(searchDate);
      } else if (searchName) {
        return sale.product.toLowerCase().includes(searchName.toLowerCase());
      }
      return true;
    });

    const filteredCosts = costs.filter(cost => {
      if (searchDate && searchName) {
        return cost.date.includes(searchDate) && cost.description.toLowerCase().includes(searchName.toLowerCase());
      } else if (searchDate) {
        return cost.date.includes(searchDate);
      } else if (searchName) {
        return cost.description.toLowerCase().includes(searchName.toLowerCase());
      }
      return true;
    });

    console.log('Vendas filtradas:', filteredSales);
    console.log('Custos filtrados:', filteredCosts);

    setFilteredSales(filteredSales);
    setFilteredCosts(filteredCosts);
  }, [searchDate, searchName, sales, costs]);

  const totalSales = filteredSales.reduce((total, sale) => total + parseFloat(sale.price), 0).toFixed(2);
  const totalCosts = filteredCosts.reduce((total, cost) => total + parseFloat(cost.amount), 0).toFixed(2);

  return (
    <div className="history-container">
      <h2>Histórico de Transações</h2>

      <div className="search-container" style={{ textAlign: 'center' }}>
        <div className="search-field">
          <input
            type="text"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            placeholder="00/00/0000"
          />
        </div>
        <div className="search-field">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Filtro por nome"
          />
        </div>
      </div>

      <div className="transactions-container">
        {/* Seção de Vendas */}
        <div className="transaction-section">
          <h3>Vendas</h3>
          {filteredSales.length > 0 ? (
            <div className="transaction-list">
              {filteredSales.map((sale, index) => (
                <div key={index} className="transaction-card">
                  <strong>Produto:</strong> {sale.product} <br />
                  <strong>Preço:</strong> R$ {sale.price} <br />
                  <strong>Data:</strong> {sale.date}
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhuma venda registrada.</p>
          )}
          <div className="total">
            <strong className='strong1'>Total de Vendas:</strong> R$ {totalSales}
          </div>
        </div>

        {/* Seção de Custos */}
        <div className="transaction-section">
          <h3>Custos</h3>
          {filteredCosts.length > 0 ? (
            <div className="transaction-list">
              {filteredCosts.map((cost, index) => (
                <div key={index} className="transaction-card">
                  <strong>Descrição:</strong> {cost.description} <br />
                  <strong>Valor:</strong> R$ {cost.amount} <br />
                  <strong>Data:</strong> {cost.date}
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhum custo registrado.</p>
          )}
          <div className="total">
            <strong className='strong2'>Total de Custos:</strong> R$ {totalCosts}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
