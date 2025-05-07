interface UploadStatus {
  status?: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  progress?: number;
  message?: string;
}

export function DocumentUploadStatusPanel({ status }: { status: UploadStatus }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-4">Estado de Carga</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Estado:</span>
          <span className="text-white">{status.status || 'idle'}</span>
        </div>
        {status.progress !== undefined && (
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${status.progress}%` }}
            />
          </div>
        )}
        {status.message && (
          <p className="text-sm text-gray-400">{status.message}</p>
        )}
      </div>
    </div>
  );
} 