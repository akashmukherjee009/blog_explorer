import React from 'react'
import './Modal.css'
import Backdrop from './Backdrop'
import { CSSTransition } from 'react-transition-group'


const ModalOverlay = props => {
    
    return (
      <div className={`modal ${props.className}`} style={props.style}>
        <header className={`modal__header ${props.headerClass}`}>
            <h2>{props.header}</h2>
        </header>
        <form onSubmit={props.onSubmit ? props.onSubmit : event=> event.preventDefault()}>
            <div className={`modal__content ${props.headerClass}`}>
            {props.children}
            </div>
        
            <footer className={`modal__footer ${props.headerClass}`}>
                {props.footer}
            </footer>
        </form>
        
      </div>
    )
  }


const Modal = props => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel}/>}
      <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={200} classNames="modal">
        <ModalOverlay {...props}/>
      </CSSTransition>
      
    </>
  )
}


export default Modal
