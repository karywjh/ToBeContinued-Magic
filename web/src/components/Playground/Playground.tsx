import classNames from 'classnames'
import * as htmlToImage from 'html-to-image'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { dataURLtoFile } from '../../common/utils'
import styles from './Playground.module.scss'

export interface PlaygroundRef {
  add(url: string, dataKey?: string): HTMLElement
  remove(element: HTMLElement): void
  select(element: HTMLElement): void
  deselect(): void
  bringToFront(element: HTMLElement): void
  sendToBack(element: HTMLElement): void
  getAll(): HTMLElement[]
  getSelection(): HTMLElement | undefined
  toPng(): Promise<File>
}

export interface PlaygroundProps extends React.HTMLAttributes<HTMLDivElement> {}

const Playground = forwardRef<PlaygroundRef, PlaygroundProps>(
  ({ className, ...props }, ref) => {
    const outputRef = useRef<HTMLDivElement>(null)
    const selectionRef = useRef<HTMLElement>()
    const mouseDownRef = useRef(false)
    const mouseResizingRef = useRef(false)

    const add = (url: string, dataKey?: string) => {
      const output = outputRef.current!
      const div = document.createElement('div')

      div.className = styles.insertion
      div.id = 'img_' + Math.random().toString(32).slice(2, 8)

      if (dataKey) {
        div.dataset.key = dataKey
      }

      div.style.zIndex = '1'
      div.style.left = '20px'
      div.style.top = '20px'
      div.style.width = '300px'

      const img = document.createElement('img')

      img.src = url

      div.appendChild(img)

      return output.appendChild(div)
    }

    const remove = (element: HTMLElement) => {
      if (selectionRef.current === element) {
        delete selectionRef.current
      }

      element.remove()
    }

    const deselect = () => {
      const selected = selectionRef.current

      if (selected) {
        selected.classList.remove(styles.selected)
        delete selectionRef.current
      }
    }

    const select = (element: HTMLElement) => {
      deselect()

      element.classList.add(styles.selected)
      selectionRef.current = element

      return element
    }

    const getSelection = () => {
      return selectionRef.current
    }

    const bringToFront = (element: HTMLElement) => {
      const output = outputRef.current!
      const elements = Array.from(output.children) as HTMLElement[]
      const zIndices = elements.map(element => parseInt(element.style.zIndex))

      element.style.zIndex = (Math.max(...zIndices) + 1).toString()
    }

    const sendToBack = (element: HTMLElement) => {
      const output = outputRef.current!
      const elements = Array.from(output.children) as HTMLElement[]
      const zIndices = elements.map(element => parseInt(element.style.zIndex))

      elements.forEach(
        element =>
          (element.style.zIndex = (
            parseInt(element.style.zIndex) + 1
          ).toString()),
      )

      element.style.zIndex = Math.min(...zIndices).toString()
    }

    const getAll = () => {
      return Array.from(outputRef.current!.children) as HTMLElement[]
    }

    const toPng = async () => {
      const output = outputRef.current!
      const png = await htmlToImage.toPng(output)

      return dataURLtoFile(png, 'minted.png')
    }

    useImperativeHandle(ref, () => {
      return {
        add,
        remove,
        select,
        deselect,
        bringToFront,
        sendToBack,
        getAll,
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

          if (
            target instanceof HTMLDivElement &&
            target.classList.contains(styles.insertion)
          ) {
            select(target)
          } else {
            deselect()
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
              (endX - event.clientX < 10 &&
                endY - event.clientY < 10 &&
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

              const left = Number(selected.style.left.replace('px', ''))
              const top = Number(selected.style.top.replace('px', ''))

              selected.style.left = `${left - distance}px`
              selected.style.top = `${top - distance}px`

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
