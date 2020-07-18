// pre-hashed password for "abc12345"
const hashedPassword =
    "$2a$14$qHqCbXUImiBOgXlFNX47wuA7uFWNGNAZutYLvOeye9eotewGlfYV6";

exports.seed = async function (knex) {
    await knex("users").insert([
        {
            username: "janedoe",
            password: hashedPassword,
        },
        {
            username: "jackdoe",
            password: hashedPassword,
        },
    ]);
};
