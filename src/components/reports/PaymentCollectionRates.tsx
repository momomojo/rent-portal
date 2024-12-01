import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PaymentCollectionRatesProps {
  data: {
    [key: string]: any[];
  };
}

export default function PaymentCollectionRates({ data }: PaymentCollectionRatesProps) {
  const totalPayments = Object.values(data).flat().length;
  const paidPayments = Object.values(data)
    .flat()
    .filter(payment => payment.status === 'paid').length;
  const latePayments = Object.values(data)
    .flat()
    .filter(payment => payment.status === 'late').length;
  const pendingPayments = totalPayments - paidPayments - latePayments;

  const chartData = {
    labels: ['Paid', 'Late', 'Pending'],
    datasets: [
      {
        data: [paidPayments, latePayments, pendingPayments],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(99, 102, 241, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(99, 102, 241)',
        ],
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
  };

  return <Doughnut data={chartData} options={options} />;
}