import 'babel-polyfill';
import _ from 'lodash';

import './../sass/styles.scss';
import './../sass/responsive.scss';

const o = {
    foo: {
        bar: null
    }
};

var messageDate = 0;
var name, members, person, infoAboutMessage;
var chatRoomsDate = [];
var online = 0;
var messagesForRoom = [{
    "user_id": "537818528",
    "message": "Test message 1",
    "chatroom_id": "537818528",
    "datetime": "2019-06-28T00:16:12.343Z"
}, {
    "user_id": "1238261095",
    "message": "Test message 2",
    "chatroom_id": "1238261095",
    "datetime": "2019-06-28T00:18:57.669Z"
}, {
    "user_id": "537818528",
    "message": "Test",
    "chatroom_id": "537818528",
    "datetime": "2019-06-30T00:20:18.765Z"
}];


function GetInfoAboutMessage() {
    var arrDate = [];

    function check(date, room_id) {
        if (arrDate.indexOf(date) == -1) {
            arrDate.push(date);

            var dateBox = document.createElement("div");
            dateBox.className = "dateMessage alignCenter sairaLight14";
            var dateMessage = document.createElement("p");
            var text = document.createTextNode(date);
            dateMessage.appendChild(text);
            dateBox.appendChild(dateMessage);

            var tabsRoom = document.getElementsByClassName("chatLogs scroll");

            for (var i = 0; i < tabsRoom.length; i++) {
                if (room_id == tabsRoom[i].getAttribute('data-chatID')) {
                    tabsRoom[i].appendChild(dateBox);
                }
            }
        }

    }

    this.getTime = function (message) {
        return message.datetime.substr(11, 5);
    };

    this.getDate = function (message, room_id) {
        var date = message.datetime.substr(0, 10);
        check(date, room_id);
    };

    this.getName = function (message) {
        if (members.length == 0) return 0;
        for (var i = 0; i < members.length; i++) {
            if (members[i]["user_id"] == message["user_id"]) return members[i].username;
        }
    };

    this.getIdPerson = function (message) {
        if (members.length == 0) return 0;
        for (var i = 0; i < members.length; i++) {
            if (members[i]["user_id"] == message["user_id"]) return members[i]["user_id"];
        }
    };
}

function loadMembers() {

    members = null;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://studentschat.herokuapp.com/users/', true);

    xhr.onreadystatechange = function () {

        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            try {
                members = JSON.parse(xhr.responseText);
            } catch (e) {
                alert("Некорректный ответ " + e.message);
            }
            getMembers(members);
        }
    }

    xhr.send();
};

function getMembers(members) {
    var root = document.getElementById("parent");
    root.innerHTML = "";
    var i = 0;

    members.sort((a, b) => (a.status > b.status) ? 1 : -1);
    members.forEach(function (member) {
        showMember(member);
    });

    function showMember(member) {
        var empty = document.getElementById("empty");
        var element = document.createElement("div");
        element.className = "alignCenter";
        var contForProf = document.createElement("div");
        contForProf.classList.add("containerForProfile", "alignCenter");

        var contForAvatar = document.createElement("div");
        contForAvatar.classList.add("containerForAvatar", "alignCenter");
        var avatar = document.createElement("div");
        avatar.classList.add("avatar", "avatarProfileTab");
        contForAvatar.appendChild(avatar);

        var name = document.createElement("div");
        name.classList.add("containerName", "marginName", "name", "sairaRegular18");
        if (member.status == "active") {
            name.classList.add("online");
            counter.innerHTML = ++i + " В СЕТИ"
        }

        contForProf.appendChild(contForAvatar);
        name.appendChild(document.createTextNode(member.username));
        name.setAttribute("data-userID", member["user_id"]);
        contForProf.appendChild(name);
        element.appendChild(contForProf);

        root.insertBefore(element, empty);
    }


}

document.getElementById('buttonEnter').addEventListener('click', function () {
    check.innerHTML = "";
    document.getElementById("uname").style.border = 'inherit';

    name = document.getElementById("uname").value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://studentschat.herokuapp.com/users/', true);

    xhr.onreadystatechange = function () {

        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            try {
                var chat = JSON.parse(xhr.responseText);
            } catch (e) {
                alert("Некорректный ответ " + e.message);
            }
            getName(name, chat);
        }
    }

    xhr.send();

});

