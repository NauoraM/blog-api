const fs = require('fs');

module.exports = {
    addPlayerPage: (req, res) => {
        res.render('add-comment.ejs', {
            title: "Welcome to My Blog | Add a new comment"
            ,message: ''
        });
    },
    addPlayer: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

let usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + username + "'";

db.query(usernameQuery, (err, result) => {
    if (err) {
        return res.status(500).send(err);
    }
    if (result.length > 0) {
        message = 'Comment already exists';
        res.render('add-comment.ejs', {
            message,
            title: "Welcome to My Blog | Add a new comment"
        });
    } else {
        // check the filetype before uploading it
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
            // upload the file to the /public/assets/img directory
            uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                if (err) {
                    return res.status(500).send(err);
                }
                // send the player's details to the database
                let query = "INSERT INTO `players` (image, user_name) VALUES ('" +
                    image_name + "', '" + username + "')";
                db.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        } else {
            message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
            res.render('add-comment.ejs', {
                message,
                title: "Welcome to My Blog | Add a new comment"
            });
        }
    }
});
},
editPlayerPage: (req, res) => {
let playerId = req.params.id;
let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";
db.query(query, (err, result) => {
    if (err) {
        return res.status(500).send(err);
    }
    res.render('edit-comment.ejs', {
        title: "Edit Comment"
        ,player: result[0]
        ,message: ''
    });
});
},
editPlayer: (req, res) => {
let playerId = req.params.id;

let query = "UPDATE `players` SET `players`.`id` = '" + playerId + "'";
db.query(query, (err, result) => {
    if (err) {
        return res.status(500).send(err);
    }
    res.redirect('/');
});
},
deletePlayer: (req, res) => {
let playerId = req.params.id;
let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';

db.query(getImageQuery, (err, result) => {
    if (err) {
        return res.status(500).send(err);
    }

    let image = result[0].image;

    fs.unlink(`public/assets/img/${image}`, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        db.query(deleteUserQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    });
});
}
};