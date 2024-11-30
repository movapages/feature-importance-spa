import React, { useEffect, useState } from 'react';
import { DatasetService } from '../services/DatasetService';

const Summary = () => {
  const [datasetSummary, setDatasetSummary] = useState({});
  const [trainingSummary, setTrainingSummary] = useState({
    epochs: 0,
    finalLoss: 0,
    finalAccuracy: 0,
  });
  const [allFeatures, setAllFeatures] = useState([]);

  useEffect(() => {
    const dataset = DatasetService.getDataset();
    if (dataset.length > 0) {
      const featureKeys = Object.keys(dataset[0]).filter((key) => key !== 'label');
      setDatasetSummary({
        totalRecords: dataset.length,
        totalFeatures: featureKeys.length,
      });
    }

    const summary = DatasetService.getTrainingSummary();
    setTrainingSummary(summary);

    const weights = DatasetService.getFeatureWeights();
    if (weights.length > 0) {
      const validatedWeights = weights.map((fw) => ({
        ...fw,
        weight: typeof fw.weight === 'number' ? fw.weight : 0,
      }));

      const sortedWeights = [...validatedWeights].sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
      setAllFeatures(sortedWeights);
    }
  }, []);

  return (
    <div>
      <h2>Summary</h2>
      <p>Overview of the dataset, training process, and feature importance analysis.</p>

      <div>
        <h3>Dataset Summary</h3>
        <ul>
          <li>Total Records: {datasetSummary.totalRecords}</li>
          <li>Total Features: {datasetSummary.totalFeatures}</li>
        </ul>
      </div>

      <div>
        <h3>Training Summary</h3>
        <ul>
          <li>Total Epochs: {trainingSummary.epochs}</li>
          <li>Final Loss: {trainingSummary.finalLoss.toFixed(4)}</li>
          <li>Final Accuracy: {(trainingSummary.finalAccuracy * 100).toFixed(2)}%</li>
        </ul>
      </div>

      <div>
        <h3>Feature Weights</h3>
        {allFeatures.length > 0 ? (
          <table>
            <thead>
            <tr>
              <th>Feature</th>
              <th>Weight</th>
            </tr>
            </thead>
            <tbody>
            {allFeatures.map((fw, index) => (
              <tr key={index}>
                <td>{fw.feature}</td>
                <td>{fw.weight.toFixed(4)}</td>
              </tr>
            ))}
            </tbody>
          </table>
        ) : (
          <p>No features available.</p>
        )}
      </div>

      <div className="mt-6">
        <h3>Interpreting the Table</h3>
        <p><strong>Key Influencers:</strong></p>
        <ul className="list-disc ml-6">
          <li>
            The features with the largest absolute weights are the most important for the model.
            In your case, <strong>"Triglycerides" (-1.0000)</strong> and <strong>"Previous Heart Problems" (-0.9780)</strong> are highly significant.
          </li>
        </ul>

        <p className="mt-4"><strong>Directionality:</strong></p>
        <ul className="list-disc ml-6">
          <li>
            <strong>Negative weights</strong> (e.g., "Triglycerides" and "Cholesterol") suggest that higher values of these features reduce
            the probability of the target outcome (e.g., a heart attack).
          </li>
          <li>
            <strong>Positive weights</strong> (e.g., "Hemisphere" and "Continent") suggest that higher values increase the probability of the target outcome.
          </li>
        </ul>

        <p className="mt-4"><strong>Possible Relationships:</strong></p>
        <ul className="list-disc ml-6">
          <li>
            <strong>"Alcohol Consumption" (-0.8441):</strong> Suggests that higher alcohol consumption might lower the likelihood of the predicted label. This may require domain-specific verification as it could reflect correlations in the dataset rather than causal relationships.
          </li>
          <li>
            <strong>"Sex" (0.0711):</strong> Suggests that gender has a relatively small influence on the prediction.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Summary;
