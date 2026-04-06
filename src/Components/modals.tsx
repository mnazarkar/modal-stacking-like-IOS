import useModalStack from "../CustomHook/useModalStack";
import type { ReactNode } from 'react';

type ModalItem = {
  onClose: () => void;
  content: ReactNode | (() => ReactNode);
};
type Props = {
  modalsArray: ModalItem[];
  handleClose: () => void;
};

const Modals = ({modalsArray, handleClose}: Props) => {
    const { registerModal, handleCloseFunc, handleTouchStart, handleTouchMove, handleTouchEnd, getElementStyle, modalRef } = useModalStack();

    const renderArray = (modalsArray: ModalItem[]) => {
    return modalsArray.map(({ onClose, content }, index) => {
      const isTop = modalsArray.length - 1 === index;
      const depth = modalsArray.length - 1 - index;

      return (
        <div
          ref={(el) => registerModal(el, index)}
          key={index}
          className="slideUpAnimation !rounded-t-lg z-10 min-h-[60%] bg-white bottom-0 fixed w-full touch-none select-none"
          onPointerDown={handleTouchStart}
          onPointerMove={handleTouchMove}
          onPointerUp={() => handleTouchEnd(onClose)}
          onAnimationEnd={() => {
            if (modalRef.current[index]) {
              modalRef.current[index].style.animation = 'none';
            }
          }}
          onClick={(e) => e.stopPropagation()}
          style={getElementStyle(isTop, depth)}
        >
          <div
            className="h-[48px] cursor-grab flex items-center justify-center"
          >
            <div className="w-8 h-1 bg-gray-300 rounded-full" />
          </div>

          {typeof content === 'function' ? content() : content}
        </div>
      );
    });
  };

  const getModalStack = (modalsArray: ModalItem[]) => {
    if (!modalsArray.length) return null;

    return (
      <div className='h-full w-full fixed inset-0 bg-black/50 backdrop-blur-xl' onClick={() => handleCloseFunc(handleClose)}>
        {renderArray(modalsArray)}
      </div>
    );
  };
    return (
        <div>
            {getModalStack(modalsArray)}
        </div>
    );
};
export default Modals;