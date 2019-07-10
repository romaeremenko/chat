import 'babel-polyfill';
import _ from 'lodash';

import './../sass/styles.scss';
import './../sass/responsive.scss';
import sendIcon from './../images/send.svg';
import boldIcon from './../images/bold.svg';
import italicIcon from './../images/italic.svg';
import underlineIcon from './../images/underline.svg';

var sendImg = document.getElementById('sendIcon');
sendImg.src = sendIcon;

var boldImg = document.getElementById('boldIcon');
boldImg.src = boldIcon;

var italicImg = document.getElementById('italicIcon');
italicImg.src = italicIcon;

var underlineImg = document.getElementById('underlineIcon');
underlineImg.src = underlineIcon;

const o = {
    foo: {
        bar: null
    }
};



var name, members;

function GetInfoAboutMessage() {
    var arrDate = [];

    function check(date) {
        if (arrDate.indexOf(date) == -1) {
            arrDate.push(date);

            var dateBox = document.createElement("div");
            dateBox.className = "dateMessage alignCenter sairaLight14";
            var dateMessage = document.createElement("p");
            var text = document.createTextNode(date);
            dateMessage.appendChild(text);
            dateBox.appendChild(dateMessage);
            var roote = document.getElementById("parentMessages");
            roote.appendChild(dateBox);
        }

    }

    this.getTime = function (message) {
        return message.datetime.substr(11, 5);
    };

    this.getDate = function (message) {
        var date = message.datetime.substr(0, 10);
        check(date);
    };

    this.getName = function (message) {
        for (var i = 0; i < members.length; i++) {
            if (members[i]["user_id"] == message["user_id"]) return members[i].username;
        }
    };

}

function ready() {
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
    var i = 0;

    members.sort((a,b) => (a.status > b.status) ? 1 : -1);
    members.forEach(function(member) {
        showMember(member);
    });

    function showMember(member) {
        var roote = document.getElementById("parent");
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
        contForProf.appendChild(name);
        element.appendChild(contForProf);
        roote.insertBefore(element,empty);
    }


}

document.getElementById('buttonEnter').addEventListener('click', function () {
    check.innerHTML = "";
    document.getElementById("uname").style.border = 'inherit';

    name = document.getElementById("uname").value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://studentschat.herokuapp.com/users/', true);

    xhr.onreadystatechange = function() {

        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            try {
                var chat = JSON.parse(xhr.responseText);
            } catch (e) {
                alert("Некорректный ответ " + e.message);
            }
            getName(name,chat);
        }
    }

    xhr.send();

});

function getName(name, chat) {
    chat.forEach(function(chatInfo) {
        if (chatInfo.username == name) {
            nameuser.innerHTML = name;
            ready();
            loadMessages();
            document.querySelector('.bg-modal').style.display = 'none';
            return 0;
        }
    });
    document.getElementById("uname").style.borderBottom = '1px solid red';
    if(name == "") {
        check.innerHTML = "* Введите имя";
    } else {
        check.innerHTML = "* Неверно, попробуйте ещё раз";
    }
}

document.getElementById('buttonReg').addEventListener('click', function () {
    name = document.getElementById("uname").value;
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://studentschat.herokuapp.com/users/register', true);

    xhr.onload = function() {
        check.innerHTML = "Регистрация прошла";
    };

    xhr.onerror = function() {console.log("Регистрация успешна");
        check.innerHTML = "Регистрация не прошла";
    };
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify({username : name}));

    setTimeout( function(){
        nameuser.innerHTML = name;
        document.querySelector('.bg-modal').style.display = 'none';
        ready();loadMessages();}, 1000);
});

function getMessages(messages, infoAboutMessage) {

    messages.forEach(function (message) {
        showMessage(message);
    });

    function showMessage(message) {
        infoAboutMessage.getDate(message);
        var roote = document.getElementById("parentMessages");
        var element = document.createElement("div");
        element.className = "chatMessage alignMessage";

        var avatar = document.createElement("div");
        avatar.classList.add("chatAvatar");
        element.appendChild(avatar);

        var boxForMessage = document.createElement("div");
        boxForMessage.classList.add("boxForMessage");


        var messageText = document.createElement("div");
        messageText.classList.add("messageText", "sairaLight14");
        console.log(name);
        if(infoAboutMessage.getName(message) == name) {
            boxForMessage.classList.add("boxForMessageSelf");
            messageText.classList.add("messageTextSelf");
        }

        var nameMember = document.createElement("div");
        nameMember.classList.add("name", "sairaRegular18");
        var nameDeliver = document.createTextNode(infoAboutMessage.getName(message));
        nameMember.appendChild(nameDeliver);


        var textBlock = document.createElement("p");
        var text = document.createTextNode(message.message);
        textBlock.appendChild(text);

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
        roote.appendChild(element);
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
            var infoAboutMessage = new GetInfoAboutMessage();
            getMessages(messages, infoAboutMessage);
        }
    }

    xhrMessages.send();
}