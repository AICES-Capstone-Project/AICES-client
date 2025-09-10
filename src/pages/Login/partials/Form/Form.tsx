import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import "antd/dist/reset.css";

import FormError from "../../../../components/FormError/FormError";
import styles from "./Form.module.scss";

const Form: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [formError, setFormError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const handleSubmit = () => {
    let hasError = false;
    setFormError("");
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Please enter your password.");
      hasError = true;
    }

    if (hasError) {
      setFormError("Please fix the errors below.");
      return;
    }

    navigate("/");
  };

  return (
    <div className={styles.login_form}>
      <div className={styles.heading_wrapper}>
        <div className={styles.heading}>
          <div className={styles.title}>Log in</div>

          <div className={styles.create_account_wrapper}>
            <div className={styles.create_account_text}>
              Don&apos;t have an account?
            </div>
            <div
              className={styles.create_account_link}
              onClick={() => navigate("/register")}
            >
              Register
            </div>
          </div>
        </div>
      </div>

      <div className={styles.input_container}>
        {formError && <FormError type="error">{formError}</FormError>}

        <div className={styles.input_wrapper}>
          <Input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            status={emailError ? "error" : undefined}
            className={styles.input_field}
          />
          {emailError ? (
            <div className={styles.field_error}>{emailError}</div>
          ) : null}
        </div>

        <div className={styles.input_wrapper}>
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            status={passwordError ? "error" : undefined}
            className={styles.input_field}
          />
          {passwordError ? (
            <div className={styles.field_error}>{passwordError}</div>
          ) : null}
        </div>

        <div className={styles.checkbox_container}>
          <p className={styles.agree_text}>
            <span
              className={styles.terms_link}
              onClick={() => navigate("/forgot-password")}
            >
              Forget password
            </span>
          </p>
        </div>
      </div>

      <Button
        type="default"
        size="large"
        className={styles.success_button}
        onClick={handleSubmit}
        block
      >
        Log in
      </Button>
    </div>
  );
};

export default Form;
