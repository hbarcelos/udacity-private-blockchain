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
yarn test --coverage
```

## Manual inspection

You are free to mess around with the `index.js` file.

As it is, you can check the funcionality by running:

```
yarn clean
yarn start
```

This will: 

1. Remove the `./chaindata` directory 
2. Recreate the blockchain with 200 blocks.
    - The chain should be valid: `blockchain.validateChain() === true`
3. Introduce invalid blocks at heights `4`, `7` and `20`.
    - Now the chain will be invalidated: `blockchain.validateChain() === false`

## Remarks

- There are no classes in this project. All objects are created using proper factory functions.
- This project uses LevelDB promise API instead of callbacks.
