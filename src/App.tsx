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
          <div className='p-4'>
            <h2 className='text-xl font-bold mb-4'>Modal {prev.length + 1}</h2>
            <p>This is the content of modal {prev.length + 1}.</p>
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
    <div className='flex flex-col items-center justify-center gap-8 h-[200px]'>
      <h1 className="text-3xl font-bold text-red-600 text-center">IOS like Modal Stacking App</h1>
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
