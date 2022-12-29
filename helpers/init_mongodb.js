const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("mongoDB connect");
    })
    .catch((err) => {
        console.log(err.message);
    });

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to db");
});

mongoose.connection.on("error", (error) => {
    console.log(error.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected");
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});
