import { simulatePenaltyShootout, displayHistory } from './penalty';

//seed 42 -> égalité possible visible au round 4
//seed 23 -> continue jusqu'à la fin
//seed 6 -> on fait 6 rounds
//protection contre les seeds répétitifs (ex seed 7)

const seed = 7;

const history = simulatePenaltyShootout(seed);
displayHistory(history);
