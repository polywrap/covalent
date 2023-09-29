import * as Functions from "./functions";
import {
  Args_getTokenBalances,
  Args_getTokenTransfers,
  Args_getTransactions,
  Env,
  ModuleBase,
  TokenBalancesList,
  TransactionsList,
  TransfersList,
} from "./wrap";

export class Module extends ModuleBase {
  getTokenBalances(args: Args_getTokenBalances, env: Env): TokenBalancesList {
    return Functions.getTokenBalances(args, env);
  }

  getTokenTransfers(args: Args_getTokenTransfers, env: Env): TransfersList {
    return Functions.getTokenTransfers(args, env);
  }

  getTransactions(args: Args_getTransactions, env: Env): TransactionsList {
    return Functions.getTransactions(args, env);
  }
}
