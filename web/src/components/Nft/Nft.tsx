import { NFT } from '@thirdweb-dev/sdk'
import styles from './Nft.module.scss'

export interface NftProps {
  nft: NFT
  onClick?: () => void
}

// revealed address character count
const REVEALED_COUNT = 4

const Nft = ({ nft, onClick }: NftProps) => {
  const totalRoyaltyPaid = 0 // TODO

  return (
    <div className={styles.card} onClick={onClick}>
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
