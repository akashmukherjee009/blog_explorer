import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import Input from '../../shared/components/formElements/Input'
import Button from '../../shared/components/formElements/Button'
import './NewPlace.css'
import { useForm } from '../../hooks/form-hook';




const DUMMY_PLACES=[
    {
      id: 'p1',
      title:'NS Bulding',
      description: "Govt of WB",
      imageurl :'data:image/jpeg;base64,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',
      address: '1, Kiran Shankar Ray Rd, B.B.D. Bagh, Kolkata, West Bengal 700001',
      coordinates:{
        lat: 22.5696536,
        lng: 88.3406204
      },
      creator: 'u2'
    },
    {
      id: 'p2',
      title:'Empire State Bulding',
      description: "One of the most famous sky scrapers in the world",
      imageurl :'https://www.esbnyc.com/sites/default/files/2020-01/ESB%20Day.jpg',
      address: '20 W 34th St., New York, NY 10001, United States',
      coordinates:{
        lat: 40.7484445,
        lng: -73.9882393
      },
      creator: 'u1'
    }
  ]
  

const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

  useEffect(() => {
    setFormData(
      {
        title: {
          value: identifiedPlace.title,
          isValid: true
        },
        description: {
          value: identifiedPlace.description,
          isValid: true
        }
      },
      true
    );
    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find place!</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
