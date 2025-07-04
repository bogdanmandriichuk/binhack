import { useMemo } from 'react';

/**
 * A hook to calculate progress percentage and calibration status.
 * @param {number} stepsMade - The number of steps completed.
 * @param {number} maxSteps - The total number of steps required for completion.
 * @returns {{progress: number, isCalibrated: boolean}}
 */
export const useProgress = (stepsMade, maxSteps) => {
  const progress = useMemo(() => {
    if (maxSteps <= 0) return 0;
    return Math.min((stepsMade / maxSteps) * 100, 100);
  }, [stepsMade, maxSteps]);

  const isCalibrated = progress >= 100;

  return { progress, isCalibrated };
};