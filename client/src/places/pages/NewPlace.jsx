import React, { useContext } from 'react'
import './NewPlace.css';
import Input from '../../shared/components/formElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import Button from '../../shared/components/formElements/Button';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';




const NewPlace = props => {
  const { isLoading, error, sendRequest, clearError }= useHttpClient()
  const auth= useContext(AuthContext)
 const [formState, inputHandler]= useForm({
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      }
    },
    false
  );
  
  const placeSubmitHandler= (e)=>{
    e.preventDefault()
    console.log(formState.inputs);
    console.log(auth.userId);
    try {
      sendRequest(
        'http://localhost:5000/places/', 
        'POST', 
        {
          'Content-Type':'application/json'
        },
        {
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: auth.userId
        }
       
      )
    } catch (error) {
      
    }
    

  }
  return (
    <>
       <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay/>
        </div>
      )}

      <form className="place-form" onSubmit={placeSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid body."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
      </form>
    </>
  )
}



export default NewPlace
