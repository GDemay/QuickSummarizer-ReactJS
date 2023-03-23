import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, FormGroup, Label, Input, Alert, Card, CardBody, CardHeader, Spinner } from "reactstrap";
import ReCAPTCHA from "react-google-recaptcha";
import "./App.css";
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
Amplify.configure(awsExports);

function App() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!captchaValue) {
    setError("Please complete the captcha.");
    return;
  }

  setIsLoading(true); // Set isLoading to true when form is submitted

  try {
    const response = await axios.post(
      `https://e1jvh3piz8.execute-api.eu-west-3.amazonaws.com/summarize?text_to_summarize=${encodeURIComponent(inputText)}&captcha=${encodeURIComponent(captchaValue)}`,
    );

    // Log the request payload
    console.log("Request payload: ", inputText);

    // Access the correct property from the API response
    setSummary(response.data["Summarize content"]);
    setError(null);
  } catch (err) {
    setError("Error: Could not fetch summary." + err);
    console.log(err)
  } finally {
    setIsLoading(false); // Set isLoading back to false after the request is complete
  }
};

  const handleCopy = () => {
    navigator.clipboard.writeText(summary); // Copy the summary to clipboard
    setIsCopied(true); // Set isCopied to true to show the tooltip
    setTimeout(() => {
      setIsCopied(false); // Set isCopied back to false after a few seconds to hide the tooltip
    }, 3000);
  };


return (
  <Container className="App">
    <a href="https://www.quicksummarizer.com">
      <h1 className="mt-4 mb-4">Quick Summarizer</h1>
    </a>
    <Card className="mb-4">
      <CardHeader>
        Quick Summarizer is an advanced AI-powered tool that quickly summarizes your text with high accuracy.
      </CardHeader>
      <CardBody>
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
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
          />
          <Button color="primary">Summarize</Button>
          {isLoading && <Spinner color="primary" />} {/* Show spinner while isLoading is true */}
        </Form>
      </CardBody>
    </Card>
    {error && <Alert className="mt-4" color="danger">{error}</Alert>}
    {summary && (
      <Card className="mb-4">
        <CardHeader>Summary</CardHeader>
        <CardBody>
          <p>{summary}</p>
          <Button onClick={handleCopy}>Copy</Button>
          {isCopied && <div className="alert alert-success" role="alert">Copied to clipboard!</div>} {/* Show the tooltip when isCopied is true */}
        </CardBody>
      </Card>
    )}
  </Container>
);

}

export default App;
