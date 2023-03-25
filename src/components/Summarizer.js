import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, CardBody, CardHeader } from 'reactstrap';
import Header from './Header';
import InputForm from './InputForm';
import Summary from './Summary';

const Summarizer = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
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

    if (process.env.REACT_APP_ENVIRONMENT !== 'local' && !captchaValue) {
      console.log('ENVIRONMENT: ', process.env.REACT_APP_ENVIRONMENT);
      setError('Please complete the captcha.');
      return;
    }

    setIsLoading(true); // Set isLoading to true when form is submitted

    try {
      const response = await axios.post(
        `https://e1jvh3piz8.execute-api.eu-west-3.amazonaws.com/summarize?text_to_summarize=${encodeURIComponent(
          inputText
        )}&captcha=${encodeURIComponent(captchaValue)}`
      );

      // Log the request payload
      console.log('Request payload: ', inputText);

      // Access the correct property from the API response
      setSummary(response.data['summarized_content']);
      console.log('Summarized content: ', response);
      setError(null);
    } catch (err) {
      setError('Error: Could not fetch summary.' + err);
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
    <>
      <Header />
      <Container className="mt-4">
        <Card>
          <CardHeader>
            <h4>Enter your text to summarize:</h4>
          </CardHeader>
          <CardBody>
            <InputForm
              inputText={inputText}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleCaptchaChange={handleCaptchaChange}
              captchaValue={captchaValue}
              isLoading={isLoading}
            />
          </CardBody>
        </Card>
        {error && <div className="error mt-4">{error}</div>}
        {summary && (
          <Card className="mt-4">
            <CardHeader>
              <h4>Summary:</h4>
            </CardHeader>
            <CardBody>
              <Summary summary={summary} handleCopy={handleCopy} isCopied={isCopied} />
            </CardBody>
          </Card>
        )}
      </Container>
    </>
  );
};

export default Summarizer;
