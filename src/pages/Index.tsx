import { useState } from "react";
import { PredictionForm } from "@/components/PredictionForm";
import { PredictionResults } from "@/components/PredictionResults";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { predictExoplanet, PredictionRequest, PredictionResponse } from "@/services/exoplanetApi";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";

const Index = () => {
  const [results, setResults] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PredictionRequest) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await predictExoplanet(data);
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              Cosmic Lens Detect
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced exoplanet detection powered by machine learning. Analyze light curves and 
            predict planetary transits with ensemble model insights.
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Form */}
          <div className="space-y-6">
            <PredictionForm onSubmit={handleSubmit} isLoading={loading} />
            
            {/* Info Card */}
            <Alert className="stellar-border bg-card/30 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>Backend Status:</strong> Ensure Django server is running at{" "}
                <code className="text-primary">http://localhost:8000</code>
              </AlertDescription>
            </Alert>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {loading && (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-muted-foreground">Analyzing prediction data...</p>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="stellar-border">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {results && !loading && <PredictionResults results={results} />}

            {!loading && !error && !results && (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-8">
                <Sparkles className="w-16 h-16 text-primary/50" />
                <p className="text-muted-foreground">
                  Submit your ML model predictions to see detailed analysis and visualizations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
