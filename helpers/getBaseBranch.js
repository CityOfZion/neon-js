const axios = require("axios").default;

const pullRequestNumber = process.argv[2];

axios
  .get(
    `https://api.github.com/repos/cityofzion/neon-js/pulls/${pullRequestNumber}`
  )
  .then(res => {
    console.log(res.data.base.ref);
  });
