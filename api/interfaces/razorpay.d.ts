interface transfer {
  account: string;
  amount: number;
}

export type Transfer = {
  amount: number;
  transfers: Array<transfer>;
};

