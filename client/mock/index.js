const express = require('express');
const app = express();

app.get('/home_list', (req, res) => {
  res.json({
    code: 0,
    list: [
      { name: 'course 1', id: 1 },
      { name: 'course 2', id: 2 },
      { name: 'course 3', id: 3 },
      { name: 'course 4', id: 4 },
    ],
  });
});

app.get('/user_info', (req, res) => {
  res.json({
    code: 0,
    userInfo: { name: '见路不走', id: 1 },
  });
});

app.listen(9098, () => console.log('mock listen'));
