import React, { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';

import axios from "axios";
import {
  Container,
  Form,
  Button,
  FormGroup,
  Label,
  Alert,
    Spinner,
    Card,
    CardBody,
} from "reactstrap";
import ReCAPTCHA from "react-google-recaptcha";
import "./App.css";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
Amplify.configure(awsExports);

function App() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const currentYear = new Date().getFullYear();

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (process.env.REACT_APP_ENVIRONMENT !== "local" && !captchaValue) {
      console.log("ENVIRONMENT: ", process.env.REACT_APP_ENVIRONMENT);
      setError("Please complete the captcha.");
      return;
    }

    setIsLoading(true); // Set isLoading to true when form is submitted

    try {
      const response = await axios.post(
        `https://e1jvh3piz8.execute-api.eu-west-3.amazonaws.com/summarize?text_to_summarize=${encodeURIComponent(
          inputText,
        )}&captcha=${encodeURIComponent(captchaValue)}`,
      );

      // Log the request payload
      console.log("Request payload: ", inputText);

      // Access the correct property from the API response
      setSummary(response.data["summarized_content"]);
      console.log("Summarized content: ", response);
      setError(null);
    } catch (err) {
      setError("Error: Could not fetch summary." + err);
      console.log(err);
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
  <Container className="col-lg-8 mx-auto p-3 py-md-5">
    <header className="d-flex align-items-center pb-3 mb-5 border-bottom">
      <a href="https://www.quicksummarizer.com" className="d-flex align-items-center text-dark text-decoration-none">
        <h1 className="fs-4">Quick Summarizer</h1>
      </a>
    </header>
    <main>
      <h1>Advanced AI-powered Text Summarizer</h1>
      <p className="fs-5 col-md-8">Quickly and accurately summarize your text with our advanced AI-powered text summarizer.</p>
      <Card className="mb-4">
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="textToSummarize">Enter your text:</Label>
              <TextareaAutosize
                minRows={3}
                maxRows={10}
                name="text"
                id="textToSummarize"
                value={inputText}
                onChange={handleChange}
                className="form-control mb-3"
              />
            </FormGroup>
            {process.env.REACT_APP_ENVIRONMENT !== "local" && (
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
                className="mb-3"
              />
            )}
            <Button color="primary" className="mb-3">
              Summarize
            </Button>
            {isLoading && (
              <div className="d-flex justify-content-center mt-3">
                <Spinner color="primary" />
              </div>
            )}
          </Form>
          {error && (
            <Alert className="mt-4" color="danger">
              {error}
            </Alert>
          )}
        </CardBody>
      </Card>
      {summary && (
        <Card>
          <CardBody>
            <div>
              <h2>Summary</h2>
              <p>{summary}</p>
              <Button onClick={handleCopy} color="success">
                Copy
              </Button>
              {isCopied && (
                <div className="alert alert-success mt-3" role="alert">
                  Copied to clipboard!
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </main>
    <footer className="pt-5 my-5 text-muted border-top">
      Created by Guillaume Demay &middot; &copy; {currentYear}
    </footer>
  </Container>
);



}

export default App;