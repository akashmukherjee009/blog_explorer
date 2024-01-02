import React from 'react'
import './PlaceList.css';
import Card from '../../shared/components/UIElement/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/formElements/Button';

const PlaceList = props => {
    if (props.items.length===0) {
        return (
            <div className='place-list center'>
              <Card>
                <h2>No Places found. Maybe create one?</h2>
                <Button to="/places/new">Create Places</Button>
              </Card>
            </div>
        )
    } else {
        return(
            <ul className="place-list">
                {props.items.map(place=>
                    <PlaceItem 
                        key={place.id} 
                        id={place.id} 
                        image={place.imageurl} 
                        title={place.title} 
                        description={place.description} 
                        address={place.address} 
                        creatorId={place.creator} 
                        coordinates={place.location}   
                    />
                )}
            </ul>
        )
    }
  
  
}


export default PlaceList
