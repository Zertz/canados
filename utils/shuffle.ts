function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function shuffle(input: any[], limit = input.length) {
  const inputArray = [...input];
  const shuffledArray: any[] = [];

  for (let i = 0; i < limit; i += 1) {
    const randomInt = getRandomInt(inputArray.length);
    const lastValue = inputArray[inputArray.length - 1];
    const [randomValue] = inputArray.splice(randomInt, 1, lastValue);

    shuffledArray.push(randomValue);
    inputArray.pop();
  }

  return shuffledArray;
}
