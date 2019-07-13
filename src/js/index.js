import 'babel-polyfill';
import _ from 'lodash';

import './../sass/styles.scss';
import './../sass/responsive.scss';
// import sendIcon from './../images/send.svg';
// import boldIcon from './../images/bold.svg';
// import italicIcon from './../images/italic.svg';
// import underlineIcon from './../images/underline.svg';
//
// var sendImg = document.getElementById('sendIcon');
// sendImg.src = sendIcon;
//
// var boldImg = document.getElementById('boldIcon');
// boldImg.src = boldIcon;
//
// var italicImg = document.getElementById('italicIcon');
// italicImg.src = italicIcon;
//
// var underlineImg = document.getElementById('underlineIcon');
// underlineImg.src = underlineIcon;

const o = {
    foo: {
        bar: null
    }
};

var messageCounter = 0;
var name, members, person;

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

    this.getName = function (message) {
        for (var i = 0; i < members.length; i++) {
            if (members[i]["user_id"] == message["user_id"]) return members[i].username;
        }
    };

    this.getIdPerson = function (message) {
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
    var roote = document.getElementById("parent");
    roote.innerHTML = "";
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
        contForProf.appendChild(name);
        element.appendChild(contForProf);
        roote.insertBefore(element, empty);
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
            nameuser.innerHTML = chatInfo.username.split(" ")[0];
            person = chatInfo;
            loadMembers();

            loadMessages();

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
                    console.log(chatInfo + " " + name);
                    if (chatInfo.username == name) {
                        console.log(name + " " + chatInfo);
                        nameuser.innerHTML = chatInfo.username.split(" ")[0];
                        person = chatInfo;
                        console.log(person + "2");
                    }
                });
            }

        }, 1000);

    loadMembers();

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

function getMessages(messages, infoAboutMessage) {
    var roote = document.getElementById("parentMessages");
    roote.innerHTML = "";

    messages.forEach(function (message) {
        showMessage(message);
    });

    function showMessage(message) {
        infoAboutMessage.getDate(message);
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
        // var text = document.createTextNode(message.message);
        // textBlock.appendChild(text);

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
            if (messageCounter == 0 || messageCounter != messages.length) {
                messageCounter = messages.length;
                var infoAboutMessage = new GetInfoAboutMessage();
                getMessages(messages, infoAboutMessage);
            }
        }
    }

    xhrMessages.send();
}

document.getElementById('text').addEventListener('keyup', function () {
    stringInfo(this);

    function stringInfo(str) {

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

        if (info.str.length > 500) {
            document.getElementById("text").value = info.str.substring(0, 500);
        } else {

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
    var string = document.getElementById("text").value;
    var date = new Date().toISOString();
    if (string != "") {

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
    }
});
