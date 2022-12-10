import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import styles from './Studio.module.scss'
import {
  useProgram,
  useProgramMetadata,
  useNFTs,
} from '@thirdweb-dev/react/solana'
import { useWallet } from '@solana/wallet-adapter-react'
import Nft from '../../components/Nft/Nft'

const Studio = () => {
  const { collectionAddr } = useParams()

  const { data: program } = useProgram(collectionAddr, 'nft-collection')
  const { data: metadata, isLoading: loadingMetadata } =
    useProgramMetadata(program)
  const { data: nfts, isLoading } = useNFTs(program)
  const { publicKey } = useWallet()

  return (
    <div>
      <Navbar />
      <div className={styles.studio}>
        <div className={styles.container}>
          <div className={styles.title}>{metadata?.name}'s Materials</div>
          <div className={styles.gallery}>
            {nfts?.map((nft, idx) => (
              <Nft key={idx} nft={nft} />
            ))}
          </div>
        </div>
        <div className={styles.workstation}>
          <div className={styles.playground}></div>
          <div className={styles.controls}></div>
        </div>
      </div>
    </div>
  )
}

export default Studio
