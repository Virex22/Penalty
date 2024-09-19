type TeamScore = {
    teamA: number;
    teamB: number;
  };
  
  type HistoryEntry = {
    round: number;
    score: TeamScore;
    teamAChange: number;
    teamBChange: number;
  };
  
  const updateScore = (
    currentScore: TeamScore,
    teamAShot: boolean,
    teamBShot: boolean
  ): TeamScore => ({
    teamA: currentScore.teamA + (teamAShot ? 1 : 0),
    teamB: currentScore.teamB + (teamBShot ? 1 : 0),
  });
  
  const isGameDecided = (
    score: TeamScore,
    remainingRounds: number
  ): boolean => {
    const scoreDiff = Math.abs(score.teamA - score.teamB);
    return scoreDiff > remainingRounds+1;
  };
  
  
  const simulateRounds = (
    currentRound: number,
    totalRounds: number,
    score: TeamScore,
    shotResults: [boolean, boolean][],
    history: HistoryEntry[] = []
  ): HistoryEntry[] => {
    if (currentRound > totalRounds || isGameDecided(score, totalRounds - currentRound) ) {
      return history;
    }
  
    const [teamAShot, teamBShot] = shotResults[currentRound - 1];
    const newScore = updateScore(score, teamAShot, teamBShot);
  
    const roundEntry: HistoryEntry = {
      round: currentRound,
      score: newScore,
      teamAChange: teamAShot ? 1 : 0,
      teamBChange: teamBShot ? 1 : 0,
    };
  
    return simulateRounds(
      currentRound + 1,
      totalRounds,
      newScore,
      shotResults,
      [...history, roundEntry]
    );
  };
  
  const needExtraRounds = (history: HistoryEntry[]): boolean => {
    const finalScore = history[history.length - 1].score;
    return finalScore.teamA === finalScore.teamB && history.length <= 50;
  };
  
  const simulateShot = (randomGenerator: () => number): boolean => randomGenerator() < 0.5;

  const simulateExtraRounds = (
    currentRound: number,
    score: TeamScore,
    seed: number,
    shotResults: [boolean, boolean][],
    history: HistoryEntry[] = []
  ): HistoryEntry[] => {
    const [teamAShot, teamBShot] = shotResults[0];
    const newScore = updateScore(score, teamAShot, teamBShot);
  
    const roundEntry: HistoryEntry = {
      round: currentRound,
      score: newScore,
      teamAChange: teamAShot ? 1 : 0,
      teamBChange: teamBShot ? 1 : 0,
    };
  
    if (newScore.teamA !== newScore.teamB || currentRound > 50) {
      return [...history, roundEntry];
    }
  
    return simulateExtraRounds(
      currentRound + 1,
      newScore,
      seed,
      [[simulateShot(createSeededRandom(seed)), simulateShot(createSeededRandom(seed))]],
      [...history, roundEntry]
    );
  };
  
  
  const createSeededRandom = (seed: number): () => number => {
    let currentSeed = seed;
    return () => {
      const x = Math.sin(currentSeed++) * 10000;
      return x - Math.floor(x);
    };
  };
  
  const simulatePenaltyShootout = (seed: number): HistoryEntry[] => {
    const totalRounds = 5;
    const randomGenerator = createSeededRandom(seed);
  
    const shotResults: [boolean, boolean][] = Array.from({ length: totalRounds }, () => [
      simulateShot(randomGenerator),
      simulateShot(randomGenerator),
    ]);
  
    let history = simulateRounds(1, totalRounds, { teamA: 0, teamB: 0 }, shotResults);
  
    while (needExtraRounds(history)) {
      const extraShotResults: [boolean, boolean][] = [[simulateShot(randomGenerator), simulateShot(randomGenerator)]];
      const extraRoundsHistory = simulateExtraRounds(
        history.length + 1,
        history[history.length - 1].score,
        seed,
        extraShotResults
      );
      history = [...history, ...extraRoundsHistory];
    }
  
    return history;
  };
  
  const displayHistory = (history: HistoryEntry[]): void => {
    history.forEach((entry) => {
      console.log(
        `Tir ${entry.round} | Score : ${entry.score.teamA}/${entry.score.teamB} (équipe A : +${entry.teamAChange}, équipe B : +${entry.teamBChange})`
      );
    });
  
    const winner =
      history[history.length - 1].score.teamA >
      history[history.length - 1].score.teamB
        ? "Equipe A"
        : "Equipe B";
    console.log(`Victoire : ${winner}`);
  };
  
export { simulatePenaltyShootout, displayHistory };
  