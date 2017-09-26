const axios = require('axios');

function testBrightness() {
  axios.post('/brightness', {
    isNight: true,
  }).then((response) => {
    console.log(response);
  });
}

testBrightness();
