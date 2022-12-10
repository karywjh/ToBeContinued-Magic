import CollectionOverview from '../../components/Collection/CollectionOverview'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Browse.module.scss'

const Browse = () => {
  return (
    <div className={styles.browse}>
      <Navbar />
      <div className={styles.title}>Collections</div>
      <div className={styles.collections}>
        <CollectionOverview collectionId="12345"></CollectionOverview>
        <CollectionOverview collectionId="12345"></CollectionOverview>
        <CollectionOverview collectionId="12345"></CollectionOverview>
        <CollectionOverview collectionId="12345"></CollectionOverview>

        <CollectionOverview collectionId="12345"></CollectionOverview>
        <CollectionOverview collectionId="12345"></CollectionOverview>
        <CollectionOverview collectionId="12345"></CollectionOverview>
        <CollectionOverview collectionId="12345"></CollectionOverview>
        <CollectionOverview collectionId="12345"></CollectionOverview>

        <CollectionOverview></CollectionOverview>
      </div>
    </div>
  )
}

export default Browse
