import { FileWithPreview } from './types';

export function DocumentDropzone({ files, setFiles }: { files: FileWithPreview[]; setFiles: (f: FileWithPreview[]) => void }) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files) as FileWithPreview[];
    setFiles([...files, ...droppedFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-blue-400"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <span className="text-blue-400 font-semibold mb-2">Arrastra y suelta archivos aquí</span>
      <span className="text-xs text-gray-400">O haz click para seleccionar</span>
      {files.length > 0 && (
        <span className="text-sm text-gray-400 mt-2">{files.length} archivo(s) seleccionado(s)</span>
      )}
    </div>
  );
} 