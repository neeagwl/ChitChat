const Users =[];

//add a new user
const addUser=({id,username, room})=>{
    //claen data
    username= username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if(!username || !room){
        return {
            error: "Username and Room are required."
        }
    }

    //look for existin user in same room
    const existsUser = Users.find((user)=>{
        return user.room ===room && user.username===username;
    })

    if(existsUser){
        return{
            error:"Username already exist!"
        }
    }

    //store user
    const user ={id, username, room};
    Users.push(user);
    return {user};
}

//remove user
const removeUser =(id)=>{
    const index = Users.findIndex((user)=>{
        return user.id===id
    })
    if(index!==-1){
        return Users.splice(index,1)[0];
    }
}

//get a user
const getUser =(id)=>{
    return Users.find((user)=> user.id===id)
}

//get all users of a room
const allUsersInRoom=(room)=>{
    room = room.trim().toLowerCase();
    return Users.filter((user)=> user.room===room)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    allUsersInRoom
}
