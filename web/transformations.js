function encodeStory({
  body: { star: { story, ...starRest } = {}, ...bodyRest },
  ...rest
}) {
  const starMixin = story
    ? {
        star: {
          ...starRest,
          story: Buffer.from(story, 'utf8').toString('hex'),
        },
      }
    : {};

  return {
    ...rest,
    body: {
      ...bodyRest,
      ...starMixin,
    },
  };
}

function withDecodedStory({
  body: { star: { story, ...starRest } = {}, ...bodyRest },
  ...rest
}) {
  const starMixin = story
    ? {
        star: {
          ...starRest,
          story,
          decodedStory: Buffer.from(story, 'hex').toString('utf8'),
        },
      }
    : {};

  return {
    ...rest,
    body: {
      ...bodyRest,
      ...starMixin,
    },
  };
}

module.exports = {
  encodeStory,
  withDecodedStory,
};
