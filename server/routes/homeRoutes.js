const router = require('express').Router();
const path = require('path');

router.route('/index')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });

// updated code
router.route('*')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
// here is the original code (including the comment)
// DO NOT COMMENT OUT THIS CODE
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
//   });



module.exports = router;