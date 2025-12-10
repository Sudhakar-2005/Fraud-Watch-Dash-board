import { useState, useEffect, useCallback, useRef } from "react";

export interface Transaction {
  id: string;
  amount: number;
  location: string;
  timestamp: string;
  status: "legitimate" | "fraudulent" | "pending";
  riskScore: number;
  isNew?: boolean;
}

const locations = [
  "New York, NY", "Los Angeles, CA", "London, UK", "Tokyo, Japan", 
  "Paris, France", "Sydney, Australia", "Lagos, Nigeria", "Moscow, Russia",
  "Dubai, UAE", "Singapore", "Berlin, Germany", "Toronto, Canada",
  "Mumbai, India", "São Paulo, Brazil", "Unknown"
];

const generateTransaction = (): Transaction => {
  const amount = Math.random() > 0.7 
    ? Math.floor(Math.random() * 50000) + 5000 
    : Math.floor(Math.random() * 2000) + 50;
  
  const location = locations[Math.floor(Math.random() * locations.length)];
  const isHighRisk = location === "Unknown" || amount > 10000;
  const riskScore = isHighRisk 
    ? Math.floor(Math.random() * 30) + 70 
    : Math.floor(Math.random() * 40) + 5;
  
  const status: Transaction["status"] = 
    riskScore > 80 ? "fraudulent" : 
    riskScore > 50 ? "pending" : "legitimate";

  const now = new Date();
  const timestamp = now.toISOString().replace("T", " ").substring(0, 16);

  return {
    id: `TXN-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`,
    amount,
    location,
    timestamp,
    status,
    riskScore,
    isNew: true,
  };
};

const initialTransactions: Transaction[] = [
  { id: "TXN-00001", amount: 1250.00, location: "New York, NY", timestamp: "2025-01-12 14:23", status: "legitimate", riskScore: 12 },
  { id: "TXN-00002", amount: 8750.00, location: "Lagos, Nigeria", timestamp: "2025-01-12 14:21", status: "fraudulent", riskScore: 94 },
  { id: "TXN-00003", amount: 450.00, location: "London, UK", timestamp: "2025-01-12 14:19", status: "legitimate", riskScore: 8 },
  { id: "TXN-00004", amount: 15000.00, location: "Moscow, Russia", timestamp: "2025-01-12 14:18", status: "fraudulent", riskScore: 89 },
  { id: "TXN-00005", amount: 320.00, location: "San Francisco, CA", timestamp: "2025-01-12 14:16", status: "legitimate", riskScore: 15 },
];

interface UseRealtimeTransactionsOptions {
  isConnected?: boolean;
  onFraudDetected?: (transaction: Transaction) => void;
  onWarningDetected?: (transaction: Transaction) => void;
}

export const useRealtimeTransactions = (options: UseRealtimeTransactionsOptions = {}) => {
  const { isConnected = true, onFraudDetected, onWarningDetected } = options;
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  const callbacksRef = useRef({ onFraudDetected, onWarningDetected });

  useEffect(() => {
    callbacksRef.current = { onFraudDetected, onWarningDetected };
  }, [onFraudDetected, onWarningDetected]);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prev) => {
      const updated = prev.map((t) => ({ ...t, isNew: false }));
      return [transaction, ...updated].slice(0, 50);
    });

    if (transaction.status === "fraudulent") {
      callbacksRef.current.onFraudDetected?.(transaction);
    } else if (transaction.status === "pending") {
      callbacksRef.current.onWarningDetected?.(transaction);
    }
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setConnectionStatus("disconnected");
      return;
    }

    setConnectionStatus("connecting");
    const connectTimeout = setTimeout(() => {
      setConnectionStatus("connected");
    }, 1000);

    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        const newTransaction = generateTransaction();
        addTransaction(newTransaction);
      }
    }, 2000 + Math.random() * 3000);

    return () => {
      clearTimeout(connectTimeout);
      clearInterval(interval);
    };
  }, [isConnected, addTransaction]);

  return { transactions, connectionStatus, addTransaction };
};
