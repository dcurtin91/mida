import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts'; 


function App() {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      fetchDataAndPopulateTable();
    }, []);
  
    async function fetchDataAndPopulateTable() {
      try {
        const response = await fetch('http://localhost:3000/fetchData'); 
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    
    const scatterData = {
      series: [
        {
          name: 'Scatter Plot',
          data: data.map((row) => ({
            x: parseFloat(row['TTM REVENUE']),
            y: parseFloat(row['ASKING PRICE']),
            title: row['Title'],
          })),
        },
      ],
    };
  
    
    const scatterOptions = {
      chart: {
        height: 350000000,
        type: 'scatter',
        zoom: {
          enabled: true,
          type: 'xy',
        },
      },
      xaxis: {
        title: {
          text: 'TTM REVENUE', // X-axis label
        },
      },
      yaxis: {
        title: {
          text: 'ASKING PRICE', // Y-axis label
        },
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex }) {
          return `<div>${data[seriesIndex][dataPointIndex].title}</div>`; // Display title in tooltip
        },
      },
    };
  
    return (
      <div className="App">
        <h1>MiDA</h1>
        <div id="chart">
          <ReactApexChart options={scatterOptions} series={scatterData.series} type="scatter" height={350000000} />
        </div>
      </div>
    );
  }
  
  export default App;
  