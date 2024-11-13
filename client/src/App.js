import React, { useState, useEffect } from 'react';

function App() {
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/sales/analyze') 
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setSalesData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  

  if (!salesData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Sales Analysis</h1>
      <h2>Total Sales: ${salesData.totalSales.toFixed(2)}</h2>
      <h3>Month-wise Sales Totals:</h3>
      <ul>
        {Object.entries(salesData.monthSales).map(([month, total]) => (
          <li key={month}>{month}: ${total.toFixed(2)}</li>
        ))}
      </ul>
      <h3>Most Popular Items by Month:</h3>
      <ul>
        {Object.entries(salesData.mostPopularItems).map(([month, item]) => (
          <li key={month}>{month}: {item}</li>
        ))}
      </ul>
      <h3>Highest Revenue Items by Month:</h3>
      <ul>
        {Object.entries(salesData.mostRevenueItems).map(([month, item]) => (
          <li key={month}>{month}: {item}</li>
        ))}
      </ul>
      <h3>Statistics for the Most Popular Items:</h3>
      <ul>
        {Object.entries(salesData.mostPopularItemStats).map(([sku, stats]) => (
          <li key={sku}>
            {sku} - Min: {stats.min}, Max: {stats.max}, Avg: {stats.average.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
