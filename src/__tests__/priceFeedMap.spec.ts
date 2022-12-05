import { priceFeedMap } from "../components/ERC20Balance/priceFeeds/priceFeedMap";

it("priceFeeds/priceFeedMap - returns price feed address for token", async () => {
  const priceFeedAddress = await priceFeedMap("ETH", 1);
  const priceFeedAddress2 = await priceFeedMap("1INCH", 1);
  console.log("priceFeedAddress - ", priceFeedAddress);
  if (!priceFeedAddress) {
    console.log("Use LIFI / coingecko price info");
  } else {
    console.log("Call priceFeed contract to get price info");
  }
  expect(priceFeedAddress).toEqual(
    "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  );
  0xc929ad75b72593967de83e7f7cda0493458261d9;
  expect(priceFeedAddress2).toEqual(
    "0xc929ad75B72593967DE83E7F7Cda0493458261D9",
  );
});

it("priceFeeds/priceFeedMap - returns undefined if we don't have address", async () => {
  const priceFeedAddress = await priceFeedMap("XRPL", 1);
  console.log("priceFeedAddress - ", priceFeedAddress);
  if (!priceFeedAddress) {
    console.log("Use LIFI / coingecko price info");
  } else {
    console.log("Call priceFeed contract to get price info");
  }
  expect(priceFeedAddress).toEqual(undefined);
});
