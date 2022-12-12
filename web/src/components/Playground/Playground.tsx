import classNames from 'classnames'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import * as htmlToImage from 'html-to-image'
import styles from './Playground.module.scss'
import { dataURLtoFile } from '../../common/utils'

export interface PlaygroundRef {
  addImage(url: string): HTMLImageElement
  deleteImage(element: HTMLImageElement): void
  selectImage(element: HTMLImageElement): void
  bringToFront(element: HTMLImageElement): void
  sendToBack(element: HTMLImageElement): void
  deselectImage(): void
  getSelection(): HTMLImageElement | undefined
  toPng(): Promise<File>
}

export interface PlaygroundProps extends React.HTMLAttributes<HTMLDivElement> {}

const Playground = forwardRef<PlaygroundRef, PlaygroundProps>(
  ({ className, ...props }, ref) => {
    const outputRef = useRef<HTMLDivElement>(null)
    const selectionRef = useRef<HTMLImageElement>()
    const mouseDownRef = useRef(false)
    const mouseResizingRef = useRef(false)

    const addImage = (url: string) => {
      const output = outputRef.current!
      const img = document.createElement('img')

      img.src = url
      img.id = 'img_' + Math.random().toString(32).slice(2, 8)
      img.style.zIndex = '1'
      img.style.left = '20px'
      img.style.top = '20px'
      img.style.width = '300px'

      return output.appendChild(img)
    }

    const deleteImage = (element: HTMLImageElement) => {
      if (selectionRef.current === element) {
        delete selectionRef.current
      }

      element.remove()
    }

    const deselectImage = () => {
      const selected = selectionRef.current

      if (selected) {
        selected.classList.remove(styles.selected)
        delete selectionRef.current
      }
    }

    const selectImage = (element: HTMLImageElement) => {
      deselectImage()

      element.classList.add(styles.selected)
      selectionRef.current = element

      return element
    }

    const getSelection = () => {
      return selectionRef.current
    }

    const bringToFront = (element: HTMLImageElement) => {
      const output = outputRef.current!
      const elements = Array.from(output.children) as HTMLImageElement[]
      const zIndices = elements.map(element => parseInt(element.style.zIndex))

      element.style.zIndex = (Math.max(...zIndices) + 1).toString()
    }

    const sendToBack = (element: HTMLImageElement) => {
      const output = outputRef.current!
      const elements = Array.from(output.children) as HTMLImageElement[]
      const zIndices = elements.map(element => parseInt(element.style.zIndex))

      elements.forEach(
        element =>
          (element.style.zIndex = (
            parseInt(element.style.zIndex) + 1
          ).toString()),
      )

      element.style.zIndex = Math.min(...zIndices).toString()
    }

    const toPng = async () => {
      const output = outputRef.current!
      const png = await htmlToImage.toPng(output)

      return dataURLtoFile(png, 'minted.png')
    }

    useImperativeHandle(ref, () => {
      return {
        addImage,
        deleteImage,
        selectImage,
        deselectImage,
        bringToFront,
        sendToBack,
        getSelection,
        toPng,
      }
    })

    return (
      <div
        ref={outputRef}
        className={classNames(styles.playground, className)}
        onMouseDown={event => {
          const { target } = event

          if (target instanceof HTMLImageElement) {
            selectImage(target)
          } else {
            deselectImage()
          }

          mouseDownRef.current = true
        }}
        onMouseMove={event => {
          event.preventDefault()
          event.stopPropagation()

          const selected = selectionRef.current

          if (mouseDownRef.current && selected) {
            const rect = selected.getBoundingClientRect()
            const endX = rect.x + rect.width
            const endY = rect.y + rect.height

            if (
              mouseResizingRef.current ||
              (endX - event.clientX < 20 &&
                endY - event.clientY < 20 &&
                endX > event.clientX &&
                endY > event.clientY)
            ) {
              const aspectRatio = rect.width / rect.height
              const distance =
                event.movementX < 0
                  ? -Math.hypot(event.movementX, event.movementY)
                  : Math.hypot(event.movementX, event.movementY)

              selected.style.width = `${rect.width + distance * aspectRatio}px`
              selected.style.height = `${rect.height + distance}px`

              mouseResizingRef.current = true
            } else {
              const left = Number(selected.style.left.replace('px', ''))
              const top = Number(selected.style.top.replace('px', ''))

              selected.style.left = `${left + event.movementX}px`
              selected.style.top = `${top + event.movementY}px`
            }
          }
        }}
        onMouseUp={() => {
          mouseDownRef.current = false
          mouseResizingRef.current = false
        }}
        onMouseLeave={() => {
          mouseDownRef.current = false
          mouseResizingRef.current = false
        }}
        {...props}
      />
    )
  },
)

export default Playground
