/**
 * Variables
 */

let chatName = ''
let chatSocket = null
let chatWindowUrl = window.location.href
let chatRoomUuid = Math.random().toString(36).slice(2, 12)

let q1 = ''
let q2 = ''
let q3 = ''
let q4 = ''
let q5 = ''

/**
 * Elements
 */

const chatElement = document.querySelector('#chat')
const chatOpenElement = document.querySelector('#chat_open')
const chatJoinElement = document.querySelector('#chat_join')
const chatIconElement = document.querySelector('#chat_icon')
const chatWelcomeElement = document.querySelector('#chat_welcome')
const chatRoomElement = document.querySelector('#chat_room')
const chatNameElement = document.querySelector('#chat_name')
const chatLogElement = document.querySelector('#chat_log')
const chatInputElement = document.querySelector('#chat_message_input')
const chatSubmitElement = document.querySelector('#chat_message_submit')

const progressBar = document.querySelector('#progress')

const firstQuestion = document.querySelector('#First_question')

const firstOption_y = document.querySelector('#first_ans_Yes')
const firstOption_n = document.querySelector('#first_ans_No')
const firstOption_ns = document.querySelector('#first_ans_NS')

const SecondQuestion = document.querySelector('#Second_question')

const SecondOption_y = document.querySelector('#sec_ans_Yes')
const SecondOption_n = document.querySelector('#sec_ans_No')
const SecondOption_ns = document.querySelector('#sec_ans_NS')
const SecondOption_b = document.querySelector('#sec_ans_back')

const ThirdQuestion = document.querySelector('#Third_question')

const ThirdOption_y = document.querySelector('#third_ans_Yes')
const ThirdOption_n = document.querySelector('#third_ans_No')
const ThirdOption_ns = document.querySelector('#third_ans_NS')
const ThirdOption_b = document.querySelector('#third_ans_back')

const FourthQuestion = document.querySelector('#Fourth_question')

const FourthOption_y = document.querySelector('#fourth_ans_Yes')
const FourthOption_n = document.querySelector('#fourth_ans_No')
const FourthOption_ns = document.querySelector('#fourth_ans_NS')
const FourthOption_b = document.querySelector('#fourth_ans_back')

const FifthQuestion = document.querySelector('#Fifth_question')

const FifthOption_y = document.querySelector('#fifth_ans_Yes')
const FifthOption_n = document.querySelector('#fifth_ans_No')
const FifthOption_ns = document.querySelector('#fifth_ans_NS')
const FifthOption_b = document.querySelector('#fifth_ans_back')



/**
 * Functions 
 */

function scrollToBottom() {
    chatLogElement.scrollTop = chatLogElement.scrollHeight
}


function getCookie(name) {
    var cookieValue = null

    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';')

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim()

            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1))

                break
            }
        }
    }

    return cookieValue
}


function sendMessage() {
    chatSocket.send(JSON.stringify({
        'type': 'message',
        'message': chatInputElement.value,
        'name': chatName
    }))

    chatInputElement.value = ''
}


function onChatMessage(data) {
    console.log('onChatMessage', data)

    if (data.type == 'chat_message') {
        let tmpInfo = document.querySelector('.tmp-info')

        if (tmpInfo) {
            tmpInfo.remove()
        }
        
        if (data.agent) {
            chatLogElement.innerHTML += `
                <div class="flex w-full mt-2 space-x-3 max-w-md">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}</div>

                    <div>
                        <div class="bg-gray-300 p-3 rounded-l-lg rounded-br-lg">
                            <p class="text-sm">${data.message}</p>
                        </div>
                        
                        <span class="text-xs text-gray-500 leading-none">${data.created_at} ago</span>
                    </div>
                </div>
            `
        } else {
            chatLogElement.innerHTML += `
                <div class="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end">
                    <div>
                        <div class="bg-blue-300 p-3 rounded-l-lg rounded-br-lg">
                            <p class="text-sm">${data.message}</p>
                        </div>
                        
                        <span class="text-xs text-gray-500 leading-none">${data.created_at} ago</span>
                    </div>

                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}</div>
                </div>
            `
        }
    } else if (data.type == 'users_update') {
        chatLogElement.innerHTML += '<p class="mt-2">The admin/agent has joined the chat!'
    } else if (data.type == 'writing_active') {
        if (data.agent) {
            let tmpInfo = document.querySelector('.tmp-info')

            if (tmpInfo) {
                tmpInfo.remove()
            }

            chatLogElement.innerHTML += `
                <div class="tmp-info flex w-full mt-2 space-x-3 max-w-md">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}</div>

                    <div>
                        <div class="bg-gray-300 p-3 rounded-l-lg rounded-br-lg">
                            <p class="text-sm">The agent/admin is writing a message</p>
                        </div>
                    </div>
                </div>
            `
        }
    }

    scrollToBottom()
}


