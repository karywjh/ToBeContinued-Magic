import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import background from '../../assets/background.svg'
import santaCloth from '../../assets/santa-cloth.svg'
import santaHat from '../../assets/santa-hat.svg'
import squirry from '../../assets/squirry.svg'
import tree from '../../assets/tree.svg'
import styles from './Home.module.scss'

const Home = () => {
  const navigate = useNavigate()

  const [initialized, setInitialized] = useState(false)
  const [movement, setMovement] = useState(0)

  const breakpoint = useMemo(() => {
    if (movement >= 15000) return 8
    if (movement >= 13000) return 7
    if (movement >= 11000) return 6
    if (movement >= 9000) return 5
    if (movement >= 7000) return 4
    if (movement >= 5000) return 3
    if (movement >= 3000) return 2
    if (movement >= 1000) return 1
    return 0
  }, [movement])

  const tip = useMemo(() => {
    if (breakpoint === 1) return "A squirry! Guess what's next?"
    if (breakpoint === 2) return "Hah, a santa hat! Let's keep going."
    if (breakpoint === 3) return 'Santa squirry? Interesting.'
    if (breakpoint === 4) return "Let's add a cloth for it :)"
    if (breakpoint === 5) return 'A santa squirry now! Keep going.'
    if (breakpoint === 6) return 'We will add a Christmas tree.'
    if (breakpoint === 7) return 'Arranged! Scroll down to create your own one.'
    return 'Try scrolling down'
  }, [breakpoint])

  useEffect(() => {
    requestAnimationFrame(() => {
      setInitialized(true)
    })
  }, [])

  return (
    <div
      className={styles.home}
      onWheel={event => {
        setMovement(Math.max(movement + event.deltaY, 0))
      }}
    >
      <div className={styles.name}>To Be Continued</div>
      <img
        src={background}
        alt="background"
        className={classNames(styles.background, initialized && styles.visible)}
      />
      <img
        src={squirry}
        alt="squirry"
        className={classNames(
          styles.squirry,
          breakpoint >= 1 && styles.visible,
        )}
      />
      <img
        src={santaHat}
        alt="santa hat"
        className={classNames(
          styles.santaHat,
          breakpoint >= 2 && styles.visibleFirst,
          breakpoint >= 3 && styles.visibleSecond,
        )}
      />
      <img
        src={santaCloth}
        alt="santa cloth"
        className={classNames(
          styles.santaCloth,
          breakpoint >= 4 && styles.visibleFirst,
          breakpoint >= 5 && styles.visibleSecond,
        )}
      />
      <img
        src={tree}
        alt="tree"
        className={classNames(
          styles.tree,
          breakpoint >= 6 && styles.visibleFirst,
          breakpoint >= 7 && styles.visibleSecond,
        )}
      />
      <div className={styles.bottomLayer}>
        {breakpoint < 8 && <div className={styles.tip}>{tip}</div>}
        {breakpoint === 8 && (
          <div className={styles.button} onClick={() => navigate('/browse')}>
            Create Your Own NFT
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
