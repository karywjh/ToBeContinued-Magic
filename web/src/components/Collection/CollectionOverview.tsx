import styles from './CollectionOverview.module.scss'
import person1 from '../../assets/person1.png'
import addIcon from '../../assets/add.svg'
import { useNavigate } from 'react-router-dom'

export interface CollectionOverviewProps {
  collectionId?: string
}

const CollectionOverview = ({ collectionId }: CollectionOverviewProps) => {
  const navigate = useNavigate()

  const collectionName = 'TBC'
  const collectionImg = person1
  const totalRoyaltyPaid = 0

  if (!collectionId) {
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
      onClick={() => navigate(`/collection/${collectionId}`)}
    >
      <img
        src={collectionImg}
        alt="collectionImage"
        className={styles.collectionImg}
      ></img>
      <div className={styles.infoContainer}>
        <div className={styles.name}>{collectionName}</div>
        <div className={styles.royalty}>
          Total Royalties Paid: {totalRoyaltyPaid}
        </div>
      </div>
    </div>
  )
}

export default CollectionOverview
