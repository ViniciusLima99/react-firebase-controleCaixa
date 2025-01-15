import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { Chart } from "react-google-charts";
import Grafico from "./Grafico";
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dados = () => {
  const [sales, setSales] = useState([]);
  const [costs, setCosts] = useState([]);
  const [selectedDay1, setSelectedDay1] = useState(1);
  const [selectedDay2, setSelectedDay2] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [lucro, setLucro] = useState(0);
  const [lucratividade, setLucratividade] = useState(0);
  const [lucroAno, setLucroAno] = useState(0); 

  
  const navigate = useNavigate();
  
  const auth = getAuth();
  // const [monthlyMetrics, setMonthlyMetrics] = useState([]);


  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login')
    } 
    const fetchData = async () => {
      try {
        const salesSnapshot = await get(ref(db, "sales"));
        const costsSnapshot = await get(ref(db, "costs"));
  
        const salesData = salesSnapshot.exists() ? Object.values(salesSnapshot.val()) : [];
        const costsData = costsSnapshot.exists() ? Object.values(costsSnapshot.val()) : [];
  
        setSales(salesData);
        setCosts(costsData);
  
        calculateMetrics(salesData, costsData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error.message);
      }
    };
  
    fetchData();
  }, [selectedMonth, selectedYear, selectedDay1, selectedDay2]); 
    

  const parseBrazilianDate = (dateString) => {
    const [datePart] = dateString.split(','); 
    const [day, month, year] = datePart.split('/'); 
    return new Date(`${year}-${month}-${day}`); 
  };

  const calculateMetrics = (salesData, costsData) => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      receitas: 0,
      despesas: 0,
      lucro: 0,
    }));
  
    const isInSelectedRange = (date) => {
      const parsedDate = parseBrazilianDate(date);
      const day = parsedDate.getDate();
      const month = parsedDate.getMonth() + 1;
      const year = parsedDate.getFullYear();
    
      return (
        year === parseInt(selectedYear) &&
        month === parseInt(selectedMonth) &&
        day >= (parseInt(selectedDay1) -1 ) &&
        day <= (parseInt(selectedDay2) - 1) 
      );
    };
  
    salesData.forEach((sale) => {
      const date = parseBrazilianDate(sale.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const day = date.getDate();
  
      if (
        year === parseInt(selectedYear) &&
        month === parseInt(selectedMonth) &&
        day >= (parseInt(selectedDay1) -1) &&
        day <= (parseInt(selectedDay2)- 1)
      ) {
        monthlyData[month - 1].receitas += parseFloat(sale.price || 0);
      }
    });
  
    costsData.forEach((cost) => {
      const date = parseBrazilianDate(cost.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const day = date.getDate();
  
      if (
        year === parseInt(selectedYear) &&
        month === parseInt(selectedMonth) &&
        day >= (parseInt(selectedDay1) -1) &&
        day <= (parseInt(selectedDay2) -1)
      ) {
        monthlyData[month - 1].despesas += parseFloat(cost.amount || 0);
      }
    });
  
    monthlyData.forEach((data) => {
      data.lucro = data.receitas - data.despesas;
    });
  
    // setMonthlyMetrics(monthlyData);
  
    const receitas = salesData
      .filter((sale) => isInSelectedRange(sale.date))
      .reduce((acc, sale) => acc + parseFloat(sale.price || 0), 0);
  
    const despesas = costsData
      .filter((cost) => isInSelectedRange(cost.date))
      .reduce((acc, cost) => acc + parseFloat(cost.amount || 0), 0);
  
    const lucroCalculado = receitas - despesas;
    const lucratividadeCalculada = receitas > 0 ? (lucroCalculado / receitas) * 100 : 0;
  
    const lucroAnual = salesData
    .filter((sale) => new Date(parseBrazilianDate(sale.date)).getFullYear() === parseInt(selectedYear))
    .reduce((acc, sale) => acc + parseFloat(sale.price || 0), 0) -
    costsData
      .filter((cost) => new Date(parseBrazilianDate(cost.date)).getFullYear() === parseInt(selectedYear))
      .reduce((acc, cost) => acc + parseFloat(cost.amount || 0), 0);

    setTotalReceitas(receitas);
    setTotalDespesas(despesas);
    setLucro(lucroCalculado);
    setLucratividade(lucratividadeCalculada);
    setLucroAno(lucroAnual);
  };
  
  return (
    <>
     <div
  className="filters"
  style={{
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "10px", 
  }}
> 
<label
    style={{
      display: "flex",
      flexDirection: "column",
      marginRight: "10px", 
    }}
  >
    <span style={{ marginBottom: "5px", fontWeight: "bold" }}>Dia Inicial:</span>
    <select
      value={selectedDay1}
      onChange={(e) => setSelectedDay1(e.target.value)}
      style={{
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "#fff",
        fontSize: "14px",
      }}
    >
      {Array.from({ length: 31 }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>
  </label>
  <label
    style={{
      display: "flex",
      flexDirection: "column",
      marginRight: "10px", 
    }}
  >
    <span style={{ marginBottom: "5px", fontWeight: "bold" }}>Dia Final:</span>
    <select
      value={selectedDay2}
      onChange={(e) => setSelectedDay2(e.target.value)}
      style={{
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "#fff",
        fontSize: "14px",
      }}
    >
      {Array.from({ length: 31 }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>
  </label>
  <label
    style={{
      display: "flex",
      flexDirection: "column",
      marginRight: "10px", // Reduza o espaço entre os filtros
    }}
  >
    <span style={{ marginBottom: "5px", fontWeight: "bold" }}>Mês:</span>
    <select
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
      style={{
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "#fff",
        fontSize: "14px",
      }}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>
  </label>
  <label style={{ display: "flex", flexDirection: "column" }}>
    <span style={{ marginBottom: "5px", fontWeight: "bold" }}>Ano:</span>
    <input
      type="number"
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
      style={{
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "#fff",
        fontSize: "14px",
      }}
    />
  </label>
</div>

<div className="row" style={{ marginBottom: "0px" }}> 
  <div className="col-3 data-box">
    <h4>Receitas</h4>
    <div className="value-box">R$ {totalReceitas.toFixed(2)}</div>
  </div>
  <div className="col-3 data-box">
    <h4>Despesas</h4>
    <div className="value-box">R$ {totalDespesas.toFixed(2)}</div>
  </div>
  <div className="col-3 data-box">
    <h4>Lucro/Prejuízo</h4>
    <div className="value-box">R$ {lucro.toFixed(2)}</div>
  </div>
  <div className="col-3 data-box">
    <h4>Lucratividade</h4>
    <div className="value-box">{lucratividade.toFixed(2)}%</div>
  </div>
</div>

<div className="row" style={{ gap: "0px" }}> 
  <div className="col-3 data-box">
    <h4>Lucro/Prejuízo no Ano</h4>
    <div className="value-box">R$ {lucroAno.toFixed(2)}</div>
  </div>
  <Grafico/>
  </div>
    </>
  );
};

export default Dados;