import styles from './CollectionOverview.module.scss'
import addIcon from '../../assets/add.svg'
import { useNavigate } from 'react-router-dom'
import {
  useProgram,
  useProgramMetadata,
  useNFTs,
} from '@thirdweb-dev/react/solana'
import { NFT } from '@thirdweb-dev/sdk'

export interface CollectionOverviewProps {
  collectionAddr?: string
}

const CollectionOverview = ({ collectionAddr }: CollectionOverviewProps) => {
  const navigate = useNavigate()

  const { data: program } = useProgram(collectionAddr, 'nft-collection')
  const { data: metadata } = useProgramMetadata(program)
  const { data: nfts } = useNFTs(program)

  const collectionName = String(metadata?.name)
  const collectionImg = String(metadata?.image)
  const collectionDescription = String(metadata?.description)
  const totalRoyaltyPaid = 0

  if (!collectionAddr) {
    return (
      <div
        className={styles.addCollection}
        onClick={() => navigate(`/newcollection`)}
      >
        <img
          src={addIcon}
          alt="add new collection"
          className={styles.addIcon}
        ></img>
      </div>
    )
  }

  return (
    <div
      className={styles.collection}
      onClick={() => navigate(`/studio/${collectionAddr}`)}
    >
      <img
        src={collectionImg}
        alt="collectionImage"
        className={styles.collectionImg}
      ></img>
      <div className={styles.infoContainer}>
        <div className={styles.name}>{collectionName}</div>
        <div className={styles.description}>{collectionDescription}</div>
        <div className={styles.royalty}>
          Total Royalties Earned: {totalRoyaltyPaid}
        </div>
      </div>
    </div>
  )
}

export default CollectionOverview
