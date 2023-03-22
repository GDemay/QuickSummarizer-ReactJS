import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, FormGroup, Label, Input, Alert, Card, CardBody, CardHeader, Spinner } from "reactstrap";
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

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the inputText is empty
    if (!inputText.trim()) {
      setError("Error: Please enter text to summarize.");
      return;
    }

    setIsLoading(true); // Set isLoading to true when form is submitted

    try {
    const response = await axios.post(
      `https://e1jvh3piz8.execute-api.eu-west-3.amazonaws.com/summarize?text_to_summarize=${encodeURIComponent(inputText)}`,
      {} // Pass an empty object as the request body since the required data is in the query parameter
    );

      // Log the request payload
      console.log("Request payload: ", inputText);

      // Access the correct property from the API response
      setSummary(response.data["Summarize content"]);
      setError(null);
    } catch (err) {
      setError("Error: Could not fetch summary.");
    } finally {
      setIsLoading(false); // Set isLoading back to false after the request is complete
    }
  };

  return (
    <Container className="App">
      <h1 className="mt-4 mb-4">Text Summarizer</h1>
      <Card className="mb-4">
        <CardHeader>Text to Summarize</CardHeader>
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
          </CardBody>
        </Card>
      )}
    </Container>
  );
}

export default App;
