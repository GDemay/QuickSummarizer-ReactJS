import React from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
} from 'reactstrap';
import ReCAPTCHA from 'react-google-recaptcha';

const InputForm = ({
  inputText,
  isLoading,
  captchaValue,
  handleChange,
  handleCaptchaChange,
  handleSubmit,
}) => (
  <Form onSubmit={handleSubmit}>
    <FormGroup className="Input">
      <Label for="textToSummarize">Enter your text:</Label>
      <Input
        type="textarea"
        name="text"
        id="textToSummarize"
        value={inputText}
        onChange={handleChange}
      />
    </FormGroup>
    {process.env.REACT_APP_ENVIRONMENT !== 'local' && (
      <ReCAPTCHA
        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
        onChange={handleCaptchaChange}
      />
    )}
    <Button color="primary">Summarize</Button>
    {isLoading && <Spinner color="primary" />}
  </Form>
);

export default InputForm;
