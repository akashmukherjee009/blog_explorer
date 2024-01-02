import React from 'react'
import './UserList.css';
import UserItem from './UserItem';
import Card from '../../shared/components/UIElement/Card';


const UserList = (props) => {
    console.log(props.items.length);
    if (props.items.length=== 0) {
        return (
            <div className="center">
                <Card>
                    <h3>No User Found</h3>
                </Card>
            </div>
        )
    }else {
        return (
            <ul className='users-list'>
                {props.items.map((user)=>{
                   return ( <UserItem 
                        key={user.id} 
                        id={user.id} 
                        image={user.image} 
                        name={user.name} 
                        placeCount={user.places} 
                    />)
                })}
            </ul>
        )
    }
}

export default UserList
