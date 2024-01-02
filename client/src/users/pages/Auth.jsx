import React, { useState, useContext } from 'react';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/utils/validators';
import { useForm } from '../../hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';
import Button from '../../shared/components/formElements/Button';
import Card from '../../shared/components/UIElement/Card';
import Input from '../../shared/components/formElements/Input';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner'
import { useHttpClient } from '../../hooks/http-hook';
import { testHook } from '../../hooks/test-hook';



const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
 const { isLoading, error, sendRequest, clearError}= useHttpClient()

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();
    
        if (isLoginMode) {
          console.log(formState.inputs);
            const resData= await sendRequest('http://localhost:5000/users/login', 
            'POST',
            JSON.stringify({
              email: formState.inputs.email.value,
              password : formState.inputs.password.value
              
            }),
            {
              'Content-Type':'application/json'
            })

            // const resData= await res.json()
            // console.log(resData.user.id);
            // testHook()
            auth.login(resData.user.id);
        }else{
            const resData= await sendRequest('http://localhost:5000/users/signup', 
            'POST',
            {
              'Content-Type':'application/json'
            },
            JSON.stringify({
              name: formState.inputs.name.value,
              email: formState.inputs.email.value,
              password: formState.inputs.password.value
            }) 
            )
            // const resData= await res.json()
            // if (!res.ok) {
            //   throw new Error(resData.message)
            // }
            // console.log(resData);
            
            // console.log(formState.inputs);
            auth.login();
        }
   
    
    // setIsLoading(false)
    // console.log(formState.inputs);
    // auth.login();
  };
  // const errorHandler= ()=>{
  //   setError(null)
  // }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <Card className="authentication">
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password, at least 5 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </>
  );
};

export default Auth;