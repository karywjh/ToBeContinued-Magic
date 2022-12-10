import CollectionOverview from '../../components/Collection/CollectionOverview'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Browse.module.scss'

const Browse = () => {
  return (
    <div className={styles.browse}>
      <Navbar />
      <div className={styles.title}>Collections</div>
      <div className={styles.collections}>
        <CollectionOverview collectionAddr="5KbNiVafD8zcrgtp2tXKcp8YZz6ohJMmka1XcUjJa5wX"></CollectionOverview>
        {/* <CollectionOverview collectionAddr="12345"></CollectionOverview>
        <CollectionOverview collectionAddr="12345"></CollectionOverview>
        <CollectionOverview collectionAddr="12345"></CollectionOverview>

        <CollectionOverview collectionAddr="12345"></CollectionOverview>
        <CollectionOverview collectionAddr="12345"></CollectionOverview>
        <CollectionOverview collectionAddr="12345"></CollectionOverview>
        <CollectionOverview collectionAddr="12345"></CollectionOverview>
        <CollectionOverview collectionAddr="12345"></CollectionOverview> */}

        <CollectionOverview></CollectionOverview>
      </div>
    </div>
  )
}

export default Browse
