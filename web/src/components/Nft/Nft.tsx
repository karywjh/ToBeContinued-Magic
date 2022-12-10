import { ThirdwebNftMedia } from '@thirdweb-dev/react'
import { nftCreatorsQuery } from '@thirdweb-dev/react/solana'
import { NFT } from '@thirdweb-dev/sdk'
import styles from './Nft.module.scss'

export interface NftProps {
  nft: NFT
}

// revealed address character count
const REVEALED_COUNT = 4

const Nft = ({ nft }: NftProps) => {
  const totalRoyaltyPaid = 0 // TODO

  return (
    <div className={styles.card}>
      <div className={styles.imgContainer}>
        <img
          src={String(nft.metadata?.image)}
          alt="nftImage"
          className={styles.nftImg}
        ></img>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name}>{nft.metadata.name}</div>
        <div className={styles.owner}>
          Owned By:
          {' ' +
            nft.owner.substring(0, REVEALED_COUNT) +
            '...' +
            nft.owner.substring(nft.owner.length - REVEALED_COUNT)}
        </div>
        <div className={styles.royalty}>
          Total Royalties Earned: {totalRoyaltyPaid}
        </div>
      </div>
    </div>
  )
}
export default Nft
