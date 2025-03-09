const userModel = require("../models/user.model");

module.exports.createUser = async ({
    name, password, email, username
}) => {
    if (!name || !password || !email || !username) {
        throw new Error('Missing required fields');
    }

    const user = userModel.create({
        name,
        password,
        email,
        username
    }) 

    return user;
}