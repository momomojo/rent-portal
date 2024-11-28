import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear } from 'date-fns';

export function useReports(dateRange: 'week' | 'month' | 'year') {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any>({ total: 0, trends: [] });
  const [occupancyData, setOccupancyData] = useState<any>({ rate: 0, trends: [] });
  const [paymentData, setPaymentData] = useState<any>({ collectionRate: 0, trends: [] });
  const [maintenanceData, setMaintenanceData] = useState<any>({ total: 0, trends: [] });
  const [propertyPerformance, setPropertyPerformance] = useState<any>([]);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'year':
        return { start: startOfYear(now), end: endOfYear(now) };
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const { start, end } = getDateRange();

      // Fetch payments for revenue calculation
      const paymentsQuery = query(
        collection(db, 'payments'),
        where('createdAt', '>=', start.getTime()),
        where('createdAt', '<=', end.getTime())
      );
      const paymentsSnapshot = await getDocs(paymentsQuery);
      const payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate revenue metrics
      const revenue = calculateRevenue(payments);
      setRevenueData(revenue);

      // Fetch properties for occupancy calculation
      const propertiesQuery = query(collection(db, 'properties'));
      const propertiesSnapshot = await getDocs(propertiesQuery);
      const properties = propertiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate occupancy metrics
      const occupancy = calculateOccupancy(properties);
      setOccupancyData(occupancy);

      // Calculate payment collection metrics
      const paymentMetrics = calculatePaymentMetrics(payments);
      setPaymentData(paymentMetrics);

      // Fetch maintenance requests for cost calculation
      const maintenanceQuery = query(
        collection(db, 'maintenanceRequests'),
        where('createdAt', '>=', start.getTime()),
        where('createdAt', '<=', end.getTime())
      );
      const maintenanceSnapshot = await getDocs(maintenanceQuery);
      const maintenance = maintenanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate maintenance metrics
      const maintenanceMetrics = calculateMaintenanceCosts(maintenance);
      setMaintenanceData(maintenanceMetrics);

      // Calculate property performance metrics
      const performance = calculatePropertyPerformance(properties, payments, maintenance);
      setPropertyPerformance(performance);

    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRevenue = (payments: any[]) => {
    const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const trends = groupByPeriod(payments, dateRange);
    return { total, trends };
  };

  const calculateOccupancy = (properties: any[]) => {
    const totalProperties = properties.length;
    const occupiedProperties = properties.filter(p => !p.available).length;
    const rate = Math.round((occupiedProperties / totalProperties) * 100);
    const trends = calculateOccupancyTrends(properties, dateRange);
    return { rate, trends };
  };

  const calculatePaymentMetrics = (payments: any[]) => {
    const totalDue = payments.length;
    const collected = payments.filter(p => p.status === 'paid').length;
    const collectionRate = Math.round((collected / totalDue) * 100);
    const trends = groupByPeriod(payments, dateRange);
    return { collectionRate, trends };
  };

  const calculateMaintenanceCosts = (maintenance: any[]) => {
    const total = maintenance.reduce((sum, req) => sum + (req.cost || 0), 0);
    const trends = groupByPeriod(maintenance, dateRange);
    return { total, trends };
  };

  const calculatePropertyPerformance = (properties: any[], payments: any[], maintenance: any[]) => {
    return properties.map(property => {
      const propertyPayments = payments.filter(p => p.propertyId === property.id);
      const propertyMaintenance = maintenance.filter(m => m.propertyId === property.id);
      
      return {
        id: property.id,
        name: property.name,
        revenue: propertyPayments.reduce((sum, p) => sum + p.amount, 0),
        expenses: propertyMaintenance.reduce((sum, m) => sum + (m.cost || 0), 0),
        occupancyRate: property.available ? 0 : 100,
        maintenanceRequests: propertyMaintenance.length
      };
    });
  };

  const groupByPeriod = (data: any[], period: 'week' | 'month' | 'year') => {
    // Implementation of grouping logic based on period
    return data.reduce((groups, item) => {
      const date = new Date(item.createdAt);
      const key = period === 'week' ? date.getDay() :
                 period === 'month' ? date.getDate() :
                 date.getMonth();
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  };

  const calculateOccupancyTrends = (properties: any[], period: 'week' | 'month' | 'year') => {
    // Implementation of occupancy trends calculation
    return properties.reduce((trends, property) => {
      const date = new Date(property.updatedAt);
      const key = period === 'week' ? date.getDay() :
                 period === 'month' ? date.getDate() :
                 date.getMonth();
      
      if (!trends[key]) {
        trends[key] = { total: 0, occupied: 0 };
      }
      trends[key].total++;
      if (!property.available) {
        trends[key].occupied++;
      }
      return trends;
    }, {});
  };

  return {
    loading,
    revenueData,
    occupancyData,
    paymentData,
    maintenanceData,
    propertyPerformance
  };
}