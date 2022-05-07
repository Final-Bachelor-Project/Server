import RBO from 'rbo';

const comepareArrays = (listA, listB) => {
  const p = 0.5;
  const rbo = new RBO(p);

  if (listA.length === 0 || listB.length === 0) {
    return 0;
  }

  const result = rbo.calculate(listA, listB);
  return result;
};

const caculateAverageScore = (scoreA, scoreB) => {
  const score = (scoreA + scoreB) / 2;
  return score * 100;
};

export default {
  comepareArrays,
  caculateAverageScore
};
