const mongoose = require("mongoose")

mongoose.connect(`${process.env.db}`)
.then(()=>{
    console.info('*** Database Ticketac connection : Success ***');
})
.catch(()=>{
    console.log("error, failed to connect to the database")
})