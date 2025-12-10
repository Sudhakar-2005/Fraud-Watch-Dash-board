import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Wifi, WifiOff, Radio, Volume2, VolumeX, Bell, BellOff } from "lucide-react";
import { useRealtimeTransactions, Transaction } from "@/hooks/useRealtimeTransactions";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { useDesktopNotification } from "@/hooks/useDesktopNotification";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const getStatusBadge = (status: Transaction["status"]) => {
  const variants = {
    legitimate: "bg-success/10 text-success hover:bg-success/20",
    fraudulent: "bg-danger/10 text-danger hover:bg-danger/20",
    pending: "bg-warning/10 text-warning hover:bg-warning/20",
  };

  return (
    <Badge className={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const getRiskScoreColor = (score: number) => {
  if (score < 30) return "text-success";
  if (score < 70) return "text-warning";
  return "text-danger";
};

const ConnectionIndicator = ({ status }: { status: "connected" | "disconnected" | "connecting" }) => {
  const config = {
    connected: {
      icon: Wifi,
      label: "Live",
      className: "text-success",
      pulse: true,
    },
    disconnected: {
      icon: WifiOff,
      label: "Disconnected",
      className: "text-muted-foreground",
      pulse: false,
    },
    connecting: {
      icon: Radio,
      label: "Connecting...",
      className: "text-warning",
      pulse: true,
    },
  };

  const { icon: Icon, label, className, pulse } = config[status];

  return (
    <div className={cn("flex items-center gap-2 text-sm font-medium", className)}>
      <div className="relative">
        <Icon className="h-4 w-4" />
        {pulse && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
          </span>
        )}
      </div>
      <span>{label}</span>
    </div>
  );
};

export const TransactionMonitor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopNotificationsEnabled, setDesktopNotificationsEnabled] = useState(false);
  
  const { playNotification, setEnabled } = useNotificationSound();
  const { permission, requestPermission, sendNotification, isSupported } = useDesktopNotification();
  const { toast } = useToast();

  useEffect(() => {
    if (permission === "granted") {
      setDesktopNotificationsEnabled(true);
    }
  }, [permission]);

  const handleToggleDesktopNotifications = async () => {
    if (!isSupported) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Your browser doesn't support desktop notifications",
      });
      return;
    }

    if (permission === "denied") {
      toast({
        variant: "destructive",
        title: "Notifications Blocked",
        description: "Please enable notifications in your browser settings",
      });
      return;
    }

    if (permission === "default") {
      const granted = await requestPermission();
      if (granted) {
        setDesktopNotificationsEnabled(true);
        toast({
          title: "Notifications Enabled",
          description: "You'll receive alerts when fraud is detected",
        });
      }
      return;
    }

    setDesktopNotificationsEnabled(!desktopNotificationsEnabled);
  };

  const handleFraudDetected = useCallback((transaction: Transaction) => {
    playNotification("fraud");
    
    toast({
      variant: "destructive",
      title: "🚨 Fraud Detected",
      description: `Transaction ${transaction.id} flagged with ${transaction.riskScore}% risk score`,
    });

    if (desktopNotificationsEnabled) {
      sendNotification("🚨 Fraud Alert - FraudShield", {
        body: `Transaction ${transaction.id} flagged!\nAmount: $${transaction.amount.toLocaleString()}\nLocation: ${transaction.location}\nRisk Score: ${transaction.riskScore}%`,
        tag: transaction.id,
      });
    }
  }, [playNotification, toast, sendNotification, desktopNotificationsEnabled]);

  const handleWarningDetected = useCallback((transaction: Transaction) => {
    playNotification("warning");
  }, [playNotification]);

  const { transactions, connectionStatus } = useRealtimeTransactions({
    isConnected,
    onFraudDetected: handleFraudDetected,
    onWarningDetected: handleWarningDetected,
  });

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    setEnabled(newState);
  };

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Transaction Monitor</h2>
          <p className="text-muted-foreground">Real-time view of all incoming transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionIndicator status={connectionStatus} />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleDesktopNotifications}
            className={cn(
              "h-9 w-9",
              desktopNotificationsEnabled && permission === "granted" 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
            title={desktopNotificationsEnabled ? "Disable desktop notifications" : "Enable desktop notifications"}
          >
            {desktopNotificationsEnabled && permission === "granted" ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSound}
            className={cn(
              "h-9 w-9",
              soundEnabled ? "text-primary" : "text-muted-foreground"
            )}
            title={soundEnabled ? "Mute notifications" : "Enable notifications"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant={isConnected ? "outline" : "default"}
            size="sm"
            onClick={() => setIsConnected(!isConnected)}
          >
            {isConnected ? "Pause Stream" : "Resume Stream"}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by transaction ID or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow 
                  key={txn.id} 
                  className={cn(
                    "transition-all duration-500",
                    txn.isNew && "bg-primary/5 animate-pulse",
                    txn.isNew && txn.status === "fraudulent" && "bg-danger/10"
                  )}
                >
                  <TableCell className="font-medium font-mono">{txn.id}</TableCell>
                  <TableCell className="font-semibold">${txn.amount.toLocaleString()}</TableCell>
                  <TableCell>{txn.location}</TableCell>
                  <TableCell className="text-muted-foreground">{txn.timestamp}</TableCell>
                  <TableCell>
                    <span className={cn("font-semibold", getRiskScoreColor(txn.riskScore))}>
                      {txn.riskScore}%
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(txn.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      </Card>
    </div>
  );
};
