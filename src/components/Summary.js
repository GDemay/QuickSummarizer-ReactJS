import React from 'react';
import { Alert, Card, CardBody, CardHeader, Button } from 'reactstrap';

const Summary = ({ error, summary, isCopied, handleCopy }) => (
  <>
    {error && <Alert className="mt-4" color="danger">{error}</Alert>}
    {summary && (
      <Card className="mb-4">
        <CardHeader>Summary</CardHeader>
        <CardBody>
          <p>{summary}</p>
          <Button onClick={handleCopy}>Copy</Button>
          {isCopied && (
            <div className="alert alert-success" role="alert">
              Copied to clipboard!
            </div>
          )}
        </CardBody>
      </Card>
    )}
  </>
);

export default Summary;
