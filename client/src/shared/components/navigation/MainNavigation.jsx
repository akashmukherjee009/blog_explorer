import React, { useState } from 'react'
import './MainNavigation.css';      
import MainHeader from './MainHeader';
import { Link } from 'react-router-dom'
import NavLinks from './NavLinks';
import Backdrop from '../UIElement/Backdrop'
import SideDrawer from './SideDrawer';

const MainNavigation = () => {
  const [drawerIsOpen, setDrawerIsOpen]= useState(false)
  const openDrawerHandler= (props)=>{  
      setDrawerIsOpen(true)
  }
  const closeDrawerHandler= ()=>{  
    setDrawerIsOpen(false)
}
  return (
    <>
    {drawerIsOpen && <Backdrop onClick={closeDrawerHandler}/>}
    <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
       <nav className="main-navigation__drawer-nav">
          <NavLinks />
       </nav>
    </SideDrawer> 
    <MainHeader className="main-navigation__manu-btn">
      <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
        <span />
        <span />
        <span />
      </button>
      <h1 className="main-navigation__title">
        <Link to='/'>
         Your Places
        </Link>
      </h1> 
      <nav className="main-navigation__header-nav">
        <NavLinks />
      </nav>
    </MainHeader>
    </>
  )
}

export default MainNavigation
