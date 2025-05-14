"use client";
import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ImageViewerProps {
  url: string;
  filename: string;
}

function ImageViewerModal({ isOpen, onClose, url, filename }: { isOpen: boolean; onClose: () => void; url: string; filename: string }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-[90vh] transform overflow-hidden rounded-2xl bg-transparent p-6 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                    {filename}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-white hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Cerrar</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="h-[calc(90vh-6rem)] flex items-center justify-center">
                  <img
                    src={url}
                    alt={filename}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default function ImageViewer({ url, filename }: ImageViewerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800">
        <div className="flex-1 overflow-auto relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={url}
              alt={filename}
              className="max-w-full max-h-full object-contain"
              onError={() => setError('Error al cargar la imagen')}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 shadow-lg z-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
            Pantalla completa
          </button>
        </div>
        {error && (
          <div className="flex flex-col items-center justify-center text-red-500 p-4">
            <span className="mb-2">{error}</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
              download={filename}
            >
              Descargar imagen
            </a>
          </div>
        )}
      </div>
      <ImageViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={url}
        filename={filename}
      />
    </>
  );
} 