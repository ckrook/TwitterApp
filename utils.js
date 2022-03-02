const bcrypt = require("bcrypt");

const hashedPassword = (password) => {
  const hash = bcrypt.hashSync(password, 8);
  return hash;
};

const comparePassword = (password, hash) => {
  const correct = bcrypt.compareSync(password, hash);
  return correct;
};

function timeAgo(input) {
  //https://stackoverflow.com/a/69122877/1977850
  const date = input instanceof Date ? input : new Date(input);
  const formatter = new Intl.RelativeTimeFormat("en");
  const ranges = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;
  for (let key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key];
      return formatter.format(Math.round(delta), key);
    }
  }
}

module.exports = {
  hashedPassword,
  comparePassword,
  timeAgo,
};
