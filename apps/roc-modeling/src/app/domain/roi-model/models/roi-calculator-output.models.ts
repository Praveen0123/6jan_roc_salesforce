import { RoiCalculatorOutput } from '@gql';

/**
 * Interface for the 'RoiCalculatorOutputs' data
 */
export interface RoiCalculatorOutputModel
{
  goalState: RoiCalculatorOutput;
  currentState: RoiCalculatorOutput;
}
