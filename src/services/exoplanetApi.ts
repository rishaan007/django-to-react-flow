export interface PredictionRequest {
  prediction: "Exoplanet" | "Not Exoplanet";
  confidence: number;
  cnn_confidence: number;
  lgb_confidence: number;
  feature_importance: Record<string, number>;
  key_features: string[];
  light_curve_data: {
    x: number[];
    y: number[];
  };
  shap_values: {
    values: number[];
    features: string[];
  };
}

export interface PredictionResponse {
  prediction: "Exoplanet" | "Not Exoplanet";
  confidence: number;
  cnn_confidence: number;
  lgb_confidence: number;
  feature_importance: Record<string, number>;
  key_features: string[];
  visualizations: {
    light_curve: string;
    shap_plot: string;
  };
  error: string | null;
}

const API_BASE_URL = "http://localhost:8000/api/exoplanet";

export const predictExoplanet = async (
  data: PredictionRequest
): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}: Request failed`);
    }

    if (result.error !== null) {
      throw new Error(`API Error: ${result.error}`);
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error: Failed to connect to API");
  }
};

// Sample test data for testing
export const sampleTestData: PredictionRequest = {
  prediction: "Exoplanet",
  confidence: 0.85,
  cnn_confidence: 0.82,
  lgb_confidence: 0.88,
  feature_importance: {
    transit_depth: 0.35,
    duration: 0.28,
    period: 0.22,
    snr: 0.15,
  },
  key_features: ["transit_depth", "duration", "period", "snr"],
  light_curve_data: {
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    y: [1.0, 0.99, 0.98, 0.85, 0.82, 0.8, 0.84, 0.97, 0.99, 1.0, 0.99, 1.0, 0.98],
  },
  shap_values: {
    values: [0.35, 0.28, 0.22, 0.15, -0.05],
    features: ["transit_depth", "duration", "period", "snr", "noise_level"],
  },
};