async function joinChatRoom() {
    console.log('joinChatRoom')
    console.log(chatNameElement)
    chatName = chatNameElement.value === "" ?  "IMMEDIATE_CASE" : chatNameElement.value

    console.log(chatName)

    console.log('Join as:', chatName)
    console.log('Room uuid:', chatRoomUuid)

    const data = new FormData()
    data.append('name', chatName)
    data.append('url', chatWindowUrl)
    data.append('1stQ',q1)
    data.append('2ndQ',q2)
    data.append('3rdQ',q3)
    data.append('4thQ',q4)
    data.append('5thQ',q5)

    await fetch(`/api/create-room/${chatRoomUuid}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: data
    })
    .then(function(res) {
        return res.json()
    })
    .then(function(data) {
        console.log('data', data)
    })


    chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoomUuid}/`)


    chatSocket.onmessage = function(e) {
        console.log('onMessage')
        onChatMessage(JSON.parse(e.data))
    }


    chatSocket.onopen = function(e) {
        console.log('onOpen - chat socket was opened')

        scrollToBottom()
    }


    chatSocket.onclose = function(e) {

        console.log('onClose - chat socket was closed')
    }
}


/**
 * Event listeners
 */


chatOpenElement.onclick = function(e) {
    e.preventDefault()

    chatIconElement.classList.add('hidden')
    chatWelcomeElement.classList.remove('hidden')

    return false
}


chatJoinElement.onclick = function(e) {
    e.preventDefault()

    chatWelcomeElement.classList.add('hidden')
    chatRoomElement.classList.remove('hidden')

    joinChatRoom()

    return false
}


chatSubmitElement.onclick = function(e) {
    e.preventDefault()

    sendMessage()

    return false
}


chatInputElement.onkeyup = function(e) {
    if (e.keyCode == 13) {
        sendMessage()
    }
}


chatInputElement.onfocus = function(e) {
    chatSocket.send(JSON.stringify({
        'type': 'update',
        'message': 'writing_active',
        'name': chatName
    }))
}

/**
 * Questions
 */

///////////////First//////////////////////

firstOption_y.onclick = function(e) {
    e.preventDefault()

    firstQuestion.classList.add('hidden')
    SecondQuestion.classList.remove('hidden')

    progressBar.style.width = "40%"
    progressBar.innerHTML = "Answer 2 of 5";
    q1 = 'Yes'
    return false
}

firstOption_n.onclick = function(e) {
    e.preventDefault()

    firstQuestion.classList.add('hidden')
    SecondQuestion.classList.remove('hidden')

    progressBar.style.width = "40%"
    progressBar.innerHTML = "Answer 2 of 5";
    q1 = 'No'
    return false
}

firstOption_ns.onclick = function(e) {
    e.preventDefault()

    firstQuestion.classList.add('hidden')
    SecondQuestion.classList.remove('hidden')

    progressBar.style.width = "40%"
    progressBar.innerHTML = "Answer 2 of 5";
    q1 = 'Not Sure'
    return false
}

///////////////Second//////////////////////

SecondOption_y.onclick = function(e) {
    e.preventDefault()

    SecondQuestion.classList.add('hidden')
    ThirdQuestion.classList.remove('hidden')

    progressBar.style.width = "60%"
    progressBar.innerHTML = "Answer 3 of 5";
    q2 = 'Yes'
    return false
}

SecondOption_n.onclick = function(e) {
    e.preventDefault()

    SecondQuestion.classList.add('hidden')
    ThirdQuestion.classList.remove('hidden')

    progressBar.style.width = "60%"
    progressBar.innerHTML = "Answer 3 of 5";
    q2 = 'No'
    return false
}

