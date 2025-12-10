import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const transactionVolumeData = [
  { date: "Jan 6", transactions: 420, fraud: 8 },
  { date: "Jan 7", transactions: 380, fraud: 12 },
  { date: "Jan 8", transactions: 450, fraud: 6 },
  { date: "Jan 9", transactions: 520, fraud: 15 },
  { date: "Jan 10", transactions: 480, fraud: 9 },
  { date: "Jan 11", transactions: 510, fraud: 11 },
  { date: "Jan 12", transactions: 490, fraud: 14 },
];

const fraudRateData = [
  { month: "Jul", rate: 1.2 },
  { month: "Aug", rate: 1.5 },
  { month: "Sep", rate: 1.1 },
  { month: "Oct", rate: 1.8 },
  { month: "Nov", rate: 1.3 },
  { month: "Dec", rate: 1.6 },
  { month: "Jan", rate: 1.2 },
];

const fraudPatternsData = [
  { name: "Unusual Location", value: 35 },
  { name: "High Amount", value: 28 },
  { name: "Suspicious Timing", value: 18 },
  { name: "Multiple Attempts", value: 12 },
  { name: "Other", value: 7 },
];

const COLORS = ["hsl(var(--danger))", "hsl(var(--warning))", "hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--muted))"];

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Analytics</h2>
        <p className="text-muted-foreground">Comprehensive insights into transaction patterns and fraud detection</p>
      </div>

      <Tabs defaultValue="volume" className="space-y-6">
        <TabsList>
          <TabsTrigger value="volume">Transaction Volume</TabsTrigger>
          <TabsTrigger value="rate">Fraud Rate</TabsTrigger>
          <TabsTrigger value="patterns">Fraud Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Transaction Volume</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={transactionVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="transactions"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Total Transactions"
                />
                <Line
                  type="monotone"
                  dataKey="fraud"
                  stroke="hsl(var(--danger))"
                  strokeWidth={2}
                  name="Fraudulent"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="rate" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fraud Rate Over Time</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={fraudRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Bar dataKey="rate" fill="hsl(var(--warning))" name="Fraud Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Common Fraud Patterns</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={fraudPatternsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {fraudPatternsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
