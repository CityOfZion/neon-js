import { u, wallet } from "@cityofzion/neon-core";
import { DataProvider, PastTransaction, Provider } from "./common";
export default class ApiBalancer implements Provider {
    leftProvider: DataProvider;
    rightProvider: DataProvider;
    readonly name: string;
    private _preference;
    preference: number;
    private _frozen;
    frozen: boolean;
    constructor(leftProvider: DataProvider, rightProvider: DataProvider, preference?: number, frozen?: boolean);
    getRPCEndpoint(net: string): Promise<string>;
    getBalance(net: string, address: string): Promise<wallet.Balance>;
    getClaims(net: string, address: string): Promise<wallet.Claims>;
    getMaxClaimAmount(net: string, address: string): Promise<u.Fixed8>;
    getHeight(net: string): Promise<number>;
    getTransactionHistory(net: string, address: string): Promise<PastTransaction[]>;
    /**
     * Load balances a API call according to the API switch. Selects the appropriate provider and sends the call towards it.
     * @param func - The API call to load balance function
     */
    private loadBalance;
    private increaseLeftWeight;
    private increaseRightWeight;
}
//# sourceMappingURL=apiBalancer.d.ts.map