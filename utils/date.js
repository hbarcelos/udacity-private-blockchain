const { DateTime } = require('luxon');

function toUnixTimestamp(date) {
  return Math.floor(DateTime.fromJSDate(date).toSeconds());
}

function toDuration({ end, start, as = 'seconds' }) {
  return Math.floor(
    DateTime.fromJSDate(end)
      .diff(DateTime.fromJSDate(start))
      .as(as)
  );
}

function plus({ initial, duration }) {
  return DateTime.fromJSDate(initial)
    .plus(duration)
    .toJSDate();
}

module.exports = { toUnixTimestamp, toDuration, plus };
