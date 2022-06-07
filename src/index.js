const app = require("./app");
const { PORT } = require("./config/config");
const {connect, connectLocal} = require("./config/connect");


app.listen(PORT, async () => {
    connectLocal();
    console.log(`Server is running on port ${PORT}`);
});