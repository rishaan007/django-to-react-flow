import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Sparkles } from "lucide-react";
import { PredictionRequest, sampleTestData } from "@/services/exoplanetApi";

interface PredictionFormProps {
  onSubmit: (data: PredictionRequest) => void;
  isLoading: boolean;
}

export const PredictionForm = ({ onSubmit, isLoading }: PredictionFormProps) => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    try {
      const parsed = JSON.parse(jsonInput);
      
      // Basic validation
      if (!parsed.prediction || !["Exoplanet", "Not Exoplanet"].includes(parsed.prediction)) {
        throw new Error("Invalid prediction value. Must be 'Exoplanet' or 'Not Exoplanet'");
      }
      
      if (typeof parsed.confidence !== "number" || parsed.confidence < 0 || parsed.confidence > 1) {
        throw new Error("Confidence must be a number between 0 and 1");
      }

      onSubmit(parsed as PredictionRequest);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
    }
  };

  const loadSampleData = () => {
    setJsonInput(JSON.stringify(sampleTestData, null, 2));
    setError(null);
  };

  return (
    <Card className="stellar-border cosmic-glow bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="w-6 h-6 text-primary" />
          Model Prediction Input
        </CardTitle>
        <CardDescription>
          Submit your ML model output for exoplanet detection analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prediction Data (JSON)</label>
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"prediction": "Exoplanet", "confidence": 0.85, ...}'
            className="min-h-[300px] font-mono text-sm bg-background/50"
            disabled={isLoading}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !jsonInput.trim()}
            className="flex-1 bg-gradient-stellar hover:opacity-90"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isLoading ? "Processing..." : "Analyze Prediction"}
          </Button>
          <Button
            onClick={loadSampleData}
            variant="outline"
            disabled={isLoading}
            className="stellar-border"
          >
            Load Sample
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
