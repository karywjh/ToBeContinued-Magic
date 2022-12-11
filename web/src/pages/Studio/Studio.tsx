import { Metaplex } from '@metaplex-foundation/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import {
  useNFTs,
  useProgram,
  useProgramMetadata,
} from '@thirdweb-dev/react/solana'
import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Nft from '../../components/Nft/Nft'
import Playground, { PlaygroundRef } from '../../components/Playground'
import styles from './Studio.module.scss'

const Studio = () => {
  const { collectionAddr } = useParams()
  const { publicKey: currentUserPubkey } = useWallet()
  const { connection } = useConnection()
  const { data: program } = useProgram(collectionAddr, 'nft-collection')
  const { data: metadata } = useProgramMetadata(program)
  const { data: nfts } = useNFTs(program)

  const metaplex = useMemo(() => new Metaplex(connection), [connection])

  const [isMinting, setIsMinting] = useState(false)
  const [name, setName] = useState('')
  const [sellerFeeBasisPoints_, setSellerFeeBasisPoints] = useState('')

  const playgroundRef = useRef<PlaygroundRef>(null)

  const selectImage = () => {
    return new Promise<File | undefined>(resolve => {
      const input = document.createElement('input')

      input.type = 'file'
      input.onchange = event => {
        resolve((event.target as HTMLInputElement).files?.[0])
      }

      input.click()
    })
  }

  const addImage = async () => {
    const imageFile = await selectImage()

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

    const { uri } = await metaplex.nfts().uploadMetadata({
      name,
      seller_fee_basis_points: sellerFeeBasisPoints,
    })

    const result = await metaplex.nfts().create({
      name,
      sellerFeeBasisPoints,
      uri,
      creators: [
        {
          address: currentUserPubkey,
          share: 100,
        },
      ],
      collection: new PublicKey(collectionAddr),
    })

    console.log(result)
  }

  return (
    <div>
      <Navbar />
      <div className={styles.studio}>
        <div className={styles.container}>
          <div className={styles.title}>{metadata?.name}'s Materials</div>
          <div className={styles.gallery}>
            {nfts?.map((nft, idx) => (
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
              <button onClick={addImage}>Add Image</button>
              {/* TODO add upload image / audio feature */}
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
