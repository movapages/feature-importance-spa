import { BehaviorSubject } from 'rxjs';

const datasetSubject = new BehaviorSubject([]);
const featureWeightsSubject = new BehaviorSubject([]);
const trainingSummarySubject = new BehaviorSubject({
  epochs: 0,
  finalLoss: 0,
  finalAccuracy: 0,
});

export const DatasetService = {
  setDataset: (data) => datasetSubject.next(data),
  getDataset: () => datasetSubject.value,
  dataset$: datasetSubject.asObservable(),

  setFeatureWeights: (weights) => featureWeightsSubject.next(weights),
  getFeatureWeights: () => featureWeightsSubject.value,
  featureWeights$: featureWeightsSubject.asObservable(),

  setTrainingSummary: (summary) => trainingSummarySubject.next(summary),
  getTrainingSummary: () => trainingSummarySubject.value,
  trainingSummary$: trainingSummarySubject.asObservable(),
};
