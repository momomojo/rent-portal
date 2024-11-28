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

interface OccupancyRatesProps {
  data: {
    [key: string]: {
      total: number;
      occupied: number;
    };
  };
}

export default function OccupancyRates({ data }: OccupancyRatesProps) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Occupancy Rate',
        data: Object.values(data).map(({ total, occupied }) => 
          (occupied / total) * 100
        ),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
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
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}