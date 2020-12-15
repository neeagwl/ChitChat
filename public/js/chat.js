const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocation = document.querySelector('#send-location');
const $locationCoord = navigator.geolocation;
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//queries
const {username, room}= Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

//auto-scrolling
const autoscroll=()=>{
    //new message element
    const $newMessage = $messages.lastElementChild;

    //height of the new message
    const newMessageStyles= getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight

    //How far have I scrolled?
    const scrollOffset = $messages.scrollTop +visibleHeight;

    if(containerHeight-newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message)
    const html =Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
})

socket.on('locationMessage',(msg)=>{
    console.log(msg);
    const html = Mustache.render(locationTemplate,{
        username:msg.username,
        url: msg.url,
        createdAt: moment(msg.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
})

socket.on('roomData',({room,users})=>{
    const html =Mustache.render(sidebarTemplate,{
        room,
        users
    })
    $sidebar.innerHTML=html;
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

$sendLocation.addEventListener('click',()=>{

    $sendLocation.setAttribute('disabled','disabled');

    if(!$locationCoord){
        alert("Your browser doesn't support geolocation.")
    }
    $locationCoord.getCurrentPosition((pos)=>{
        const lat= pos.coords.latitude;
        const long = pos.coords.longitude;
        socket.emit('sendLocation',{lat,long},()=>{
            $sendLocation.removeAttribute('disabled');
            console.log('Location is shared with other users.')
        });
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href='/';
    }
});


