import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PredictionResponse } from "@/services/exoplanetApi";
import { Telescope, Brain, BarChart3, TrendingUp } from "lucide-react";

interface PredictionResultsProps {
  results: PredictionResponse;
}

export const PredictionResults = ({ results }: PredictionResultsProps) => {
  const isExoplanet = results.prediction === "Exoplanet";

  return (
    <div className="space-y-6">
      {/* Main Prediction Card */}
      <Card className="stellar-border cosmic-glow bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Telescope className="w-6 h-6 text-primary" />
              Detection Result
            </span>
            <Badge 
              variant={isExoplanet ? "default" : "secondary"}
              className={isExoplanet ? "bg-gradient-stellar text-white px-4 py-1 text-lg" : "px-4 py-1 text-lg"}
            >
              {results.prediction}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Confidence */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Confidence</span>
              <span className="text-2xl font-bold text-primary">
                {(results.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={results.confidence * 100} className="h-3" />
          </div>

          {/* Model Confidences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 rounded-lg bg-background/50 stellar-border">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Brain className="w-4 h-4 text-stellar-accent" />
                CNN Model
              </div>
              <div className="text-2xl font-bold text-stellar-accent">
                {(results.cnn_confidence * 100).toFixed(1)}%
              </div>
              <Progress value={results.cnn_confidence * 100} className="h-2" />
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-background/50 stellar-border">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="w-4 h-4 text-accent" />
                LightGBM Model
              </div>
              <div className="text-2xl font-bold text-accent">
                {(results.lgb_confidence * 100).toFixed(1)}%
              </div>
              <Progress value={results.lgb_confidence * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Importance */}
      <Card className="stellar-border cosmic-glow bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Feature Importance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(results.feature_importance)
              .sort(([, a], [, b]) => b - a)
              .map(([feature, importance]) => (
                <div key={feature} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">
                      {feature.replace(/_/g, " ")}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {(importance * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={importance * 100} className="h-2" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Visualizations */}
      {results.visualizations && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="stellar-border cosmic-glow bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Light Curve Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={results.visualizations.light_curve}
                alt="Light Curve"
                className="w-full rounded-lg border border-border"
              />
            </CardContent>
          </Card>

          <Card className="stellar-border cosmic-glow bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>SHAP Feature Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={results.visualizations.shap_plot}
                alt="SHAP Plot"
                className="w-full rounded-lg border border-border"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
