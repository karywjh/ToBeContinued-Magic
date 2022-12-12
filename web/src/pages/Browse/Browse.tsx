import CollectionOverview from '../../components/Collection/CollectionOverview'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Browse.module.scss'
import squirry from '../../assets/squirry.jpg'

const Browse = () => {
  return (
    <div className={styles.browse}>
      <Navbar />
      <div className={styles.title}>Collections</div>
      <div className={styles.collections}>
        <CollectionOverview
          name="Animals"
          image={squirry}
          description="Lets build cool animals"
        />
      </div>
    </div>
  )
}

export default Browse
