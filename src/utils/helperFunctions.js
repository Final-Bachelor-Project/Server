import RBO from 'rbo';

const compareArrays = (listA, listB) => {
  const p = 0.7;
  const rbo = new RBO(p);

  if (listA.length === 0 || listB.length === 0) {
    return 0;
  }

  const result = rbo.calculate(listA, listB);
  return result;
};

const caculateAverageScore = (scoreA, scoreB) => {
  const score = (scoreA + scoreB) / 2;
  return parseFloat(score * 100).toFixed();
};

export default {
  compareArrays,
  caculateAverageScore
};
