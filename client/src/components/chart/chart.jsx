import { Chart } from 'react-google-charts';

function MyChart({ data }) {
  return (
    <Chart
      chartType='ColumnChart'
      data={data}
      options={{
        title: 'Recycling Overview',
        legend: {position: 'none'},
        colors: ["#a8e6cf", "#dcedc1", "#ffd3b6","#ffaaa5", "#c7ceea"],
        chartArea: {
          // left: 30,    // padding inside chart container
          // top: 50,
          width: '90%',
          height: '50%',
        },
        hAxis: {
          title: "Material",
          textStyle: {
            fontSize: 12,
            color: "#233238",
          },
        },
        vAxis: {
          title: "Total Recycled",
        },
      }}
    />
  );
}

export default MyChart;