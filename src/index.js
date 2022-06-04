const app = require("./app");
const { PORT } = require("./config/config");
const connect = require("./config/connect");


app.listen(PORT, async () => {
    await connect();
    console.log(`Server is running on port ${PORT}`);
});