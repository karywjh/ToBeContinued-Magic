import CollectionOverview from '../../components/Collection/CollectionOverview'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Browse.module.scss'

const Browse = () => {
  return (
    <div className={styles.browse}>
      <Navbar />
      <div className={styles.title}>Collections</div>
      <div className={styles.collections}>
        <CollectionOverview
          name="Animals"
          image=""
          description="Lets build cool animals"
        ></CollectionOverview>
        {/* <CollectionOverview collectionAddr="12345"></CollectionOverview>
        <CollectionOverview collectionAddr="12345"></CollectionOverview>
        <CollectionOverview collectionAddr="12345"></CollectionOverview>

        <CollectionOverview collectionAddr="12345"></CollectionOverview>
        <CollectionOverview collectionAddr="12345"></CollectionOverview>
        <CollectionOverview collectionAddr="12345"></CollectionOverview>
        <CollectionOverview collectionAddr="12345"></CollectionOverview>
        <CollectionOverview collectionAddr="12345"></CollectionOverview> */}
      </div>
    </div>
  )
}

export default Browse
