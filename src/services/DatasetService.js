import { BehaviorSubject } from 'rxjs';
// CSV data: https://github.com/kittenpub/database-repository/blob/main/heart_attack_prediction_dataset.csv

// Subjects for storing and sharing data
const datasetSubject = new BehaviorSubject([]);
const featureWeightsSubject = new BehaviorSubject([]);
const trainingSummarySubject = new BehaviorSubject({
  epochs: 0,
  finalLoss: 0,
  finalAccuracy: 0,
});

export const DatasetService = {
  // Dataset methods
  setDataset: (data) => datasetSubject.next(data),
  getDataset: () => datasetSubject.value,
  dataset$: datasetSubject.asObservable(),

  // Feature weights methods
  setFeatureWeights: (weights) => {
    featureWeightsSubject.next(weights);
    console.log('Feature Weights Updated in Service:', weights);
  },
  getFeatureWeights: () => featureWeightsSubject.value,
  featureWeights$: featureWeightsSubject.asObservable(),

  // Training summary methods
  setTrainingSummary: (summary) => {
    trainingSummarySubject.next(summary);
    console.log('Training Summary Updated in Service:', summary);
  },
  getTrainingSummary: () => trainingSummarySubject.value,
  trainingSummary$: trainingSummarySubject.asObservable(),
};
