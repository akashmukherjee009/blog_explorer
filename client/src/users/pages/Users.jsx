import React, { useEffect, useState } from 'react'
import UserList from '../components/UserList'
import ErrorModal from '../../shared/components/UIElement/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner'

const Users = () => {  
  const [isLoading, setIsLoading]= useState(false)
  const [error, setError]= useState()
  const [loadedUsers, setLoadedUsers]= useState()
  // const USERS = [
  //   {
  //     id: 'u1',
  //     name: 'Max Schwarz',
  //     image:
  //       'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  //     places: 1
  //   }
  // ];
  useEffect(()=>{
    try {
      const sendReq= async ()=>{
        setIsLoading(true)
        const res= await fetch('http://localhost:5000/users')
        const  resData= await res.json()
        if (!res.ok) {
          throw new Error(resData.message)
        } 
        setLoadedUsers(resData.users)
        setIsLoading(false)
      }  
      sendReq()
    } catch (error) {
      setIsLoading(false)
      setError(error.message)
    }
    
  }, [])
  const errorHandler= ()=>{
    setError(null)
  }
  return (
    <div>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UserList items={loadedUsers}/> }
    </div>
  )
}

export default Users
