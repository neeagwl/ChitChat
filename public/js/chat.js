const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

socket.on('message',(message)=>{
    console.log(message);
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    $messageFormButton.setAttribute('disabled','disabled');

    const msg= e.target.elements.message.value;

    socket.emit('sendMessage',msg,(error)=>{

        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if(error){
            console.log(error);
        }else{
            console.log('The message is delivered.')
        }
    });
})

document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        alert("Your browser doesn't support geolocation.")
    }
    navigator.geolocation.getCurrentPosition((pos)=>{
        const lat= pos.coords.latitude;
        const long = pos.coords.longitude;
        socket.emit('sendLocation',{lat,long},()=>{
            console.log('Location is shared with other users.')
        });
    })
})

