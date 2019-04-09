const { toUnixTimestamp } = require('../utils/date');

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

function withDecodedStory({ body, ...rest }) {
  if (Object(body) !== body) {
    return { ...rest, body };
  }

  const { star: { story, ...starRest } = {}, ...bodyRest } = body;
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

const toOutputBlock = ({ time, ...rest }) => ({
  ...withDecodedStory(rest),
  time: String(toUnixTimestamp(new Date(time))),
});

const toInputBlock = block => encodeStory(block);

module.exports = {
  toInputBlock,
  toOutputBlock,
};
