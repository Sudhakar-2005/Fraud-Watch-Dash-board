import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Clock, DollarSign } from "lucide-react";

interface FraudAlert {
  id: string;
  transactionId: string;
  amount: number;
  location: string;
  timestamp: string;
  riskScore: number;
  reason: string;
}

const mockAlerts: FraudAlert[] = [
  {
    id: "ALERT-001",
    transactionId: "TXN-002",
    amount: 8750.00,
    location: "Lagos, Nigeria",
    timestamp: "2025-01-12 14:21",
    riskScore: 94,
    reason: "Unusual location and high amount",
  },
  {
    id: "ALERT-002",
    transactionId: "TXN-004",
    amount: 15000.00,
    location: "Moscow, Russia",
    timestamp: "2025-01-12 14:18",
    riskScore: 89,
    reason: "High-risk location and amount exceeds threshold",
  },
  {
    id: "ALERT-003",
    transactionId: "TXN-008",
    amount: 25000.00,
    location: "Unknown",
    timestamp: "2025-01-12 14:10",
    riskScore: 98,
    reason: "Unknown location, extremely high amount",
  },
];

const AlertCard = ({ alert }: { alert: FraudAlert }) => {
  return (
    <Card className="p-6 border-l-4 border-l-danger hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-danger/10 text-danger">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{alert.transactionId}</h3>
            <p className="text-sm text-muted-foreground">{alert.id}</p>
          </div>
        </div>
        <Badge className="bg-danger/10 text-danger hover:bg-danger/20">
          Risk: {alert.riskScore}%
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">${alert.amount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{alert.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{alert.timestamp}</span>
        </div>
      </div>

      <div className="p-3 bg-muted/50 rounded-lg mb-4">
        <p className="text-sm font-medium">Reason for flagging:</p>
        <p className="text-sm text-muted-foreground mt-1">{alert.reason}</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Review
        </Button>
        <Button variant="default" size="sm" className="flex-1">
          Block Transaction
        </Button>
      </div>
    </Card>
  );
};

export const FraudAlerts = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Fraud Alerts</h2>
        <p className="text-muted-foreground">High-risk transactions requiring immediate attention</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
};
