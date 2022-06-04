module.exports = {
    PORT: process.env.PORT || 4000,
    MONGODB: {
        HOST: process.env.MONGO_HOST || 'maincluster.8ay6m.mongodb.net',
        USER: process.env.MONGO_USER || 'root',
        PASSWORD: process.env.MONGO_PASSWORD || 'root',
        DB: process.env.MONGO_DB || 'todo-family'
    },
    JWT: {
        SECRET: process.env.JWT_SECRET || 'secret'
    }
};
