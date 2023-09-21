import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [askingPriceRange, setAskingPriceRange] = useState({ min: 0, max: 99999999 });
  const [scatterData, setScatterData] = useState([]);
  const [title, setTitle] = useState('');
  const [offer, setOffer] = useState('');
  const [ttmrev, setTtmrev] = useState('');
  const [ttmprofit, setTtmprofit] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [team, setTeam] = useState('');
  const [model, setModel] = useState('');
  const [tech, setTech] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [growth, setGrowth] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [financing, setFinancing] = useState('');
  const [gross, setGross] = useState('');
  const [net, setNet] = useState('');
  const [lmgross, setLmgross] = useState('');
  const [lmnet, setLmnet] = useState('');
  const [customers, setCustomers] = useState('');
  const [arr, setArr] = useState('');
  const [agr, setAgr] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const url = 'http://localhost:4000/fetchData';
      try {
        const response = await fetch(url);
        const data = await response.json();
        setData(data);
        setFilteredData(data);
        setScatterData(data.map((item) => ({
          x: item.TTM_REVENUE,
          y: item.ASKING_PRICE,
          ID: item.ID,
          Title: item.Title, 
          Under_Offer: item.Under_Offer,
          TTM_PROFIT: item.TTM_PROFIT,
          Description: item.Description,
          Date_Founded: item.Date_Founded,
          Team_Size: item.Team_Size,
          BUSINESS_MODEL: item.BUSINESS_MODEL,
          Tech_Stack: item.Tech_Stack,
          COMPETITORS: item.COMPETITORS,
          GROWTH_OPPORTUNITYL: item.GROWTH_OPPORTUNITY,
          SELLING_REASONING: item.SELLING_REASONING,
          Financing: item.Financing,
          TTM_gross_revenue: item.TTM_gross_revenue,
          TTM_net_profit: item.TTM_net_profit,
          Last_months_gross_revenue: item.Last_months_gross_revenue,
          Last_months_net_profit: item.Last_months_net_profit,
          Customers: item.Customers,
          Annual_recurring_revenue: item.Annual_recurring_revenue,
          Annual_growth_rate: item.Annual_growth_rate,
      
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const series = [
    {
      name: 'Scatter Plot',
      data: scatterData,
    },
  ];
  

  const options = {
    chart: {
      height: '100%',
      type: 'scatter',
      zoom: {
        enabled: true,
        type: 'xy',
      },
    },
    xaxis: {
      type: 'numeric',
    min: 0,
    max: 60000000,
    tickAmount: 5,
      title: {
        text: 'TTM REVENUE',
      },
      labels: {
        formatter: function (value) {
          return "$" + value.toLocaleString();
        }
      },
    },
    yaxis: {
      max: 70000000,
      title: {
        text: 'ASKING PRICE',
      },
      labels: {
        formatter: function (value) {
          return "$" + value.toLocaleString();
        }
      },
    },
    tooltip: {
      onDatasetHover: {
        highlightDataSeries: true,
    },
      custom: function ({ dataPointIndex }) {
        const title = scatterData[dataPointIndex].Title;
        setTitle(title);
        const offer = scatterData[dataPointIndex].Under_Offer;
        setOffer(offer);
        const ttmrev = numberWithCommas(scatterData[dataPointIndex].x);
        setTtmrev(ttmrev);
        const ttmprofit = numberWithCommas(scatterData[dataPointIndex].TTM_PROFIT);
        setTtmprofit(ttmprofit);
        const price = numberWithCommas(scatterData[dataPointIndex].y);
        setPrice(price);
        const description = scatterData[dataPointIndex].Description;
        setDescription(description);
        const date = scatterData[dataPointIndex].Date_Founded;
        setDate(date);
        const team = scatterData[dataPointIndex].Team_Size;
        setTeam(team);
        const model = scatterData[dataPointIndex].BUSINESS_MODEL;
        setModel(model);
        const tech = scatterData[dataPointIndex].Tech_Stack;
        setTech(tech);
        const competitors = scatterData[dataPointIndex].COMPETITORS;
        setCompetitors(competitors);
        const growth = scatterData[dataPointIndex].GROWTH_OPPORTUNITY;
        setGrowth(growth);
        const reasoning = scatterData[dataPointIndex].SELLING_REASONING;
        setReasoning(reasoning);
        const financing = scatterData[dataPointIndex].Financing;
        setFinancing(financing);
        const gross = numberWithCommas(scatterData[dataPointIndex].TTM_gross_revenue);
        setGross(gross);
        const net = numberWithCommas(scatterData[dataPointIndex].TTM_net_profit);
        setNet(net);
        const lmgross = numberWithCommas(scatterData[dataPointIndex].Last_months_gross_revenue);
        setLmgross(lmgross);
        const lmnet = numberWithCommas(scatterData[dataPointIndex].Last_months_net_profit);
        setLmnet(lmnet);
        const customers = scatterData[dataPointIndex].Customers;
        setCustomers(customers);
        const arr = numberWithCommas(scatterData[dataPointIndex].Annual_recurring_revenue);
        setArr(arr);
        const agr = numberWithCommas(scatterData[dataPointIndex].Annual_growth_rate);
        setAgr(agr);

        function numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
        return `<div>Title: ${title}</div>`;
      },
    },
  };

  function applyFilter() {
    const newData = data.filter(d => {
      const askingPrice = parseFloat(d['ASKING PRICE']);
      return askingPrice >= askingPriceRange.min && askingPrice <= askingPriceRange.max;
    });
    setFilteredData(newData);
    setScatterData(newData.map((item) => ({
      x: item.TTM_REVENUE,
      y: item.ASKING_PRICE,
      ID: item.ID,
      Title: item.Title, 
    })));
  }

  return (
    <div className="App">
      <h1>MiDA</h1>
      
      <div>
        <input 
          type="number" 
          placeholder="Min Asking Price" 
          value={askingPriceRange.min} 
          onChange={(e) => setAskingPriceRange(prev => ({ ...prev, min: parseFloat(e.target.value) }))} 
        />
        <input 
          type="number" 
          placeholder="Max Asking Price" 
          value={askingPriceRange.max} 
          onChange={(e) => setAskingPriceRange(prev => ({ ...prev, max: parseFloat(e.target.value) }))} 
        />
        <button onClick={applyFilter}>Apply Filter</button>
      </div>
      
      <div id="chart">
        <ReactApexChart options={options} series={series} type="scatter" height={550} />
      </div>
      <div>
        <div>{title}</div>
        <div>{offer}</div>
        <div>{ttmrev}</div>
        <div>{ttmprofit}</div>
        <div>{price}</div>
        <div>{description}</div>
        <div>{date}</div>
        <div>{team}</div>
        <div>{model}</div>
        <div>{tech}</div>
        <div>{competitors}</div>
        <div>{growth}</div>
        <div>{reasoning}</div>
        <div>Financing: {financing}</div>
        <div>TTM Gross Revenue: ${gross}</div>
        <div>TTM Net Profit: ${net}</div>
        <div>Last Month's Gross Revenue: ${lmgross}</div>
        <div>Last Month's Net Profit: ${lmnet}</div>
        <div>Customers: {customers}</div>
        <div>Annual Recurring Revenue: ${arr}</div>
        <div>Annual Growth Rate: ${agr}</div>
      
        </div>
    </div>
  );
}

export default App;
