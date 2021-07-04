module.exports = {
    create(newUser, dbo) {
        dbo.collection("users").insertOne(newUser, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });
    },
    findByEmail(email, dbo) {
        
    }
}