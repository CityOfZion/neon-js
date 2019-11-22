const axios = require("axios").default;

const pullRequestUrl = process.argv[2];
const pullRequestNumber = /https:\/\/github.com\/.*\/.*\/pull\/(\d+)/.exec(
  pullRequestUrl
)[1];
axios
  .get(
    `https://api.github.com/repos/cityofzion/neon-js/pulls/${pullRequestNumber}`
  )
  .then(res => {
    console.log(res.data.base.ref);
  });
