# Private Blockchain

This is my implentation of Udacity&rsquo;s Blockchain Developer Nanodegree Private Blockchain project.

## Prerequisites

- [`yarn`](https://yarnpkg.com/lang/en/docs/install): >=1.15.2.
- `node`: >=8.9.4 <12.0.0.

## Install dependencies

```
yarn install
```

## Testing

This project as a full test suite implementing all validation described in the probject&rsquo; rubric. To run it:

```
yarn test
```

## Running

Before running the web server, you need to create a `.env` file in the root of the project.

```
cp .env.example .env 
```

Set the desired values for the environment variables in the `.env` file, for example:

```bash
PORT=8000
BLOCKCHAIN_DATA_STORAGE_DIRECTORY=./chaindata
VALIDATION_REQUEST_WINDOW=300
VALIDATION_EXPIRATION=1800
```

Now you can start the server:

```bash
yarn start
```

## Endpoints

<table style="table-layout: fixed; width: 100%;">
  <thead>
    <tr>
      <td>Path</td>
      <td>Response Code</td>
      <td>Response Body</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan=2><code>GET /block/{height}</code></td>
      <td><code>200</code>: when block exists for <code>height</code></td>
      <td>
      <pre>
{
  height: Number,
  time: UnixTimestamp,
  body: Any,
  hash: String,
  previousBlockHash: String,
}
      </pre>
      </td>
    </tr>
    <tr>
      <td><code>404</code>: when block does not exist for <code>height</code></td>
      <td>
      <pre>
{
  error: {
    message: String,
    code: String,
    cause?: {
      message: String,
    } 
  }
}
      </pre>
      </td>
    </tr>
    <tr>
      <td rowspan=2><code>POST /block</code></td>
      <td><code>200</code>: when body <code>.body</code> is valid</td>
      <td>
      <pre>
{
  height: Number,
  time: UnixTimestamp,
  body: Any,
  hash: String,
  previousBlockHash: String,
}
      </pre>
      </td>
    </tr>
    <tr>
      <td><code>422</code>: when body <code>.body</code> is invalid</td>
      <td>
      <pre>
{
  error: {
    message: String,
    code: String,
    cause?: {
      message: String,
    } 
  }
}
      </pre>
      </td>
    </tr>
    <tr>
      <td><code>POST /requestValidation</code></td>
      <td><code>200</code></td>
      <td>
      <pre>
{
  walletAddress: String,
  requestTimeStamp: UnixTimestamp,
  "message": String,
  "validationWindow": Number,
}
      </pre>
      </td>
    </tr>
    <tr>
      <td rowspan=3><code>POST /message-signature/validate</code></td>
      <td><code>200</code>: when <code>signature</code> is valid for the <code>address</code></td>
      <td>
      <pre>
{
  "registerStar": true,
  "status": {
    "address": String,
    "requestTimeStamp": UnixTimestamp,
    "message": String,
    "validationWindow": Number,
    "messageSignature": true
  }
}
      </pre>
      </td>
    </tr>
    <tr>
      <td><code>404</code>: when there is no pending validation for the <code>address</code></td>
      <td>
      <pre>
{
  error: {
    message: String,
    code: String,
    cause?: {
      message: String,
    } 
  }
}
      </pre>
      </td>
    </tr>
    <tr>
      <td><code>403</code>: when the <code>signature</code> is invalid</td>
      <td>
      <pre>
{
  error: {
    message: String,
    code: String,
    cause?: {
      message: String,
    } 
  }
}
      </pre>
      </td>
    </tr>
    <tr>
      <td><code>GET /stars/hash:{hash}</code></td>
      <td><code>200</code></td>
      <td>
      <pre>
{
  height: Number,
  time: UnixTimestamp,
  body: Any,
  hash: String,
  previousBlockHash: String,
}
      </pre>
      </td>
    </tr>
    <tr>
      <td><code>GET /stars/address:{address}</code></td>
      <td><code>200</code></td>
      <td>
      <pre>
[
  {
    height: Number,
    time: UnixTimestamp,
    body: Any,
    hash: String,
    previousBlockHash: String,
  }?
  ...
]
      </pre>
      </td>
    </tr>
  </tbody>
</table>

## Remarks

- This project uses Express.js
