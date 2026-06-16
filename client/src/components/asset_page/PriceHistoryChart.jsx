import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import numberWithCommas from '../../modules/numberwithcomma';

const PriceHistoryChart = ({ priceHistory, options }) => {
  if (!priceHistory || priceHistory.length === 0) return null;

  // Filter and sort data
  const chartData = priceHistory
    .filter(item => item.price && item.year)
    .map(item => ({
      year: item.year.toString(),
      price: parseFloat(item.price),
    }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  if (chartData.length < 2) return null;

  const currency = options?.currency?.split(' ')[0] || 'AED';
  const graphType = options?.graphType || 'Area Graph';

  // Calculate statistics
  const prices = chartData.map(d => d.price);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const latestPrice = prices[prices.length - 1];
  const oldestPrice = prices[0];
  const priceChange = latestPrice - oldestPrice;
  const percentageChange = ((priceChange / oldestPrice) * 100).toFixed(1);
  const isUp = priceChange >= 0;

  const renderCustomLabel = (props) => {
    const { x, y, value } = props;
    const formattedValue = value >= 1000000 
      ? (value / 1000000).toFixed(2) + 'M' 
      : (value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value);
    
    return (
      <text 
        x={x} 
        y={y} 
        dy={-15} 
        fill="#111827" 
        fontSize={10} 
        fontWeight={700} 
        textAnchor="middle"
        className="montserrat"
      >
        {formattedValue} {currency}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-xl rounded-xl border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-sm font-bold text-[#D48D2A]">
            {currency} {numberWithCommas(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonAxis = (
      <>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
        <XAxis 
          dataKey="year" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fontWeight: 600, fill: '#9CA3AF' }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fontWeight: 600, fill: '#9CA3AF' }}
          tickFormatter={(val) => `${val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : (val >= 1000 ? (val/1000).toFixed(0) + 'K' : val)}`}
          dx={-10}
        />
        <Tooltip content={<CustomTooltip />} />
      </>
    );

    const margin = { top: 40, right: 30, left: 20, bottom: 20 };

    if (graphType === 'Bar Graph') {
      return (
        <BarChart data={chartData} margin={margin}>
          {commonAxis}
          <Bar 
            dataKey="price" 
            fill="#D48D2A" 
            radius={[6, 6, 0, 0]} 
            barSize={40}
          >
            <LabelList content={renderCustomLabel} />
          </Bar>
        </BarChart>
      );
    }

    if (graphType === 'Line Graph') {
      return (
        <LineChart data={chartData} margin={margin}>
          {commonAxis}
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#D48D2A" 
            strokeWidth={3} 
            dot={{ r: 6, fill: '#D48D2A', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8, strokeWidth: 0 }}
          >
            <LabelList content={renderCustomLabel} />
          </Line>
        </LineChart>
      );
    }

    // Default to Area Graph
    return (
      <AreaChart data={chartData} margin={margin}>
        <defs>
          <linearGradient id="colorPriceProduct" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D48D2A" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#D48D2A" stopOpacity={0}/>
          </linearGradient>
        </defs>
        {commonAxis}
        <Area 
          type="monotone" 
          dataKey="price" 
          stroke="#D48D2A" 
          strokeWidth={3} 
          fillOpacity={1} 
          fill="url(#colorPriceProduct)"
          dot={{ r: 5, fill: '#D48D2A', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 7, strokeWidth: 0 }}
        >
          <LabelList content={renderCustomLabel} />
        </Area>
      </AreaChart>
    );
  };

  return (
    <div className="w-full px-[2%] py-16">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side: Stats */}
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-normal canela mb-4">
              Past {chartData.length} Year Price Chart
            </h2>
            <p className="text-sm text-gray-500 montserrat leading-relaxed mb-8">
              Discover the historical market trend of this model and see how its value has evolved over the past {chartData.length} years.
            </p>

            <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Avg. Market Price</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1 montserrat">
                {currency} {numberWithCommas(Math.round(avgPrice))}
              </h3>
              <p className="text-[10px] font-medium text-gray-400 mb-6 uppercase tracking-wider">
                Past {chartData.length} Year Average
              </p>

              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {isUp ? <FiTrendingUp /> : <FiTrendingDown />}
                  {isUp ? '+' : ''}{percentageChange}%
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Price Change ({chartData.length}Y)
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Chart */}
          <div className="lg:w-2/3 flex flex-col justify-between">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <p className="text-[10px] text-gray-400 font-medium">
                Prices are based on market data and may vary depending on condition, mileage, and location.
              </p>
              
              <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600">
                {currency}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryChart;
