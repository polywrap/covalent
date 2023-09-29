import { BigNumber, JSON } from "@polywrap/wasm-as";

import { COVALENT_API } from "../constants";
import {
  buildUrl,
  getBigNumberProperty,
  getGlobalUrlParams,
  getIntegerProperty,
  getNullableBigNumberProperty,
  getNullableStringProperty,
  getStringProperty,
} from "../utils";
import {
  TokenBalance,
  TokenBalancesList,
  Token,
  Args_getTokenBalances,
  Env,
  Http_ResponseType,
  Http_Module,
  Ethers_Module,
} from "../wrap";
import { getNetwork } from "../networks";

export function getTokenBalances(
  args: Args_getTokenBalances,
  env: Env,
): TokenBalancesList {
  const chainId = Ethers_Module.getChainId({connection: null}).unwrap();
  const network = getNetwork(chainId);

  const url = buildUrl([
    COVALENT_API,
    "v1",
    network.chainId,
    "address",
    args.accountAddress,
    "balances_v2",
  ]);

  const params = getGlobalUrlParams(env.apiKey, env.vsCurrency, env.format);

  const res = Http_Module.get({
    url: url,
    request: {
      headers: null,
      urlParams: params,
      responseType: Http_ResponseType.TEXT,
      body: null,
      formData: null,
      timeout: null,
    },
  });
  const response = res.unwrap();

  if (!response || response.status !== 200 || !response.body) {
    const errorMsg =
      response && response.statusText
        ? (response.statusText as string)
        : "An error occurred while fetching data";
    throw new Error(errorMsg);
  }

  const json = JSON.parse(response.body);
  if (!json || !json.isObj) throw new Error("Invalid response");

  const jsonData = (json as JSON.Obj).getObj("data");
  if (!jsonData || !jsonData.isObj) throw new Error("Invalid response body!");

  const jsonItemsArr = jsonData.getArr("items");
  if (!jsonItemsArr || !jsonItemsArr.isArr) throw new Error("Invalid response body!");

  const tokenBalances: Array<TokenBalance> = [];

  const items = jsonItemsArr.valueOf();

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as JSON.Obj;
    const address = getStringProperty(item, "contract_address");
    const name = getStringProperty(item, "contract_name");
    const symbol = getStringProperty(item, "contract_ticker_symbol");
    const decimals = getIntegerProperty<i32>(item, "contract_decimals");
    const logoUrl = getNullableStringProperty(item, "logo_url");
    const token: Token = {
      address: address,
      name: name,
      symbol: symbol,
      decimals: decimals,
      logoUrl: logoUrl,
    }
    const balance = getBigNumberProperty(item, "balance");

    if (!token) continue;
    const tokenBalance: TokenBalance = {
      token: token,
      balance: balance.div(BigNumber.from(10).pow(token.decimals)),
      quote: getNullableBigNumberProperty(item, "quote"),
      quoteRate: getNullableBigNumberProperty(item, "quote_rate"),
    };

    tokenBalances.push(tokenBalance);
  }

  return {
    account: getStringProperty(jsonData, "address").toLowerCase(),
    chainId: getStringProperty(jsonData, "chain_id"),
    tokenBalances: tokenBalances,
  };
}
