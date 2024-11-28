import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MaintenanceCostsProps {
  data: {
    [key: string]: any[];
  };
}

export default function MaintenanceCosts({ data }: MaintenanceCostsProps) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Maintenance Costs',
        data: Object.values(data).map(items =>
          items.reduce((sum, item) => sum + (item.cost || 0), 0)
        ),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}