function getName(name, chat) {
    chat.forEach(function (chatInfo) {
        if (chatInfo.username == name) {
            var containerName = chatInfo.username.split(" ")[0];

            if (containerName.length > 6) {
                containerName = containerName.substr(0, 4) + "...";
            }
            nameuser.innerHTML = containerName;

            person = chatInfo;

            loadMembers();

            loadMessages();

            setOnlineStatus();

            setInterval(function () {
                loadMembers();
                setTimeout(
                    function () {
                        loadMessages();
                    }, 1000
                );
            }, 3000);

            document.querySelector('.bg-modal').style.display = 'none';
            return 0;
        }
    });
    document.getElementById("uname").style.borderBottom = '1px solid red';
    if (name == "") {
        check.innerHTML = "* Введите имя";
    } else {
        check.innerHTML = "* Неверно, попробуйте ещё раз";
    }
}

document.getElementById('buttonReg').addEventListener('click', function () {
    name = document.getElementById("uname").value;
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://studentschat.herokuapp.com/users/register', true);

    xhr.onload = function () {
        check.innerHTML = "Регистрация прошла. Загрузка ...";
    };

    xhr.onerror = function () {
        console.log("Регистрация успешна");
        check.innerHTML = "Регистрация не прошла";
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({username: name}));
    setTimeout(
        function () {
            var xhr1 = new XMLHttpRequest();
            xhr1.open('GET', 'https://studentschat.herokuapp.com/users/', true);

            xhr1.onreadystatechange = function () {

                if (xhr1.readyState != 4) return;
                if (xhr1.status != 200) {
                    alert(xhr1.status + ': ' + xhr1.statusText);
                } else {
                    try {
                        var chat = JSON.parse(xhr1.responseText);
                    } catch (e) {
                        alert("Некорректный ответ " + e.message);
                    }
                    getName(chat);
                }
            }
            xhr1.send();

            function getName(chat) {
                chat.forEach(function (chatInfo) {
                    if (chatInfo.username == name) {
                        var containerName = chatInfo.username.split(" ")[0];

                        if (containerName.length > 6) {
                            containerName = containerName.substr(0, 4) + "...";
                        }
                        nameuser.innerHTML = containerName;
                        person = chatInfo;
                    }
                });
            }

        }, 1000);

    loadMembers();

    setOnlineStatus();

    setTimeout(function () {
        document.querySelector('.bg-modal').style.display = 'none';
        loadMessages();
        setInterval(function () {
            loadMembers();
            setTimeout(
                function () {
                    loadMessages();
                }, 1000
            );
        }, 3000);
    }, 1500);
});

function getMessages(messages) {
    var root = document.getElementById("parentMessages");
    var lengthMessages = messages.length - 1;
    if (messageDate == 0) {
        setCounterBlock("MAIN");
        infoAboutMessage = new GetInfoAboutMessage();
        root.innerHTML = "";
        messages.forEach(function (message) {
            showMessage(message);
        });
        messageDate = messages[lengthMessages].datetime;

    }

    if (messageDate != messages[lengthMessages].datetime) {
        var newStart;

        for (var i = 0; i < messages.length; i++) {
            if (messages[i]["datetime"] == messageDate) {
                newStart = i + 1;
                messageDate = messages[i + 1]["datetime"];
                break;
            }
        }

        for (; newStart < messages.length; newStart++) {
            showMessage(messages[newStart]);
        }
    }
    setCounter("MAIN", lengthMessages);

    function showMessage(message) {
        infoAboutMessage.getDate(message, "MAIN");
        var element = document.createElement("div");
        element.className = "chatMessage alignMessage";

        var avatar = document.createElement("div");
        avatar.classList.add("chatAvatar");
        element.appendChild(avatar);

        var boxForMessage = document.createElement("div");
        boxForMessage.classList.add("boxForMessage");


        var messageText = document.createElement("div");
        messageText.classList.add("messageText", "sairaLight14");
        if (infoAboutMessage.getIdPerson(message) == person["user_id"]) {
            boxForMessage.classList.add("boxForMessageSelf");
            messageText.classList.add("messageTextSelf");
        }

        var nameMember = document.createElement("div");
        nameMember.classList.add("name", "sairaRegular18");
        var nameDeliver = document.createTextNode(infoAboutMessage.getName(message));
        nameMember.appendChild(nameDeliver);


        var textBlock = document.createElement("p");
        textBlock.innerHTML = message.message;

        messageText.appendChild(nameMember);
        messageText.appendChild(textBlock);

        var timeMessage = document.createElement("div");
        timeMessage.classList.add("timeMessage", "sairaLight14");
        var time = document.createTextNode(infoAboutMessage.getTime(message));
        timeMessage.appendChild(time);

        boxForMessage.appendChild(messageText);
        boxForMessage.appendChild(timeMessage);

        element.appendChild(avatar);
        element.appendChild(boxForMessage);
        root.appendChild(element);

        var objDiv = document.getElementById("parentMessages");
        objDiv.scrollTop = objDiv.scrollHeight;
    }


}

