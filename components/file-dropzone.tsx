import { ReactNode, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  className?: string;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  onFileDropped?: (files: File[]) => void;
  children?: ReactNode;
}

export default function FileDropZone(props: FileDropZoneProps) {
  const { className, disabled, onFileDropped, children } = props;

  const [isDropping, setIsDropping] = useState<boolean>(false);
  const uploadRef = useRef<HTMLInputElement>();

  return (
    <div
      onDragEnter={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (disabled) {
          return;
        }
        setIsDropping(true);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsDropping(false);
      }}
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (disabled) {
          return;
        }
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          onFileDropped?.(Array.from(e.dataTransfer.files));
        }
      }}
    >
      <label htmlFor='dropzone-file'>
        <div className={cn(isDropping && 'shadow-lg', className)}>
          {children}
        </div>
        <input
          className='hidden'
          id='dropzone-file'
          ref={uploadRef as any}
          type='file'
          accept={props.accept}
          multiple={props.multiple}
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.target.files && e.target.files[0]) {
              onFileDropped?.(Array.from(e.target.files));
            }
          }}
          disabled={disabled}
        />
      </label>
    </div>
  );
}
