import { FOLLOW_UP_QUESTIONS, GROUP_PATH_FOR_TYPE } from '../data/followUps.js';

/**
 * The follow-up questions this trip needs, in order:
 * two for the timing path, two for the group type, then the secret hope.
 */
export const getFollowUpSteps = (trip) => [
  ...(FOLLOW_UP_QUESTIONS.byTiming[trip.timing] ?? FOLLOW_UP_QUESTIONS.byTiming.dreaming),
  ...FOLLOW_UP_QUESTIONS.byGroup[GROUP_PATH_FOR_TYPE[trip.type] ?? 'bigfamily'],
  FOLLOW_UP_QUESTIONS.hope,
];
