import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

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
      tickAmount: 3,
      title: {
        text: 'TTM REVENUE',
      },
    },
    yaxis: {
      max: 2000000,
      title: {
        text: 'ASKING PRICE',
      },
    },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex }) {
        const title = scatterData[dataPointIndex].Title;
        return `<div>${title}</div>`;
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
