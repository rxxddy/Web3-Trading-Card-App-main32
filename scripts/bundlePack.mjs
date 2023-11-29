import { ThirdwebSDK } from "@thirdweb-dev/sdk"

import dotenv from "dotenv";
dotenv.config();

(async () => {
    const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "polygon", {
        clientId: "9e4314f9cb80713a98f3221cfb883eaf", 
        secretKey: "4KiD0ggGu3AhYICThnSMFY0jmcAWrb9otfx8i7T8MtrVP89TrAqp9fWGeJuxKHeNiRtdRQnmZGXBL2W1apXaaw",
      });

    const packAddress = "0xCC675946FE485D433B39cd802D1F5873c68d52aa";
    const cardAddress = "0x14Ec3dD680C1C8A0f0e83D1a3a2cfBC2E98a1e20";

    const pack = sdk.getContract(packAddress, "pack");

    const card = sdk.getContract(cardAddress, "edition");
    await (await card).setApprovalForAll(packAddress, true);
    console.log("Approved card contract to transfer cards to pack contract");

    const packImage = "ipfs://QmPgRkKsKaRKmX4BXrDKeJ7VFwcMrbWPGswVbbpXonxCv8/pack23.png";

    console.log("Creating pack");
    const createPacks = (await pack).create({
        packMetadata: {
            name: "This is my 1 pack",
            description: "This is my last Shot",
            image: packImage,
        },
        erc1155Rewards: [
            {
                contractAddress: cardAddress,
                tokenId: 10,
                quantityPerReward: 1,
                totalRewards: 10,
            },
            {
                contractAddress: cardAddress,
                tokenId: 11,
                quantityPerReward: 1,
                totalRewards: 10,
            }
        ],
        rewardsPerPack: 1,
    });

    console.log("Packs created");
})();