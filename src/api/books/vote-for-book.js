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

        const book = data.books[index];
        if( indexOfUser >= 0){
            book.votes -= 1;
            book.votedUsers.splice( indexOfUser, 1);
        }else {
            book.votes += 1;
            book.votedUsers.push( user );
        }

        res.sendStatus(204);
    }else {
        res.sendStatus(400);
    }
};