function loadMessages() {
    var xhrMessages = new XMLHttpRequest();
    xhrMessages.open('GET', 'https://studentschat.herokuapp.com/messages/', true);
    xhrMessages.onreadystatechange = function () {

        if (xhrMessages.readyState != 4) return;
        if (xhrMessages.status != 200) {
            alert(xhrMessages.status + ': ' + xhrMessages.statusText);
        } else {
            try {
                var messages = JSON.parse(xhrMessages.responseText);

            } catch (e) {
                alert("Некорректный ответ " + e.message);
            }
            getMessages(messages);

        }
    }

    xhrMessages.send();
}

document.getElementById('text').addEventListener('keyup', function () {
    stringInfo(this);

    function stringInfo(str) {
        var info = new GetInfoAboutInputString(str.value);
        if (info.str.length > 500) {
            document.getElementById("text").value = info.str.substring(0, 500);
        }

        function GetInfoAboutInputString(str) {
            this.str = str.replace(/<[^>]+>/g, "");

            var pnctMrk = this.str.replace(/[.,+@\/#!$%\^&\*"'`;?:{}=\-_`~()]/g, "");
            var spcs = this.str.replace(/\s+/g, '');
            var numbers = this.str.length - this.str.replace(/[0-9]/g, "").length;

            this.punctuationMarks = function () {
                return this.str.length - pnctMrk.length;
            };

            this.spaces = function () {
                return this.str.length - spcs.length;
            };

            this.letters = function () {
                return this.str.length - this.spaces() - this.punctuationMarks() - numbers;
            };

        }

        var info = new GetInfoAboutInputString(str.value);

        var punctuationMarks = document.getElementById("punctuationMarks");
        var spaces = document.getElementById("spaces");
        var letters = document.getElementById("letters");
        var symbols = document.getElementById("symbols");

        punctuationMarks.innerHTML = '';
        spaces.innerHTML = '';
        letters.innerHTML = '';
        symbols.innerHTML = '';

        var amountMarks = document.createTextNode(info.punctuationMarks());
        punctuationMarks.appendChild(amountMarks);

        var amountSpaces = document.createTextNode(info.spaces());
        spaces.appendChild(amountSpaces);

        var amountLetters = document.createTextNode(info.letters());
        letters.appendChild(amountLetters);

        var amountSymbols = document.createTextNode(info.str.length);
        symbols.appendChild(amountSymbols);

    }
});

function Test() {
    var text = document.getElementById("text");
    var string = document.getElementById("text").value;

    var startIndex = text.selectionStart;
    var endIndex = text.selectionEnd;
    var range = text.value.substr(startIndex, endIndex - startIndex);
    ;


    this.bold = function () {
        if (startIndex != endIndex) {
            document.getElementById("text").value = string.substring(0, startIndex) + "<strong>" + range + "</strong>" + string.substring(endIndex);
        }
    };

    this.italic = function () {
        if (startIndex != endIndex) {
            document.getElementById("text").value = string.substring(0, startIndex) + "<i>" + range + "</i>" + string.substring(endIndex);
        }
    };

    this.underline = function () {
        if (startIndex != endIndex) {
            document.getElementById("text").value = string.substring(0, startIndex) + "<u>" + range + "</u>" + string.substring(endIndex);
        }
    };
}

document.getElementById('boldIcon').addEventListener('click', function () {
    new Test().bold();
});

document.getElementById('italicIcon').addEventListener('click', function () {
    new Test().italic();
});

document.getElementById('underlineIcon').addEventListener('click', function () {
    new Test().underline();
});

document.getElementById('sendIcon').addEventListener('click', function () {
    var idRoom = document.getElementById("headerNameChat").getAttribute("data-headername");
    var string = document.getElementById("text").value;
    var date = new Date().toISOString();
    if (string.replace(/\s+/g, '')) {
        if (idRoom == "MAIN") {
            var xhr = new XMLHttpRequest();

            xhr.open('POST', 'https://studentschat.herokuapp.com/messages', true);

            xhr.onerror = function () {
                alert("Произошла ошибка при отправлении");
            };

            xhr.setRequestHeader('Content-Type', 'application/json');

            document.getElementById("text").value = "";

            xhr.send(JSON.stringify({
                datetime: date,
                message: string,
                user_id: person["user_id"],
            }));
        } else {
            var rooms = document.getElementsByClassName("chatLogs scroll");

            for (var i = 0; i < rooms.length; i++) {
                if (idRoom == rooms[i].getAttribute('data-chatID')) {
                    var dateMessage = [];
                    dateMessage["datetime"] = new Date().toISOString();

                    chatRoomsDate[idRoom].getDate(dateMessage, idRoom);
                    createMessageForRoom(rooms, i, idRoom, date, string);
                }
            }
            document.getElementById("text").value = "";
            var count = document.querySelector('[data-chatRoomAmount= "' + idRoom + '"]');
            if (+count.innerText == 0) {
                setCounterBlock(idRoom);
            }
            count = +count.innerText + 1
            setCounter(idRoom, count);
        }
    }
});

document.querySelector('#parent').addEventListener('click', function (event) {
    var userId = event.target.getAttribute('data-userID');
    var tabsRoom2 = document.getElementsByClassName("chatLogs scroll");
    if (event.target.getAttribute('data-userID') == person["user_id"] || userId == null) return false;
    if (!checkRoom(event)) {
        for (var i = 0; i < tabsRoom2.length; i++) {
            if (userId == tabsRoom2[i].getAttribute('data-chatID')) {
                setHeaderName(userId);
                tabsRoom2[i].style.display = "block";
            } else {
                tabsRoom2[i].style.display = "none";
            }
        }
        return false;
    }

    var root = document.getElementById("chatRooms");

    var empty = document.getElementById("emptyRoom");
    var element = document.createElement("div");
    element.className = "alignLeft chatRoomId";
    var contForProf = document.createElement("div");
    contForProf.classList.add("containerForProfile", "alignCenter");

    var contForAvatar = document.createElement("div");
    contForAvatar.classList.add("containerForAvatar", "alignCenter");
    var avatar = document.createElement("div");
    avatar.classList.add("avatar", "avatarProfileTab");
    avatar.setAttribute("data-chatRoomAmount", userId);
    contForAvatar.appendChild(avatar);

    var name = document.createElement("div");
    name.classList.add("containerName", "marginName", "name", "sairaRegular18");

    contForProf.appendChild(contForAvatar);
    name.appendChild(document.createTextNode(event.target.innerHTML));
    element.setAttribute("data-chatRoomUserID", userId);
    contForProf.appendChild(name);
    element.appendChild(contForProf);

    root.insertBefore(element, empty);

    getMessagesForRoom(messagesForRoom, userId);

    var tabsRoom = document.getElementsByClassName("chatLogs scroll");

    for (var i = 0; i < tabsRoom.length; i++) {
        if (userId == tabsRoom[i].getAttribute('data-chatID')) {
            tabsRoom[i].style.display = "block";
        } else {
            tabsRoom[i].style.display = "none";
        }
    }

    setActive(userId);

});

function checkRoom(event) {
    if (event.target.className == 'containerName marginName name sairaRegular18' ||
        event.target.className == 'containerName marginName name sairaRegular18 online') {
        var tabsRoom = document.getElementsByClassName("chatRoomId");
        for (var i = 0; i < tabsRoom.length; i++) {
            if (event.target.getAttribute('data-userID') == tabsRoom[i].getAttribute('data-chatRoomUserID')) return false;
        }
        return true;
    }
}

document.querySelector('#chatRooms').addEventListener('click', function (event) {
    if (event.target.className == "alignLeft chatRoomId") {
        var roomID = event.target.getAttribute('data-chatRoomUserID');
        var tabsRoom = document.getElementsByClassName("chatLogs scroll");
        for (var i = 0; i < tabsRoom.length; i++) {
            if (roomID == tabsRoom[i].getAttribute('data-chatID')) {
                setHeaderName(roomID);
                tabsRoom[i].style.display = "block";
            } else {
                tabsRoom[i].style.display = "none";
            }
        }
    }
});

function getMessagesForRoom(messages, id) {
    var count = 0;
    var room = document.createElement("div");
    room.classList.add("chatLogs", "scroll");
    room.setAttribute("data-chatID", id);
    var root = document.getElementById("messages");
    root.appendChild(room);
    var infoAboutMessageForRoom = new GetInfoAboutMessage();

    messages.forEach(function (message) {
        if (message["chatroom_id"] == room.getAttribute("data-chatID")) {
            count++;
            showMessage(message, id);
        }
    });
    chatRoomsDate[id] = infoAboutMessageForRoom;

    setHeaderName(id);

    if (count != 0) {
        setCounterBlock(id);
        setCounter(id, count);
    }

    function showMessage(message, room_id) {
        infoAboutMessageForRoom.getDate(message, room_id);
        var element = document.createElement("div");
        element.className = "chatMessage alignMessage";

        var avatar = document.createElement("div");
        avatar.classList.add("chatAvatar");
        element.appendChild(avatar);

        var boxForMessage = document.createElement("div");
        boxForMessage.classList.add("boxForMessage");


        var messageText = document.createElement("div");
        messageText.classList.add("messageText", "sairaLight14");
        if (infoAboutMessageForRoom.getIdPerson(message) == person["user_id"]) {
            boxForMessage.classList.add("boxForMessageSelf");
            messageText.classList.add("messageTextSelf");
        }

        var nameMember = document.createElement("div");
        nameMember.classList.add("name", "sairaRegular18");
        var nameDeliver = document.createTextNode(infoAboutMessageForRoom.getName(message));

        nameMember.appendChild(nameDeliver);


        var textBlock = document.createElement("p");
        textBlock.innerHTML = message.message;

        messageText.appendChild(nameMember);
        messageText.appendChild(textBlock);

        var timeMessage = document.createElement("div");
        timeMessage.classList.add("timeMessage", "sairaLight14");
        var time = document.createTextNode(infoAboutMessageForRoom.getTime(message));
        timeMessage.appendChild(time);

        boxForMessage.appendChild(messageText);
        boxForMessage.appendChild(timeMessage);

        element.appendChild(avatar);
        element.appendChild(boxForMessage);
        room.appendChild(element);


        var objDiv = document.getElementById("parentMessages");
        objDiv.scrollTop = objDiv.scrollHeight;
    }


}

function setHeaderName(id) {
    var member = [];
    member["user_id"] = id;
    var infoAboutMessageForRoom = new GetInfoAboutMessage();
    document.getElementById("headerNameChat").setAttribute("data-headerName", id);
    if (member["user_id"] == "MAIN") {
        document.getElementById("headerNameChat").innerText = "MAIN";
    } else {
        document.getElementById("headerNameChat").innerText = infoAboutMessageForRoom.getName(member);
    }

    setActive(id);

}

function setActive(userId) {
    var active = document.getElementsByClassName("alignLeft chatRoomId");
    for (var i = 0; i < active.length; i++) {
        if (userId == active[i].getAttribute('data-chatroomuserid')) {
            active[i].className = "alignLeft chatRoomId active";
        } else {
            active[i].className = "alignLeft chatRoomId";
        }
    }
}

function createMessageForRoom(rooms, i, idRoom, date, string) {
    var element = document.createElement("div");
    element.className = "chatMessage alignMessage";

    var avatar = document.createElement("div");
    avatar.classList.add("chatAvatar");
    element.appendChild(avatar);

    var boxForMessage = document.createElement("div");
    boxForMessage.classList.add("boxForMessage", "boxForMessageSelf");


    var messageText = document.createElement("div");
    messageText.classList.add("messageText", "sairaLight14", "messageTextSelf");

    var nameMember = document.createElement("div");
    nameMember.classList.add("name", "sairaRegular18");
    var nameDeliver = document.createTextNode(person["username"]);

    nameMember.appendChild(nameDeliver);

    var textBlock = document.createElement("p");
    textBlock.innerHTML = string;

    messageText.appendChild(nameMember);
    messageText.appendChild(textBlock);

    var timeMessage = document.createElement("div");
    timeMessage.classList.add("timeMessage", "sairaLight14");
    var time = document.createTextNode(date.substr(11, 5));
    timeMessage.appendChild(time);

    boxForMessage.appendChild(messageText);
    boxForMessage.appendChild(timeMessage);

    element.appendChild(avatar);
    element.appendChild(boxForMessage);
    rooms[i].appendChild(element);

    var objDiv = document.querySelector('[data-chatID= "' + idRoom + '"]');
    objDiv.scrollTop = objDiv.scrollHeight;
}

function setCounter(id, count) {
    var parentCounter = document.querySelector('[data-chatRoomCounter= "' + id + '"]');
    parentCounter.innerText = count;
}

function setCounterBlock(id) {
    var parentCounter = document.querySelector('[data-chatRoomAmount= "' + id + '"]');
    var element = document.createElement("div");

    element.className = "counter sairaLight14 alignCenter";
    element.setAttribute("data-chatRoomCounter", id);
    parentCounter.appendChild(element);
}

function startTime() {
    var tm = new Date();
    var h = tm.getHours();
    var m = tm.getMinutes();
    m = checkTime(m);
    document.getElementById('time').innerHTML = h + ":" + m;
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function setOnlineStatus() {
    setInterval(function () {
        startTime()
    }, 1000);
    setInterval(function () {
        online += 5;
        document.getElementById('onlineTime').innerHTML = "в сети " + online + " минут";
    }, 1000 * 60 * 5);
}