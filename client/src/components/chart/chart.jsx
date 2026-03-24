import { Chart } from 'react-google-charts';

function MyChart({ data }) {
  return (
    <Chart
      // Try different chart types by changing this property with one of: LineChart, BarChart, AreaChart...
      chartType='ColumnChart'
      data={data}
      options={{
        title: 'Recycling Overview',
        legend: { position: 'none' },
      }}
      // legendToggle
    />
  );
}

export default MyChart;