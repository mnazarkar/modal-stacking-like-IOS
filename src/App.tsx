import { useState } from 'react';
import './App.css'

import Modals from './Components/modals';
import type { ReactNode } from 'react';

type ModalItem = {
  onClose: () => void;
  content: ReactNode | (() => ReactNode);
};

function App() {
  const [modalsArray, setModalsArray] = useState<ModalItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setShowModal(true);
    setModalsArray((prev) => [
      ...prev,
      {
        onClose: handleCloseModal,
        content: (
          <div className='p-4 flex flex-col items-center justify-center'>
            <h2 className='text-xl font-bold mb-4'>Modal {prev.length + 1}</h2>
            <p>Content for modal {prev.length + 1}.</p>
            <button
              className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
              onClick={handleOpenModal}
            >
              Open Another Modal
            </button>
          </div>
        ),
      },
    ]);
  };
  const handleCloseModal = () => {
    modalsArray.length === 1 ? setShowModal(false) : null;
    setModalsArray((prev) => prev.slice(0, -1));
  }

  return (
    <>
    <div className='flex flex-col items-center justify-center gap-8 p-4 h-[100dvh] bg-gradient-to-tl from-pink-300 to-violet-600'>
      <h1 className="text-3xl font-bold text-[rgb(93_15_155)] text-center">IOS like Modal Stacking App</h1>
      <div className='text-center px-12'>
        <h3 className="text-lg text-black-600">Stack multiple modals like iOS</h3>
        <h3 className="text-md text-black-500">Drag down to close the top modal</h3>
        <h3 className="text-sm text-black-400">Switch to Mobile View for better experience if you are on desktop</h3>
      </div>
      <button
      className='px-4 py-2 bg-green-500 text-white rounded'
      onClick={handleOpenModal}
    >
      Open Modal
    </button>
    </div>
    {showModal && <Modals modalsArray={modalsArray} handleClose={()=> {setModalsArray((prev) => prev.slice(0, -1)); console.log('kkkkkkkkkkk');
    }} />}
    </>
  )
}

export default App
