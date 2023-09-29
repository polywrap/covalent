import { Box, JSON } from "@polywrap/wasm-as";

import { COVALENT_API } from "../constants";
import {
  buildUrl,
  getGlobalUrlParams,
  getNullableArrayProperty,
  getNullableObjectProperty,
  getStringProperty,
  parseJsonPagination,
  parseJsonTransfersPerTxns,
} from "../utils";
import {
  Options,
  TransfersList,
  Args_getTokenTransfers,
  Env,
  Http_ResponseType,
  Http_Module,
  Ethers_Module,
} from "../wrap";
import { getNetwork } from "../networks";

export function getTokenTransfers(
  args: Args_getTokenTransfers,
  env: Env,
): TransfersList {
  const chainId = Ethers_Module.getChainId({connection: null}).unwrap();
  const network = getNetwork(chainId);

  const url = buildUrl([
    COVALENT_API,
    "v1",
    network.chainId,
    "address",
    args.accountAddress,
    "transfers_v2",
  ]);

  const params = getGlobalUrlParams(env.apiKey, env.vsCurrency, env.format);
  params.set("contract-address", args.tokenAddress);

  if (args.options) {
    const options = args.options as Options;
    const paginationOptions = options.pagination;
    if (paginationOptions) {
      params.set("page-number", paginationOptions.page.toString());
      params.set("page-size", paginationOptions.perPage.toString());
    }

    const blockRangeOptions = options.blockRange;
    if (blockRangeOptions) {
      const startBlockOption: string = blockRangeOptions.startBlock
        ? (blockRangeOptions.startBlock as Box<i32>).unwrap().toString()
        : "0";
      const endBlockOption: string = blockRangeOptions.endBlock
        ? (blockRangeOptions.endBlock as Box<i32>).unwrap().toString()
        : "latest";
      params.set("starting-block", startBlockOption);
      params.set("ending-block", endBlockOption);
    }
  }

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

  if (res.isErr) {
    throw new Error(res.unwrapErr());
  }
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

  return {
    account: getStringProperty(jsonData, "address"),
    chainId: getStringProperty(jsonData, "chain_id"),
    quoteCurrency: getStringProperty(jsonData, "quote_currency"),
    transfers: parseJsonTransfersPerTxns(getNullableArrayProperty(jsonData, "items")),
    pagination: parseJsonPagination(getNullableObjectProperty(jsonData, "pagination")),
    updatedAt: getStringProperty(jsonData, "updated_at"),
    nextUpdateAt: getStringProperty(jsonData, "next_update_at"),
  };
}
