import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import styles from './Navbar.module.scss'

const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.name}>To Be Continued...</div>
      <WalletMultiButton />
    </div>
  )
}

export default NavBar
