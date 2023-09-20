import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [askingPriceRange, setAskingPriceRange] = useState({ min: 0, max: 99999999 });
  const [scatterData, setScatterData] = useState([]);

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
    max: 1000000,
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
      max: 800000,
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
        const offer = scatterData[dataPointIndex].Under_Offer;
        const ttmrev = numberWithCommas(scatterData[dataPointIndex].x);
        const ttmprofit = numberWithCommas(scatterData[dataPointIndex].TTM_PROFIT);
        const price = numberWithCommas(scatterData[dataPointIndex].y);
        const description = scatterData[dataPointIndex].Description;
        const date = scatterData[dataPointIndex].Date_Founded;
        const team = scatterData[dataPointIndex].Team_Size;
        const model = scatterData[dataPointIndex].BUSINESS_MODEL;

        function numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
        return `<div>Title: ${title}</div>
                <div>Under Offer: ${offer}</div>
                <div>TTM Revenue: $${ttmrev}</div>
                <div>TTM Profit: $${ttmprofit}</div>
                <div>Price: $${price}</div>
                <div>Description: ${description}</div>
                <div>Date Founded: ${date}</div>
                <div>Team Size: ${team}</div>
                <div>Business Model: ${model}</div>`;
      },
      fixed: {
        enabled: true,
        position: 'topRight',
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
    </div>
  );
}

export default App;
