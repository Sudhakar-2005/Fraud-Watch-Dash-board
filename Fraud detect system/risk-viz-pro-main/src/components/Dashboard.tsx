import { Card } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const MetricCard = ({ title, value, change, icon, variant = "default" }: MetricCardProps) => {
  const variantClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {change && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${variantClasses[variant]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Fraud Detection Dashboard</h1>
        <p className="text-muted-foreground">Monitor transactions and detect fraudulent activity in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Transactions"
          value="12,458"
          change="+12.5% from last month"
          icon={<Shield className="h-6 w-6" />}
          variant="default"
        />
        <MetricCard
          title="Fraud Detected"
          value="147"
          change="+2.3% from last month"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="danger"
        />
        <MetricCard
          title="Legitimate"
          value="12,311"
          change="+12.8% from last month"
          icon={<CheckCircle className="h-6 w-6" />}
          variant="success"
        />
        <MetricCard
          title="Success Rate"
          value="98.8%"
          change="+0.2% from last month"
          icon={<TrendingUp className="h-6 w-6" />}
          variant="success"
        />
      </div>
    </div>
  );
};