SecondOption_ns.onclick = function(e) {
    e.preventDefault()

    SecondQuestion.classList.add('hidden')
    ThirdQuestion.classList.remove('hidden')

    progressBar.style.width = "60%"
    progressBar.innerHTML = "Answer 3 of 5";
    q2 = 'Not Sure'
    return false
}

SecondOption_b.onclick = function(e) {
    e.preventDefault()

    SecondQuestion.classList.add('hidden')
    firstQuestion.classList.remove('hidden')

    progressBar.style.width = "20%"
    progressBar.innerHTML = "Answer 1 of 5";
    return false
}

///////////////Third//////////////////////

ThirdOption_y.onclick = function(e) {
    e.preventDefault()

    ThirdQuestion.classList.add('hidden')
    FourthQuestion.classList.remove('hidden')

    progressBar.style.width = "80%"
    progressBar.innerHTML = "Answer 4 of 5";
    q3 = 'Yes'
    return false
}

ThirdOption_n.onclick = function(e) {
    e.preventDefault()

    ThirdQuestion.classList.add('hidden')
    FourthQuestion.classList.remove('hidden')
    progressBar.style.width = "80%"
    progressBar.innerHTML = "Answer 4 of 5";
    q3 = 'No'
    return false
}

ThirdOption_ns.onclick = function(e) {
    e.preventDefault()

    ThirdQuestion.classList.add('hidden')
    FourthQuestion.classList.remove('hidden')
    progressBar.style.width = "80%"
    progressBar.innerHTML = "Answer 4 of 5";
    q3 = 'Not Sure'
    return false
}

ThirdOption_b.onclick = function(e) {
    e.preventDefault()

    ThirdQuestion.classList.add('hidden')
    SecondQuestion.classList.remove('hidden')
    progressBar.style.width = "40%"
    progressBar.innerHTML = "Answer 2 of 5";

    return false
}

///////////////Fourth//////////////////////

FourthOption_y.onclick = function(e) {
    e.preventDefault()

    FourthQuestion.classList.add('hidden')
    FifthQuestion.classList.remove('hidden')
    progressBar.style.width = "100%"
    progressBar.innerHTML = "Answer 5 of 5";
    q4 = 'Yes'
    return false
}

FourthOption_n.onclick = function(e) {
    e.preventDefault()

    FourthQuestion.classList.add('hidden')
    FifthQuestion.classList.remove('hidden')
    progressBar.style.width = "100%"
    progressBar.innerHTML = "Answer 5 of 5";
    q4 = 'No'
    return false
}

FourthOption_ns.onclick = function(e) {
    e.preventDefault()

    FourthQuestion.classList.add('hidden')
    FifthQuestion.classList.remove('hidden')
    progressBar.style.width = "100%"
    progressBar.innerHTML = "Answer 5 of 5";
    q4 = 'Not Sure'
    return false
}

FourthOption_b.onclick = function(e) {
    e.preventDefault()

    FourthQuestion.classList.add('hidden')
    ThirdQuestion.classList.remove('hidden')
    progressBar.style.width = "60%"
    progressBar.innerHTML = "Answer 3 of 5";

    return false
}

///////////////Fifth//////////////////////

FifthOption_y.onclick = function(e) {
    e.preventDefault()
    q5 = 'Yes'
    chatWelcomeElement.classList.add('hidden')
    chatRoomElement.classList.remove('hidden')
    console.log('join Chat Room')
    joinChatRoom()
    return false
}

FifthOption_n.onclick = function(e) {
    e.preventDefault()
    q5 = 'No'
    chatWelcomeElement.classList.add('hidden')
    chatRoomElement.classList.remove('hidden')
    console.log('join Chat Room')
    joinChatRoom()

    return false
}

FifthOption_ns.onclick = function(e) {
    e.preventDefault()
    q5 = 'Not Sure'
    chatWelcomeElement.classList.add('hidden')
    chatRoomElement.classList.remove('hidden')
    console.log('join Chat Room')
    joinChatRoom()

    return false
}

FifthOption_b.onclick = function(e) {
    e.preventDefault()
    progressBar.style.width = "80%"
    FifthQuestion.classList.add('hidden')
    FourthQuestion.classList.remove('hidden')
    

    return false
}