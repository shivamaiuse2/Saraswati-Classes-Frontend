export interface Test {
  id: string;
  testNumber: number;
  description: string;
  testLink: string;
}

export interface TestSeries {
  id: string;
  title: string;
  category: string;
  standard: string;
  board: string;
  description: string;
  price: number;
  tests: Test[];
}

