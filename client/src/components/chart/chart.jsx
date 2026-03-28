import { Chart } from 'react-google-charts';

function MyChart({ data }) {
  return (
    <Chart
      chartType='PieChart'
      data={data}
      options={{
        title: 'Recycling Overview',
        legend: {
          position: "bottom",
          alignment: "center",
          textStyle: {
            color: "#233238",
            fontSize: 14,
          },
        },
        colors: ["#a8e6cf", "#dcedc1", "#ffd3b6","#ffaaa5", "#c7ceea"],
        chartArea: {
        left: 30,    // padding inside chart container
        top: 50,
        width: '90%',
        // height: '70%',
      },
      }}
      //  width={'75%'}
    />
  );
}

export default MyChart;