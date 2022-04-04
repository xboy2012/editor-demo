export type Stage = 'home' | 'form' | 'success';

export interface StoreType {
  stage: Stage;
  setStage: (stage: Stage) => void;
}
