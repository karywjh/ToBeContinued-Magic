import CollectionOverview from '../../components/Collection/CollectionOverview'
import styles from './Browse.module.scss'

const Browse = () => {
  return (
    <div className={styles.browse}>
      <div className={styles.title}>Collections</div>
      <div className={styles.collections}>
        <CollectionOverview collectionId="12345"></CollectionOverview>
        <CollectionOverview></CollectionOverview>
      </div>
    </div>
  )
}

export default Browse
