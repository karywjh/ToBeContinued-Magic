import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import background from '../../assets/background3.svg'
import santaCloth from '../../assets/santa-cloth.svg'
import santaHat from '../../assets/santa-hat.svg'
import squirry from '../../assets/squirry.svg'
import tree from '../../assets/tree.svg'
import styles from './Home.module.scss'
import line from '../../assets/pointingLine.svg'
import line3 from '../../assets/pointingLine3.svg'
import line4 from '../../assets/pointingLine4.svg'
import line5 from '../../assets/pointingLine5.svg'

const Home = () => {
  const navigate = useNavigate()

  const [initialized, setInitialized] = useState(false)
  const [movement, setMovement] = useState(0)

  const breakpoint = useMemo(() => {
    if (movement >= 23000) return 8
    if (movement >= 20000) return 7
    if (movement >= 16000) return 6
    if (movement >= 13000) return 5
    if (movement >= 10000) return 4
    if (movement >= 7000) return 3
    if (movement >= 4000) return 2
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

      <div
        className={classNames(
          styles.creator,
          styles.creator1,
          breakpoint === 1 && styles.visible,
        )}
      >
        created by n6aM..nmTKq
      </div>
      <img
        src={line}
        alt="line"
        className={classNames(
          styles.line,
          styles.line1,
          breakpoint === 1 && styles.visible,
        )}
      ></img>

      <img
        src={santaHat}
        alt="santa hat"
        className={classNames(
          styles.santaHat,
          breakpoint >= 2 && styles.visibleFirst,
          breakpoint >= 3 && styles.visibleSecond,
        )}
      />

      <div
        className={classNames(
          styles.creator,
          styles.creator2,
          breakpoint === 2 && styles.visible,
        )}
      >
        created by EqPt..2ouw
      </div>
      <img
        src={line3}
        alt="line"
        className={classNames(
          styles.line,
          styles.line2,
          breakpoint === 2 && styles.visible,
        )}
      ></img>

      <img
        src={santaCloth}
        alt="santa cloth"
        className={classNames(
          styles.santaCloth,
          breakpoint >= 4 && styles.visibleFirst,
          breakpoint >= 5 && styles.visibleSecond,
        )}
      />

      <div
        className={classNames(
          styles.creator,
          styles.creator3,
          breakpoint === 4 && styles.visible,
        )}
      >
        created by CxQq..tq1a
      </div>
      <img
        src={line4}
        alt="line"
        className={classNames(
          styles.line,
          styles.line3,
          breakpoint === 4 && styles.visible,
        )}
      ></img>

      <img
        src={tree}
        alt="tree"
        className={classNames(
          styles.tree,
          breakpoint >= 6 && styles.visibleFirst,
          breakpoint >= 7 && styles.visibleSecond,
        )}
      />

      <div
        className={classNames(
          styles.creator,
          styles.creator4,
          breakpoint === 6 && styles.visible,
        )}
      >
        created by Cy18..64tL
      </div>
      <img
        src={line5}
        alt="line"
        className={classNames(
          styles.line,
          styles.line4,
          breakpoint === 6 && styles.visible,
        )}
      ></img>

      <div
        className={classNames(
          styles.cocreators,
          breakpoint === 8 && styles.visible,
        )}
      >
        <div className={styles.title}>Co-created by:</div>
        n6aM..nmTKq
        <br /> EqPt..2ouw <br /> CxQq..tq1a
      </div>

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
