import {
  CreateNftInput,
  Metaplex,
  Nft,
  walletAdapterIdentity,
} from '@metaplex-foundation/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadIPFSTokenMetadata } from '../../common/ipfs'
import Navbar from '../../components/Navbar/Navbar'
import NftRenderer from '../../components/NftRenderer/NftRenderer'
import Playground, { PlaygroundRef } from '../../components/Playground'
import styles from './Studio.module.scss'

const FIXED_SELLER_FEE_BASIS_POINTS = 1000

const PRE_MINTED_NFT_ADDRESSES: string[] = [
  'BngLdWmieh2RG2K4tFvZtoFGntSxeT4TAvHMRsHhMCk1',
  'HkRnicaJfskBUztRFpM5r9zsWEU997j1FvkUC5mBdbjq',
  'Gp7Qr9JqjD8jduKKV8ERRQ8zWrbbXX2U1B8i3XKoUNGk',
  '7T22zG9Bbb2HKzWDFDnWtDYucJRR2kVDRe7HYmVognGN',
  'CbQWQdHPFnzBom3mQ5v6FtMzBFxzwmT3Eo4rAFQDc7wa',
  'GiXMCHbnX1DAJMmKRU85JqhHJh1cZPTHCyhp3GTLkWfC',
  'CokVEmB72ubacCyNuiMaDnaeoJ164hskFseujPkjgQz1',
  '24jj4pUR8PZnLQrR6WpQMyyXTm8V9npVd14VpTPaDFGm',
  '6ucGnNz2LdZccDTpt2Mh7ajEjWxf3NGNhoeKyScHZoKm',
]

