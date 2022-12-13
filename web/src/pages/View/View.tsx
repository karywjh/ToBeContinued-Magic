import { Metaplex, Nft } from '@metaplex-foundation/js'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import NavBar from '../../components/Navbar/Navbar'
import styles from './View.module.scss'

const View = () => {
  const { mintAddress: mintAddress_ } = useParams()
  const { connection } = useConnection()

  const metaplex = useMemo(() => new Metaplex(connection), [connection])
  const mintAddress = useMemo(
    () => new PublicKey(mintAddress_!),
    [mintAddress_],
  )

  const [nft, setNft] = useState<Nft>()

  useEffect(() => {
    metaplex
      .nfts()
      .findByMint({ mintAddress })
      .then(token => setNft(token as Nft))
  }, [mintAddress, metaplex])

  return (
    <div className={styles.page}>
      <NavBar />
      <div className={styles.container}>
        {nft && (
          <div className={styles.nft}>
            {nft.json?.image && (
              <img
                className={styles.image}
                src={nft.json?.image}
                alt={nft.name}
              />
            )}
            <div className={styles.info}>
              <div className={styles.name}>{nft.name}</div>
              <div className={styles.symbol}>${nft.symbol}</div>
              <div className={styles.description}>{nft.json?.description}</div>
              <div className={styles.seller}>
                Seller Fee Basis Points: {nft.sellerFeeBasisPoints}
              </div>
              <div className={styles.creators}>
                <div className={styles.title}>Creators</div>
                <ul>
                  {nft.creators.map((creator, index) => (
                    <li key={index}>
                      <a
                        href={`https://solscan.io/account/${creator.address.toBase58()}`}
                      >
                        {creator.address.toBase58()}
                      </a>{' '}
                      {creator.share}%
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.buttons}>
                <button
                  onClick={() =>
                    window.open(`https://solscan.io/token/${mintAddress_}`)
                  }
                >
                  View on Solscan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default View
