import { Covalent, Covalent_TokenBalance } from "../types";

jest.setTimeout(800000);

describe("Ethereum", () => {
  let covalent: Covalent;
  let wrapperUri: string;

  beforeAll(async () => {
    // deploy api
    wrapperUri = `fs/${__dirname}/../../../build`;
    covalent = new Covalent(undefined, {
      apiKey: process.env.COVALENT_API_KEY,
      vsCurrency: "usd",
      format: 0
    }, wrapperUri);
  });

  describe("getTokenBalances", () => {
    test("0x9bA00D6856a4eDF4665BcA2C2309936572473B7E", async () => {
      const result = await covalent.getTokenBalances(
        {
          accountAddress: "0x9bA00D6856a4eDF4665BcA2C2309936572473B7E",
        }
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      const tokenBalances = result.value.tokenBalances;
      const usdcBalance = (tokenBalances.find(
        (x) => x.token.address === "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      ) as unknown) as Covalent_TokenBalance;
      expect(usdcBalance).toBeDefined();
      expect(+usdcBalance.balance).toBeGreaterThan(0);
      expect(+(usdcBalance.quote || 0)).toBeGreaterThan(0);
      expect(+(usdcBalance.quoteRate || 0)).toBeGreaterThan(0);
    });
  });

  describe("getTransactions", () => {
    test("0xa79e63e78eec28741e711f89a672a4c40876ebf3", async () => {
      const result = await covalent.getTransactions(
        {
          accountAddress: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
          options: {
            pagination: {
              page: 1,
              perPage: 2,
            },
            blockRange: null,
          },
        }
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");

      expect(result.value).toBeTruthy();
      expect(result.value.transactions).toHaveLength(2);
    });
  });

  describe("getTokenTransfers", () => {
    test("0xa79e63e78eec28741e711f89a672a4c40876ebf3 - USDC", async () => {
      const result = await covalent.getTokenTransfers(
        {
          accountAddress: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
          tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          options: {
            pagination: {
              page: 1,
              perPage: 2,
            },
            blockRange: null,
          },
        },
      );

      expect(result.ok).toBeTruthy();
      if (!result.ok) throw new Error("Response is not ok");
      expect(result.value).toBeTruthy();
      expect(result.value.transfers).toHaveLength(2);
    });
  });
});
