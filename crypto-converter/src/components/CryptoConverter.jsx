import axios from "axios";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const CryptoConverter = () => {
  const [amount, setAmount] = useState(1);
  const [currency, setCurrency] = useState("usd");
  const [crypto, setCrypto] = useState("bitcoin");
  const [rate, setRate] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);

  const currencies = ["usd", "eur", "gbp", "inr"];
  const cryptos = ["bitcoin", "ethereum", "dogecoin", "litecoin"];

  useEffect(() => {
    const fetchData = async () => {
      await fetchConversionRate();
      await fetchHistoricalData();
    };
    fetchData();
  }, [crypto, currency]);

  const fetchConversionRate = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`
      );
      setRate(response.data[crypto][currency]);
    } catch (error) {
      console.error("Error fetching conversion rate", error);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=${currency}&days=7`
      );
      setHistoricalData(response.data.prices);
    } catch (error) {
      console.error("Error fetching historical data", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Crypto Currency Converter
        </h2>

        <div className="flex flex-col space-y-3">
          <input
            type="number"
            className="border p-2 rounded-md w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className="border p-2 rounded-md w-full"
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
          >
            {cryptos.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded-md w-full"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {currencies.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>

          <div className="text-lg text-center font-semibold mt-3">
            {parseFloat(amount) || 0} {crypto.toUpperCase()} ={" "}
            {(parseFloat(amount) * rate).toFixed(2)} {currency.toUpperCase()}
          </div>
        </div>
      </div>

      {historicalData.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-6 w-full max-w-2xl">
          <h2 className="text-xl font-bold text-center mb-4">
            Price Fluctuation (Last 7 Days)
          </h2>
          <Line
            data={{
              labels: historicalData.map((data) =>
                new Date(data[0]).toLocaleDateString()
              ),
              datasets: [
                {
                  label: "Price",
                  data: historicalData.map((data) => data[1]),
                  borderColor: "blue",
                  backgroundColor: "rgba(0,0,255,0.2)",
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CryptoConverter;
