 function handleSocket(io,socket){
    console.log("User is connected!!",socket.id); 

    socket.on("join-meeting",({meetingId})=>{
        socket.join(meetingId);
        console.log("user joined meeting",socket.id);
    })
    socket.on("client-msg",({message,userName,meetingId})=>{
        const data ={userName,message};
        io.to(meetingId).emit("server-msg",data);
    })
}

module.exports = {handleSocket}