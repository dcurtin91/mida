import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [askingPriceRange, setAskingPriceRange] = useState({ min: 0, max: Infinity });
  const [scatterData, setScatterData] = useState({
    series: [
      {
        name: 'Scatter Plot',
        data: [],
      },
    ],
  });
  const [scatterOptions, setScatterOptions] = useState({
    chart: {
      height: "100%",
      type: 'scatter',
      zoom: {
        enabled: true,
        type: 'xy',
      },
    },
    xaxis: {
      title: {
        text: 'TTM REVENUE',
      },
    },
    yaxis: {
      title: {
        text: 'ASKING PRICE',
      },
    },
    
    
  });

  useEffect(() => {
    fetchDataAndPopulateTable();
  }, []);

  async function fetchDataAndPopulateTable() {
    try {
      const response = await fetch('http://localhost:4000/fetchData');
      const responseData = await response.json();
      setData(responseData);
      setFilteredData(responseData);
      populateScatterData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function populateScatterData(dataToUse) {
    const scatterDataArray = dataToUse.map((row) => ({
      x: parseFloat(row['TTM REVENUE']),
      y: parseFloat(row['ASKING PRICE']),
      title: row['Title'],
    }));
    
    const title = dataToUse.length > 0 ? dataToUse[0]['Title'] : 'Scatter Plot';
    
    setScatterData({
      series: [
        {
          name: title, 
          data: scatterDataArray,
        },
      ],
    });
  }

  
  
  

  function applyFilter() {
    const newData = data.filter(d => {
      const askingPrice = parseFloat(d['ASKING PRICE']);
      return askingPrice >= askingPriceRange.min && askingPrice <= askingPriceRange.max;
    });
    setFilteredData(newData);
    populateScatterData(newData);
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
        <ReactApexChart options={scatterOptions} series={scatterData.series} type="scatter" height={550} />
      </div>
    </div>
  );
}

export default App;
