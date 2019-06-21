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

console.log(o?.foo?.bar?.baz ?? 'default');
