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
          className="!rounded-t-lg z-10 h-[100%] min-h-[60%] bg-white bottom-0 fixed w-full"
          onAnimationEnd={() => {
            if (modalRef.current[index]) {
              modalRef.current[index].style.animation = 'none';
            }
          }}
          onClick={(e) => e.stopPropagation()}
          style={getElementStyle(isTop, depth)}
        >
          <div
            className="pdrag__draggables lg:hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(onClose)}
          >
            <div className="pdrag__draggable" />
          </div>

          {typeof content === 'function' ? content() : content}
        </div>
      );
    });
  };

  const getModalStack = (modalsArray: ModalItem[]) => {
    if (!modalsArray.length) return null;

    return (
      <div className='h-full w-full fixed inset-0 bg-black/50' onClick={() => handleCloseFunc(handleClose)}>
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