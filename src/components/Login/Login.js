import React, { useState, useEffect, useReducer, useContext, useRef } from "react";
import AuthContext from "../../store/auth-context";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import Input from "../Input/Input";

const emailReducer = (state, action) => {
  return { value: action.value, isValid: action.value.includes("@") };
};

const passwordReducer = (state, action) => {
  return { value: action.value, isValid: action.value.length > 6 };
};

const Login = (props) => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const context = useContext(AuthContext);
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFormIsValid(emailState.isValid && passwordState.isValid);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [emailState.isValid, passwordState.isValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "EMAIL_INPUT_CHANGE", value: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({
      type: "PASSWORD_INPUT_CHANGE",
      value: event.target.value,
    });
  };

  const validateEmailHandler = (event) => {
    dispatchEmail({ type: "EMAIL_VALIDATION", value: event.target.value });
  };

  const validatePasswordHandler = (event) => {
    dispatchPassword({
      type: "PASSWORD_VALIDATION",
      value: event.target.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      context.onLogin(emailState.value, passwordState.value);
    } else if (!emailState.isValid) {
      emailInputRef.current.focus();
    } else if (!passwordState.isValid) {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          inputState={emailState}
          onBlur={validateEmailHandler}
          onChange={emailChangeHandler}
          type={"email"}
          id={"email"}
          label={"E-Mail"}
        />
        <Input
          ref={passwordInputRef}
          inputState={passwordState}
          onBlur={validatePasswordHandler}
          onChange={passwordChangeHandler}
          type={"password"}
          id={"password"}
          label={"Password"}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
