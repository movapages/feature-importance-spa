import React, { useEffect, useState } from 'react';
import { DatasetService } from '../services/DatasetService';
import Chart from 'chart.js/auto';

const FeatureWeight = () => {
  const [weights, setWeights] = useState([]);

  // Retrieve feature weights from DatasetService
  useEffect(() => {
    const featureWeights = DatasetService.getFeatureWeights();
    if (featureWeights && featureWeights.length > 0) {
      setWeights(featureWeights);
    } else {
      console.warn('Feature weights are empty or invalid.');
    }
  }, []);

  // Render the chart when weights are available
  useEffect(() => {
    if (weights.length > 0) {
      const ctx = document.getElementById('featureWeightChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: weights.map((fw) => fw.feature),
          datasets: [
            {
              label: 'Feature Importance (Normalized)',
              data: weights.map((fw) => fw.weight),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Features',
              },
              ticks: {
                autoSkip: false,
              },
            },
            y: {
              title: {
                display: true,
                text: 'Importance',
              },
            },
          },
        },
      });
    }
  }, [weights]);

  return (
    <div>
      <h2>Feature Importance Analysis</h2>
      {weights.length > 0 ? (
        <canvas id="featureWeightChart" width="400" height="200"></canvas>
      ) : (
        <p className="text-gray-500">
          No feature weights available. Please train the model first.
        </p>
      )}
    </div>
  );
};

export default FeatureWeight;
