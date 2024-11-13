const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();


router.get('/analyze', (req, res) => {
  const filePath = path.join(__dirname, '../data/sales-data.txt');

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');
    const salesData = lines.slice(1); 

    let totalSales = 0;
    const monthSales = {};
    const monthItemQuantity = {};
    const monthItemRevenue = {};
    const mostPopularItemStats = {};

  
    salesData.forEach(line => {
      const [dateStr, sku, unitPriceStr, quantityStr, totalPriceStr] = line.split(',');
      const date = new Date(dateStr);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const unitPrice = parseFloat(unitPriceStr);
      const quantity = parseInt(quantityStr);
      const totalPrice = parseFloat(totalPriceStr);

      totalSales += totalPrice;

      
      monthSales[month] = (monthSales[month] || 0) + totalPrice;

      
      monthItemQuantity[month] = monthItemQuantity[month] || {};
      monthItemQuantity[month][sku] = (monthItemQuantity[month][sku] || 0) + quantity;

     
      monthItemRevenue[month] = monthItemRevenue[month] || {};
      monthItemRevenue[month][sku] = (monthItemRevenue[month][sku] || 0) + totalPrice;

      
      if (!mostPopularItemStats[sku]) {
        mostPopularItemStats[sku] = { min: quantity, max: quantity, sum: 0, count: 0 };
      }
      mostPopularItemStats[sku].min = Math.min(mostPopularItemStats[sku].min, quantity);
      mostPopularItemStats[sku].max = Math.max(mostPopularItemStats[sku].max, quantity);
      mostPopularItemStats[sku].sum += quantity;
      mostPopularItemStats[sku].count += 1;
    });

    // Calculate averages
    for (const sku in mostPopularItemStats) {
      mostPopularItemStats[sku].average = mostPopularItemStats[sku].sum / mostPopularItemStats[sku].count;
    }

    res.json({
      totalSales,
      monthSales,
      mostPopularItems: Object.fromEntries(
        Object.entries(monthItemQuantity).map(([month, items]) => [month, Object.keys(items).reduce((a, b) => items[a] > items[b] ? a : b)])
      ),
      mostRevenueItems: Object.fromEntries(
        Object.entries(monthItemRevenue).map(([month, items]) => [month, Object.keys(items).reduce((a, b) => items[a] > items[b] ? a : b)])
      ),
      mostPopularItemStats
    });
  } catch (error) {
    console.error('Error reading the file:', error);
    res.status(500).json({ message: 'Error processing the sales data', error });
  }
});

module.exports = router;
