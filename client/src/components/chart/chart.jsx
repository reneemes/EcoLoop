import { Chart } from 'react-google-charts';

function MyChart({ data }) {
  return (
    <Chart
      chartType='ColumnChart'
      data={data}
      options={{
        title: 'Recycling Overview',
        legend: { position: 'none' },
      }}
    />
  );
}

export default MyChart;