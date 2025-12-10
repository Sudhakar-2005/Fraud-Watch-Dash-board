import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SimulationResult {
  prediction: "legitimate" | "fraudulent";
  riskScore: number;
  factors: string[];
}

export const TransactionSimulator = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    if (!amount || !location || !time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to simulate a transaction",
        variant: "destructive",
      });
      return;
    }

    setIsSimulating(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock prediction logic
    const amountNum = parseFloat(amount);
    const highRiskLocations = ["nigeria", "russia", "china"];
    const isHighRiskLocation = highRiskLocations.some((loc) => location.toLowerCase().includes(loc));
    const isHighAmount = amountNum > 5000;

    let riskScore = 10;
    const factors: string[] = [];

    if (isHighAmount) {
      riskScore += 30;
      factors.push("Transaction amount exceeds normal threshold");
    }

    if (isHighRiskLocation) {
      riskScore += 40;
      factors.push("Transaction location flagged as high-risk");
    }

    const hour = parseInt(time.split(":")[0]);
    if (hour < 6 || hour > 22) {
      riskScore += 20;
      factors.push("Unusual transaction time detected");
    }

    if (factors.length === 0) {
      factors.push("Transaction appears normal");
    }

    setResult({
      prediction: riskScore > 60 ? "fraudulent" : "legitimate",
      riskScore: Math.min(riskScore, 99),
      factors,
    });

    setIsSimulating(false);

    toast({
      title: "Simulation Complete",
      description: "Analysis results are displayed below",
    });
  };

  const resetForm = () => {
    setAmount("");
    setLocation("");
    setTime("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Transaction Simulator</h2>
        <p className="text-muted-foreground">Test the fraud detection model with hypothetical transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Transaction Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., New York, NY"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time">Transaction Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSimulate} disabled={isSimulating} className="flex-1">
                {isSimulating ? "Analyzing..." : "Simulate Transaction"}
              </Button>
              <Button onClick={resetForm} variant="outline">
                Reset
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="font-medium">Prediction:</span>
                <Badge
                  className={
                    result.prediction === "legitimate"
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : "bg-danger/10 text-danger hover:bg-danger/20"
                  }
                >
                  {result.prediction.toUpperCase()}
                </Badge>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <span className="font-medium">Risk Score:</span>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex-1 h-3 bg-background rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        result.riskScore > 60
                          ? "bg-danger"
                          : result.riskScore > 30
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                      style={{ width: `${result.riskScore}%` }}
                    />
                  </div>
                  <span className="font-bold text-lg">{result.riskScore}%</span>
                </div>
              </div>

              <div>
                <span className="font-medium block mb-2">Contributing Factors:</span>
                <ul className="space-y-2">
                  {result.factors.map((factor, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>Enter transaction details and click "Simulate" to see results</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
