export type SieveStep = {
  kind: "start" | "prime" | "mark" | "complete";
  isPrime: boolean[];
  markedBy: Array<number | null>;
  activeNumber: number | null;
  primes: number[];
  codeLine: number;
  message: { vi: string; en: string };
};

export type SieveTrace = {
  limit: number;
  steps: SieveStep[];
  primes: number[];
};

function snapshot(
  kind: SieveStep["kind"],
  isPrime: boolean[],
  markedBy: Array<number | null>,
  activeNumber: number | null,
  codeLine: number,
  message: SieveStep["message"],
): SieveStep {
  return {
    kind,
    isPrime: [...isPrime],
    markedBy: [...markedBy],
    activeNumber,
    primes: isPrime.flatMap((prime, number) => prime ? [number] : []),
    codeLine,
    message,
  };
}

export function runSieve(limit: number): SieveTrace {
  if (!Number.isInteger(limit) || limit < 2 || limit > 100) throw new Error("Limit must be between 2 and 100.");
  const isPrime = Array(limit + 1).fill(true) as boolean[];
  const markedBy = Array(limit + 1).fill(null) as Array<number | null>;
  isPrime[0] = false;
  isPrime[1] = false;
  const steps: SieveStep[] = [snapshot("start", isPrime, markedBy, null, 1, {
    vi: `Giả sử các số từ 2 đến ${limit} đều là số nguyên tố.`,
    en: `Assume every number from 2 through ${limit} is prime.`,
  })];

  for (let prime = 2; prime * prime <= limit; prime += 1) {
    if (!isPrime[prime]) continue;
    steps.push(snapshot("prime", isPrime, markedBy, prime, 3, {
      vi: `${prime} chưa bị gạch nên là số nguyên tố. Bắt đầu từ ${prime}² = ${prime * prime}.`,
      en: `${prime} is still unmarked, so it is prime. Start from ${prime}² = ${prime * prime}.`,
    }));
    for (let multiple = prime * prime; multiple <= limit; multiple += prime) {
      if (!isPrime[multiple]) continue;
      isPrime[multiple] = false;
      markedBy[multiple] = prime;
      steps.push(snapshot("mark", isPrime, markedBy, multiple, 6, {
        vi: `Gạch ${multiple} vì ${multiple} chia hết cho ${prime}.`,
        en: `Mark ${multiple} composite because it is divisible by ${prime}.`,
      }));
    }
  }

  const primes = isPrime.flatMap((prime, number) => prime ? [number] : []);
  steps.push(snapshot("complete", isPrime, markedBy, null, 8, {
    vi: `Hoàn tất: tìm được ${primes.length} số nguyên tố không vượt quá ${limit}.`,
    en: `Complete: found ${primes.length} primes not exceeding ${limit}.`,
  }));
  return { limit, steps, primes };
}
