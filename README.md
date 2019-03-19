# Private Blockchain

This is my implentation of Udacity&rsquo;s Blockchain Developer Nanodegree Private Blockchain project.

## Prerequisites

This project uses [`yarn`](https://yarnpkg.com/lang/en/docs/install) as package manager.

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
cp sample.env .env
```

Set the desired values for the environment variables in the `.env` file:

```bash
PORT=8000
BLOCKCHAIN_DATA_STORAGE_DIRECTORY=./chaindata
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
      <td rowspan=2><code>GET /block/:height</code></td>
      <td><code>200</code>: when block exists for <code>height</code></td>
      <td>
      <pre>
{
  height: Number,
  time: ISODate,
  body: Any,
  hash: String,
  previousBlockHash: String,
}
      </pre>
      </td>
    </tr>
    <tr>
      <td><code>400</code>: when block does not exist for <code>height</code></td>
      <td>
      <pre>
{
  error: {
    message: String,
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
  time: ISODate,
  body: Any,
  hash: String,
  previousBlockHash: String,
}
      </pre>
      </td>
    </tr>
    <tr>
      <td><code>400</code>: when body <code>.body</code> is invalid</td>
      <td>
      <pre>
{
  error: {
    message: String,
    cause?: {
      message: String,
    } 
  }
}
      </pre>
      </td>
    </tr>
  </tbody>
</table>

## Remarks

- This project uses Express.js
