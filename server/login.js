const router = require('express').Router();
const response = require('./response');

const session_id = '5bfdc211bb18f3645cff4ce36c8fdb68';

router.post('/', (req, res) => {
  const login = req.query.login,
        user  = {login};

  response.ok(res, {session_id, user});
});

module.exports = router;
