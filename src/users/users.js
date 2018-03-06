const data = require('../../data');

module.exports = (req, res) => {

    res.status(201).json({
        user : data.userModel.getUser()
    });
};
