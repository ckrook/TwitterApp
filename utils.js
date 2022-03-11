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

function mydate(d) {
  var mL = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  d = new Date(d);
  const y = d.getFullYear();
  const m = mL[d.getMonth()];
  console.log(y);
  console.log(m);
  return "Joined " + m + " " + y;
}

function getUniqueFilename(filename) {
  const timestamp = Date.now();
  const extension = filename.split(".").pop();
  return `${timestamp}.${extension}`;
}

function genPassword() {
  var chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var passwordLength = 12;
  var password = "";
  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
}

module.exports = {
  hashedPassword,
  comparePassword,
  timeAgo,
  getUniqueFilename,
  genPassword,
  mydate,
};
