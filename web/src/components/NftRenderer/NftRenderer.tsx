import { Nft } from '@metaplex-foundation/js'
import { getIPFSURL } from '../../common/ipfs'
import styles from './NftRenderer.module.scss'

export interface NftRendererProps {
  nft: Nft
  onClick?: () => void
}

const NftRenderer = ({ nft, onClick }: NftRendererProps) => {
  return (
    <div className={styles.card} onClick={onClick}>
      {nft.json?.image && (
        <img
          src={getIPFSURL(nft.json.image)}
          alt="nftImage"
          className={styles.nftImg}
        />
      )}
      <div className={styles.infoContainer}>
        <div className={styles.name}>{nft.name}</div>
        <div className={styles.description}>{nft.json?.description}</div>
        <div className={styles.creators}>
          Created By:{' '}
          {nft.creators.map(
            creator =>
              `${creator.address.toBase58().slice(0, 8)} (${
                creator.share / 100
              }%)`,
          )}
        </div>
      </div>
    </div>
  )
}
export default NftRenderer
