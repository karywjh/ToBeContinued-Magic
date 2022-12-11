import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Playground, { PlaygroundRef } from '../../components/Playground'
import styles from './Studio.module.scss'

const Studio = () => {
  const { collectionAddr } = useParams()
  const { publicKey: currentUserPubkey } = useWallet()

  const [isMinting, setIsMinting] = useState(false)
  const [name, setName] = useState('')
  const [sellerFeeBasisPoints_, setSellerFeeBasisPoints] = useState('')

  const playgroundRef = useRef<PlaygroundRef>(null)

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
    if (!collectionAddr || !currentUserPubkey) {
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
            {/* {nfts?.map((nft, idx) => (
              <Nft
                key={idx}
                nft={nft}
                onClick={() => {
                  const imageUrl = nft.metadata.image

                  if (imageUrl) {
                    playgroundRef.current?.addImage(imageUrl)
                  }
                }}
              />
            ))} */}
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
