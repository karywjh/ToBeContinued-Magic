import { Metaplex, Nft } from '@metaplex-foundation/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getIPFSURL } from '../../common/ipfs'
import Navbar from '../../components/Navbar/Navbar'
import NftRenderer from '../../components/NftRenderer/NftRenderer'
import Playground, { PlaygroundRef } from '../../components/Playground'
import styles from './Studio.module.scss'

const PRE_MINTED_NFT_ADDRESSES = [
  '32YtmDESkQt3L45xwZPB21ACrgjq3J9qJBs98Gno65v2',
]

const Studio = () => {
  const { connection } = useConnection()

  const wallet = useWallet()
  const metaplex = useMemo(() => new Metaplex(connection), [connection])

  const [nfts, setNfts] = useState<Nft[]>([])
  const [isMinting, setIsMinting] = useState(false)
  const [name, setName] = useState('')
  const [sellerFeeBasisPoints_, setSellerFeeBasisPoints] = useState('')

  const playgroundRef = useRef<PlaygroundRef>(null)

  useEffect(() => {
    Promise.all(
      PRE_MINTED_NFT_ADDRESSES.map(address => {
        return metaplex.nfts().findByMint({
          mintAddress: new PublicKey(address),
          loadJsonMetadata: false,
        })
      }),
    )
      .then(results => {
        return Promise.all(
          results.map(async result => {
            const res = await fetch(getIPFSURL(result.uri))
            const json = await res.json()

            return Object.assign(result, { json }) as Nft
          }),
        )
      })
      .then(setNfts)
  }, [metaplex])

  const selectImageFile = () => {
    return new Promise<File | undefined>(resolve => {
      const input = document.createElement('input')

      input.type = 'file'
      input.onchange = event => {
        resolve((event.target as HTMLInputElement).files?.[0])
      }

      input.click()
    })
  }

  const addImageFile = async () => {
    const imageFile = await selectImageFile()

    if (imageFile) {
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        () => {
          if (reader.result) {
            const imageDataURL = reader.result.toString()

            playgroundRef.current?.addImage(imageDataURL)
          }
        },
        false,
      )

      reader.readAsDataURL(imageFile)
    }
  }

  const mint = async () => {
    if (!wallet || !wallet.publicKey) {
      return
    }

    setIsMinting(true)

    const sellerFeeBasisPoints = Number(sellerFeeBasisPoints_)
  }

  return (
    <div>
      <Navbar />
      <div className={styles.studio}>
        <div className={styles.container}>
          {/* <div className={styles.title}>{metadata?.name}'s Materials</div> */}
          <div className={styles.gallery}>
            {nfts?.map((nft, idx) => (
              <NftRenderer
                key={idx}
                nft={nft}
                onClick={() => {
                  const imageIPFSURI = nft.json?.image

                  if (imageIPFSURI) {
                    playgroundRef.current?.addImage(getIPFSURL(imageIPFSURI))
                  }
                }}
              />
            ))}
          </div>
        </div>
        <div className={styles.workstation}>
          <div className={styles.playgroundBorder}>
            {useMemo(
              () => (
                <Playground ref={playgroundRef} className={styles.playground} />
              ),
              [],
            )}
          </div>
          <div className={styles.controls}>
            <div className={styles.upload}>
              <button onClick={addImageFile}>Add Image</button>
              <button onClick={addImageFile}>Bring to Front</button>
              <button onClick={addImageFile}>Send to Back</button>
            </div>
          </div>
          <div className={styles.mintButton} onClick={mint}>
            {isMinting ? 'Minting...' : 'Mint'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Studio