const Studio = () => {
  const { connection } = useConnection()

  const navigate = useNavigate()
  const wallet = useWallet()
  const metaplex = useMemo(() => new Metaplex(connection), [connection])

  const [nfts, setNfts] = useState<Nft[]>([])
  const [usedNfts, setUsedNfts] = useState<Nft[]>([])
  const [modal, setModal] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [contributionPoints_, setContributionPoints] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const playgroundRef = useRef<PlaygroundRef>(null)

  useEffect(() => {
    Promise.all(
      PRE_MINTED_NFT_ADDRESSES.map(address => {
        return metaplex
          .nfts()
          .findByMint({ mintAddress: new PublicKey(address) })
      }),
    ).then(tokens => setNfts(tokens as Nft[]))
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

            playgroundRef.current?.add(imageDataURL)
          }
        },
        false,
      )

      reader.readAsDataURL(imageFile)
    }
  }

  const bringToFront = () => {
    const playground = playgroundRef.current!
    const selection = playground.getSelection()

    if (selection) {
      playground.bringToFront(selection)
    }
  }

  const sendToBack = () => {
    const playground = playgroundRef.current!
    const selection = playground.getSelection()

    if (selection) {
      playground.sendToBack(selection)
    }
  }

  const deleteSelection = () => {
    const playground = playgroundRef.current!
    const selection = playground.getSelection()

    if (selection) {
      playground.remove(selection)

      if (selection.dataset.key) {
        if (
          !playground
            .getAll()
            .some(element => element.dataset.key === selection.dataset.key)
        ) {
          setUsedNfts(values =>
            values.filter(
              value => value.address.toBase58() !== selection.dataset.key,
            ),
          )
        }
      }
    }
  }

  const newNftCreators = useMemo(() => {
    const contributionPoints = Number(contributionPoints_) || 0
    const assignableSellerFeeBasisPoints =
      FIXED_SELLER_FEE_BASIS_POINTS - contributionPoints

    const totalSellerFeeBasisPoints = usedNfts.reduce(
      (points, nft) => points + nft.sellerFeeBasisPoints,
      0,
    )

    const ratio = assignableSellerFeeBasisPoints / FIXED_SELLER_FEE_BASIS_POINTS
    const creatorsMap: Record<string, number> = {}

    let totalShare = 0

    for (const nft of usedNfts) {
      for (const creator of nft.creators) {
        const address = creator.address.toBase58()
        const share = Math.floor(
          (nft.sellerFeeBasisPoints / totalSellerFeeBasisPoints) *
            creator.share *
            ratio,
        )

        creatorsMap[address] ??= 0
        creatorsMap[address] += share

        totalShare += share
      }
    }

    if (wallet.publicKey) {
      const address = wallet.publicKey.toBase58()

      creatorsMap[address] ??= 0
      creatorsMap[address] += 100 - totalShare
    }

    return Object.entries(creatorsMap).map(([address, share]) => ({
      address,
      share,
    }))
  }, [contributionPoints_, usedNfts, wallet.publicKey])

  const mint = async () => {
    if (!wallet || !wallet.publicKey) {
      return
    }

    setIsMinting(true)

    try {
      const uri = await uploadIPFSTokenMetadata({
        name,
        symbol,
        description,
        sellerFeeBasisPoints: FIXED_SELLER_FEE_BASIS_POINTS,
        image: await playgroundRef.current!.toPng(),
      })

      const metadata: CreateNftInput = {
        name,
        symbol,
        sellerFeeBasisPoints: FIXED_SELLER_FEE_BASIS_POINTS,
        uri,
        creators: newNftCreators.map(creator => {
          return {
            address: new PublicKey(creator.address),
            share: creator.share,
          }
        }),
      }

      const result = await metaplex
        .use(walletAdapterIdentity(wallet))
        .nfts()
        .create(metadata)

      navigate(`/view/${result.mintAddress.toBase58()}`)
    } catch (error) {
      setIsMinting(false)
      throw error
    }
  }

  return (
    <div>
      <Navbar />
      <div className={styles.studio}>
        <div className={styles.container}>
          <div className={styles.title}>Collection Materials</div>
          <div className={styles.gallery}>
            {nfts?.map((nft, idx) => (
              <NftRenderer
                key={idx}
                nft={nft}
                onClick={() => {
                  const imageUrl = nft.json?.image

                  if (imageUrl) {
                    playgroundRef.current?.add(imageUrl, nft.address.toBase58())
                  }

                  if (
                    !usedNfts.some(value => value.address.equals(nft.address))
                  ) {
                    setUsedNfts(values => [...values, nft])
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
                <Playground
                  ref={playgroundRef}
                  className={styles.playground}
                  style={{ backgroundColor: backgroundColor }}
                />
              ),
              [backgroundColor],
            )}
          </div>
          <div className={styles.controls}>
            <button onClick={addImageFile}>Add Image</button>
            <button onClick={bringToFront}>Bring to Front</button>
            <button onClick={sendToBack}>Send to Back</button>
            <button onClick={deleteSelection}>Delete</button>
          </div>
          <div className={styles.colorPicker}>
            <div className={styles.colorDescription}>
              Pick your favorite background color:
            </div>
            <input
              className={styles.colorPick}
              type="color"
              value={backgroundColor}
              onChange={e => {
                setBackgroundColor(e.target.value)
              }}
            />
          </div>
          <button className={styles.mintButton} onClick={() => setModal(true)}>
            Mint
          </button>
        </div>
      </div>
      {modal && (
        <div className={styles.modal}>
          <div className={styles.dialog}>
            <div className={styles.title}>Mint Composed NFT</div>
            <div className={styles.row}>
              <div className={styles.fieldset}>
                <input
                  placeholder="Name"
                  value={name}
                  onChange={event => setName(event.target.value)}
                />
                <input
                  placeholder="Symbol"
                  value={symbol}
                  onChange={event => setSymbol(event.target.value)}
                />
                <input
                  placeholder="Description"
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                />
                <input
                  placeholder="My Contribution Points (0-500)"
                  value={contributionPoints_}
                  onChange={event => setContributionPoints(event.target.value)}
                />
              </div>
              <div className={styles.split}>
                <div>
                  New NFT will have a fixed {FIXED_SELLER_FEE_BASIS_POINTS}{' '}
                  seller fee basis points.
                  <br />
                  <br />
                  The creators of the new NFT will be:{' '}
                </div>
                <ul>
                  {newNftCreators.map((creator, index) => (
                    <li key={index}>
                      {creator.address.slice(0, 8)} {creator.share}%
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.buttons}>
              <button
                onClick={() => setModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                disabled={isMinting}
                className={styles.confirmButton}
                onClick={isMinting ? undefined : mint}
              >
                {isMinting ? 'Minting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Studio
