import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { DatasetService } from '../services/DatasetService';

const TrainModel = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dataset, setDataset] = useState([]);
  const [message, setMessage] = useState('');
  const [epochMetrics, setEpochMetrics] = useState([]); // Stores metrics for each epoch

  useEffect(() => {
    const subscription = DatasetService.dataset$.subscribe((data) => {
      setDataset(data);
    });
    return () => subscription.unsubscribe();
  }, []);

  const preprocessData = (data) => {
    const featureKeys = Object.keys(data[0]).filter((key) => key !== 'label');
    const inputs = data.map((row) =>
      featureKeys.map((key) => {
        const value = parseFloat(row[key]);
        return isNaN(value) ? 0 : value; // Replace NaN with 0
      })
    );

    // Normalize inputs to range [0, 1]
    const maxValues = inputs[0].map((_, colIndex) =>
      Math.max(...inputs.map((row) => row[colIndex]))
    );
    const normalizedInputs = inputs.map((row) =>
      row.map((value, colIndex) => (maxValues[colIndex] > 0 ? value / maxValues[colIndex] : 0))
    );

    const labels = data.map((row) => {
      const label = parseFloat(row['label']);
      return label === 1 || label === 0 ? label : 0; // Ensure binary labels
    });

    return {
      inputTensor: tf.tensor2d(normalizedInputs),
      labelTensor: tf.tensor2d(labels, [labels.length, 1]),
    };
  };

  const startTraining = async () => {
    if (!Array.isArray(dataset) || dataset.length === 0) {
      setMessage('Dataset is invalid or empty! Please upload a valid dataset.');
      return;
    }

    setIsTraining(true);
    setProgress(0);
    setMessage('');
    setEpochMetrics([]); // Reset epoch metrics

    try {
      const { inputTensor, labelTensor } = preprocessData(dataset);

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 1, activation: 'sigmoid', inputShape: [inputTensor.shape[1]] }));
      model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

      await model.fit(inputTensor, labelTensor, {
        epochs: 10,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss}, Accuracy = ${logs.acc}`);
            setProgress(((epoch + 1) / 10) * 100);

            // Update epoch metrics
            setEpochMetrics((prevMetrics) => [
              ...prevMetrics,
              { epoch: epoch + 1, loss: logs.loss, accuracy: logs.acc || 0 },
            ]);
          },
        },
      });

      setMessage('Training Complete!');
      DatasetService.setTrainingSummary({
        epochs: 10,
        finalLoss: epochMetrics[epochMetrics.length - 1]?.loss || 0,
        finalAccuracy: epochMetrics[epochMetrics.length - 1]?.accuracy || 0,
      });
    } catch (error) {
      console.error('Training Error:', error);
      setMessage(`Training failed: ${error.message}`);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div>
      <h2>Model Training</h2>
      <p>Train your logistic regression model using the uploaded dataset.</p>

      {message && <p className="text-red-500">{message}</p>}

      {!isTraining && (
        <button
          onClick={startTraining}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Start Training
        </button>
      )}

      {isTraining && (
        <div>
          <p>Training Progress: {progress.toFixed(0)}%</p>
          <div className="w-full bg-gray-200 h-4 mt-2">
            <div className="bg-blue-500 h-4" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3>Epoch Metrics</h3>
        {epochMetrics.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Epoch</th>
              <th className="border border-gray-300 px-4 py-2">Loss</th>
              <th className="border border-gray-300 px-4 py-2">Accuracy</th>
            </tr>
            </thead>
            <tbody>
            {epochMetrics.map((metric, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{metric.epoch}</td>
                <td className="border border-gray-300 px-4 py-2">{metric.loss.toFixed(4)}</td>
                <td className="border border-gray-300 px-4 py-2">{(metric.accuracy * 100).toFixed(2)}%</td>
              </tr>
            ))}
            </tbody>
          </table>
        ) : (
          <p>No metrics available yet.</p>
        )}
      </div>
    </div>
  );
};

export default TrainModel;
