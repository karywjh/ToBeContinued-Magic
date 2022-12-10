import styles from './Home.module.scss'
import background from '../../assets/drop2.svg'

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.name}>To Be Continued</div>
      <img
        src={background}
        alt="background"
        className={styles.background}
      ></img>
    </div>
  )
}

export default Home
