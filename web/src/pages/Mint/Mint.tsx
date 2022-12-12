import {
  CreateNftInput,
  Metaplex,
  walletAdapterIdentity,
} from '@metaplex-foundation/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useMemo, useState } from 'react'
import { uploadIPFSTokenMetadata } from '../../common/ipfs'
import styles from './Mint.module.scss'

const Mint = () => {
  const { connection } = useConnection()

  const wallet = useWallet()
  const metaplex = useMemo(() => new Metaplex(connection), [connection])

  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
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

  const handleMint = async () => {
    if (wallet === null || wallet.publicKey === null || !imageFile) {
      return
    }

    const sellerFeeBasisPoints = Number(sellerFeeBasisPoints_)

    const uri = await uploadIPFSTokenMetadata({
      name,
      symbol,
      description,
      image: imageFile,
      sellerFeeBasisPoints,
    })

    const metadata: CreateNftInput = {
      name,
      symbol,
      sellerFeeBasisPoints,
      uri,
      creators: [
        {
          address: wallet.publicKey,
          share: 100,
        },
      ],
    }

    const result = await metaplex
      .use(walletAdapterIdentity(wallet))
      .nfts()
      .create(metadata)

    console.log('tokenAddress', result.mintAddress.toBase58())
  }

  return (
    <div className={styles.page}>
      <h1>Mint NFT</h1>
      <div className={styles.list}>
        <input
          className={styles.input}
          placeholder="Name"
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Symbol"
          value={symbol}
          onChange={event => setSymbol(event.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Description"
          value={description}
          onChange={event => setDescription(event.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Seller Fee Basis Points (0-10000)"
          value={sellerFeeBasisPoints_}
          onChange={event => setSellerFeeBasisPoints(event.target.value)}
        />
        <div className={styles.input}>
          <input
            type="file"
            placeholder="Select Image"
            onChange={event => setImageFile(event.target.files?.[0])}
          />
          {imageSrc && (
            <img
              className={styles.image}
              src={imageSrc}
              alt="NFT Presentation"
            />
          )}
        </div>
        <button className={styles.mint} onClick={handleMint}>
          Mint
        </button>
      </div>
    </div>
  )
}

export default Mint
