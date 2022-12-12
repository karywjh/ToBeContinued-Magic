import { useNavigate } from 'react-router-dom'
import styles from './CollectionOverview.module.scss'

export interface CollectionOverviewProps {
  name: string
  image: string
  description: string
}

const CollectionOverview = ({
  name,
  image,
  description,
}: CollectionOverviewProps) => {
  const navigate = useNavigate()

  const collectionName = String(name)
  const collectionImg = String(image)
  const collectionDescription = String(description)
  const totalRoyaltyPaid = 0

  return (
    <div className={styles.collection} onClick={() => navigate(`/studio`)}>
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
