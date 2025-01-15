import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { Chart } from "react-google-charts"; 

const Grafico = () => {

  const [sales, setSales] = useState([]);
  const [costs, setCosts] = useState([]);
  const [selectedMonth2, setSelectedMonth2] = useState(new Date().getMonth() + 1);
  const [selectedYear2, setSelectedYear2] = useState(new Date().getFullYear());  
  const [monthlyMetrics, setMonthlyMetrics] = useState([]);

  useEffect(() => {
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
  }, [selectedYear2]); 

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
  
    salesData.forEach((sale) => {
      const date = parseBrazilianDate(sale.date);
      const year = date.getFullYear();
      const month = date.getMonth(); 
  
      if (year === parseInt(selectedYear2)) { 
        monthlyData[month].receitas += parseFloat(sale.price || 0);
      }
    });
  
    costsData.forEach((cost) => {
      const date = parseBrazilianDate(cost.date);
      const year = date.getFullYear();
      const month = date.getMonth(); 
  
      if (year === parseInt(selectedYear2)) { 
        monthlyData[month].despesas += parseFloat(cost.amount || 0);
      }
    });
  
    monthlyData.forEach((data) => {
      data.lucro = data.receitas - data.despesas;
    });
  
    setMonthlyMetrics(monthlyData);
  };

  return (
    <>
      <div className="col-9 data-box">
        <h4>Receitas x Despesas x Lucro</h4>
        <span style={{ marginBottom: "5px", fontWeight: "bold" }}>Ano:</span>
        <label style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="number"
            value={selectedYear2}
            onChange={(e) => setSelectedYear2(e.target.value)}
          />
        </label>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="200px"
          data={[
            ["Mês", "Receitas", "Despesas", "Lucro"],
            ...monthlyMetrics.map((data) => [
              new Date(0, data.month - 1).toLocaleString("pt-BR", { month: "short" }),
              data.receitas,
              data.despesas,
              data.lucro,
            ]),
          ]}
          options={{
            title: "Receitas, Despesas e Lucro Mensal",
            chartArea: { width: "70%" },
            hAxis: { title: "Meses" },
            vAxis: { title: "Valores (R$)" },
            legend: { position: "top" },
            colors: ["#76A7FA", "#E6693E", "#4CAF50"],
          }}
        />
      </div>
    </>
  );
};

export default Grafico;

