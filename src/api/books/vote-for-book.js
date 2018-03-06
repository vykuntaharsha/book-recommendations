const data = require('../../../data');
const isValidUser = require('../validation').isValidUser;

module.exports = (req, res) =>{

    const isbn = req.params.id;
    const user = req.body.user || null;
    if( !user ){
        res.sendStatus(400);
        return ;
    }
    const index = data.books.findIndex( book => book.isbn === isbn );

    if( index >= 0 && isValidUser(user) ){
        const indexOfUser = data.books[index].votedUsers.findIndex( u => u.id === user.id);

        if( indexOfUser >= 0){
            data.books[index].votes -= 1;
            data.books[index].votedUsers.splice( indexOfUser, 1);
        }else {
            data.books[index].votes += 1;
            data.books[index].votedUsers.push( user );
        }

        res.sendStatus(204);
    }else {
        res.sendStatus(400);
    }
};
