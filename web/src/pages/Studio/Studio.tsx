import { Metaplex } from '@metaplex-foundation/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import {
  useNFTs,
  useProgram,
  useProgramMetadata,
} from '@thirdweb-dev/react/solana'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Nft from '../../components/Nft/Nft'
import styles from './Studio.module.scss'

const Studio = () => {
  const { collectionAddr } = useParams()
  const { publicKey: currentUserPubkey } = useWallet()
  const { connection } = useConnection()
  const { data: program } = useProgram(collectionAddr, 'nft-collection')
  const { data: metadata } = useProgramMetadata(program)
  const { data: nfts } = useNFTs(program)

  const metaplex = new Metaplex(connection)

  const [isMinting, setIsMinting] = useState(false)
  const [name, setName] = useState('')
  const [sellerFeeBasisPoints_, setSellerFeeBasisPoints] = useState('')
  const [imageFile, setImageFile] = useState<File>()
  const [imageSrc, setImageSrc] = useState<string>()

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        () => {
          if (reader.result) {
            setImageSrc(reader.result.toString())
          }
        },
        false,
      )

      reader.readAsDataURL(imageFile)
    } else {
      setImageSrc(void 0)
    }
  }, [imageFile])

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
              <Nft key={idx} nft={nft} />
            ))}
          </div>
        </div>
        <div className={styles.workstation}>
          <div className={styles.playground}></div>
          <div className={styles.controls}>
            <div className={styles.upload}>
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
