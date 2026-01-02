import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import styles from "../styles/Home.module.css";
import { CARD_ADDRESS } from "../const/addresses";

type Props = {
    reward: {
        tokenId: string | number | bigint | BigNumber;
        contractAddress: string;
        quantityPerReward: string | number | bigint | BigNumber;
    };
};

export const PackRewardCard = ({ reward }: Props) => {
    const { contract } = useContract(CARD_ADDRESS, "edition");
    const { data } = useNFT(contract, reward.tokenId);
    
    return (
        <div className="sm:w-[20em] w-[15em] sm:h-[23em] h-[18em] bg-white rounded-xl p-5 m-3 border-white/90 border-2">
            {data && (
                <>
                    <h2>Pack Reward:</h2>
                    <ThirdwebNftMedia
                        metadata={data.metadata}
                        height="100%"
                        width="100%"
                    />
                </>
            )}
        </div>
    )
};