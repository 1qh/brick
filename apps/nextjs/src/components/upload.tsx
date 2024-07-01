'use client'

import type { DropzoneProps, FileRejection } from 'react-dropzone'
import * as React from 'react'
import Image from 'next/image'
import { TrashIcon, UploadIcon } from '@radix-ui/react-icons'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import Dropzone from 'react-dropzone'
import { toast } from 'sonner'

import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import { Progress } from '@a/ui/progress'
import { ScrollArea } from '@a/ui/scroll-area'

function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: 'accurate' | 'normal'
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (bytes === 0) {
    return '0 Byte'
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytes' : sizes[i] ?? 'Bytes'
  }`
}

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[]

  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<File[]>>
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => Promise<void>

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps['accept']

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps['maxSize']

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFiles={5}
   */
  maxFiles?: DropzoneProps['maxFiles']

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean
}

export function FileUploader({
  value: valueProp,
  onValueChange,
  onUpload,
  progresses,
  accept = { 'image/*': [] },
  maxSize = 1024 * 1024 * 2,
  maxFiles = 1,
  multiple = false,
  disabled = false,
  className,
  ...dropzoneProps
}: FileUploaderProps) {
  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange
  })

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error('Cannot upload more than 1 file at a time')
        return
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast.error(`Cannot upload more than ${maxFiles} files`)
        return
      }

      const newFiles = acceptedFiles.map(file =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )

      const updatedFiles = files ? [...files, ...newFiles] : newFiles

      setFiles(updatedFiles)

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => toast.error(`File ${file.name} was rejected`))
      }

      if (onUpload && updatedFiles.length > 0 && updatedFiles.length <= maxFiles) {
        const target = updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([])
            return `${target} uploaded`
          },
          error: `Failed to upload ${target}`
        })
      }
    },

    [files, maxFiles, multiple, onUpload, setFiles]
  )

  function onRemove(index: number) {
    if (!files) {
      return
    }
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onValueChange?.(newFiles)
  }

  React.useEffect(() => {
    if (!files) {
      return
    }
    files.forEach(file => {
      if (isFileWithPreview(file)) {
        URL.revokeObjectURL(file.preview)
      }
    })
  }, [])

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles

  return (
    <div className='relative flex flex-col overflow-hidden'>
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={maxFiles > 1 || multiple}
        disabled={isDisabled}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragActive && 'border-muted-foreground/50',
              isDisabled && 'pointer-events-none opacity-60',
              className
            )}
            {...dropzoneProps}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <UploadIcon className='size-7 text-muted-foreground' aria-hidden='true' />
                </div>
                <p className='font-medium text-muted-foreground'>Drop the files here</p>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <UploadIcon className='size-7 text-muted-foreground' aria-hidden='true' />
                </div>
                <div className='space-y-px'>
                  <p className='font-medium text-muted-foreground'>
                    Drag & drop files or click to select files
                  </p>
                  <p className='text-sm text-muted-foreground/70'>
                    You can upload
                    {maxFiles > 1
                      ? ` ${maxFiles === Infinity ? 'multiple' : maxFiles}
                      files (up to ${formatBytes(maxSize)} each)`
                      : ` a file with ${formatBytes(maxSize)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className='notranslate mt-3 h-fit w-full'>
          <div className='max-h-48 space-y-4'>
            {files.map((file, i) => (
              <FileCard
                key={i}
                file={file}
                onRemove={() => onRemove(i)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  )
}

interface FileCardProps {
  file: File
  onRemove: () => void
  progress?: number
}

const FileCard = ({ file, progress, onRemove }: FileCardProps) => (
  <div className='flex items-center'>
    <div className='flex grow'>
      {isFileWithPreview(file) && (
        <Image
          onError={e => {
            if (!file.type.startsWith('image/')) {
              e.currentTarget.srcset = '/file.png'
            }
          }}
          src={file.preview}
          alt={file.name}
          width={48}
          height={48}
          className='ml-3 mr-1 aspect-square shrink-0 rounded-md object-cover'
        />
      )}
      <div className='flex w-full flex-col justify-center'>
        <p className='line-clamp-1 text-sm font-medium'>{file.name}</p>
        <p className='text-xs text-muted-foreground'>{formatBytes(file.size)}</p>
        {progress && <Progress value={progress} />}
      </div>
    </div>
    <Button
      type='button'
      variant='outline'
      size='icon'
      className='group mr-3 transition-all duration-300 hover:scale-105 hover:bg-red-100 hover:drop-shadow-xl dark:hover:bg-red-950'
      onClick={onRemove}>
      <TrashIcon
        className='size-6 transition-all duration-100 group-hover:scale-110 group-hover:text-red-500'
        aria-hidden='true'
      />
    </Button>
  </div>
)

const isFileWithPreview = (file: File): file is File & { preview: string } =>
  'preview' in file && typeof file.preview === 'string'
