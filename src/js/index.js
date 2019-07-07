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


document.addEventListener("DOMContentLoaded", ready);

function ready() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://studentschat.herokuapp.com/users/', true);

    xhr.onreadystatechange = function () {

        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            try {
                var members = JSON.parse(xhr.responseText);
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

    var name = document.getElementById("uname").value;
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
    var name = document.getElementById("uname").value;
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

    document.querySelector('.bg-modal').style.display = 'none';
});
