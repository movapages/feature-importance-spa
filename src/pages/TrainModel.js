import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { DatasetService } from '../services/DatasetService';

const TrainModel = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [trainingLogs, setTrainingLogs] = useState([]);

  const preprocessData = (data) => {
    const featureKeys = Object.keys(data[0]).filter((key) => key !== 'label');
    const inputs = data.map((row) =>
      featureKeys.map((key) => parseFloat(row[key]) || 0)
    );

    const maxValues = inputs[0].map((_, colIndex) =>
      Math.max(...inputs.map((row) => row[colIndex]))
    );
    const normalizedInputs = inputs.map((row) =>
      row.map((value, colIndex) => (maxValues[colIndex] > 0 ? value / maxValues[colIndex] : 0))
    );

    const labels = data.map((row) => parseFloat(row['label']) || 0);
    return {
      inputTensor: tf.tensor2d(normalizedInputs),
      labelTensor: tf.tensor2d(labels, [labels.length, 1]),
    };
  };

  const startTraining = async () => {
    const dataset = DatasetService.getDataset();
    if (!dataset || dataset.length === 0) {
      setMessage('No dataset found! Please upload data first.');
      return;
    }

    setIsTraining(true);
    setProgress(0);
    setMessage('');
    setTrainingLogs([]); // Clear previous logs

    try {
      const { inputTensor, labelTensor } = preprocessData(dataset);

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 1, activation: 'sigmoid', inputShape: [inputTensor.shape[1]] }));
      model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

      let trainingSummary = { epochs: 10, finalLoss: 0, finalAccuracy: 0 };
      await model.fit(inputTensor, labelTensor, {
        epochs: 10,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            setProgress(((epoch + 1) / 10) * 100);
            setTrainingLogs((prevLogs) => [
              ...prevLogs,
              { epoch: epoch + 1, loss: logs.loss.toFixed(4), accuracy: (logs.acc * 100).toFixed(2) },
            ]);
            if (epoch === 9) {
              trainingSummary.finalLoss = logs.loss;
              trainingSummary.finalAccuracy = logs.acc;
            }
          },
        },
      });

      // Extract feature weights
      const weights = model.getWeights();
      const weightValues = await weights[0].array();
      const featureNames = Object.keys(dataset[0]).filter((key) => key !== 'label');

      const featureWeights = featureNames.map((name, index) => ({
        feature: name,
        weight: weightValues[index]?.[0] || 0,
      }));

      // Store weights and training summary
      DatasetService.setFeatureWeights(featureWeights);
      DatasetService.setTrainingSummary(trainingSummary);

      setMessage('Training Complete!');
    } catch (err) {
      setMessage(`Training failed: ${err.message}`);
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
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Start Training
        </button>
      )}

      {isTraining && (
        <div>
          <p>Training Progress: {progress.toFixed(0)}%</p>
          <div className="w-full bg-gray-200 h-4 mt-2">
            <div className="bg-green-500 h-4" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {trainingLogs.length > 0 && (
        <div className="mt-4">
          <h3>Training Logs</h3>
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Epoch</th>
              <th className="border border-gray-300 px-4 py-2">Loss</th>
              <th className="border border-gray-300 px-4 py-2">Accuracy (%)</th>
            </tr>
            </thead>
            <tbody>
            {trainingLogs.map((log) => (
              <tr key={log.epoch}>
                <td className="border border-gray-300 px-4 py-2 text-center">{log.epoch}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{log.loss}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{log.accuracy}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrainModel;
