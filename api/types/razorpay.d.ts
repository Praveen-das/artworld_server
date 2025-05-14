interface transfer {
    account: string,
    amount: number,
}

export type Transfer = {
    total_amount: number,
    accounts: Array<transfer>
}