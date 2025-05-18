import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({

    backgroundImage : {
        type: String,
        default : "https://plus.unsplash.com/premium_photo-1701534008693-0eee0632d47a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGlnaHQlMjBjb2xvciUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D"
    },
    image :{
        type: String,
    },
    text : {
        type: String,
    },
    secondaryText : {
        type: String,
    },
    coupon : {
        type : Boolean,
        default : false
    },
    couponCode : {
        type : String ,
    }

} , {timestamps : true})

const Notification = mongoose.model("Notification" , NotificationSchema)

export default Notification