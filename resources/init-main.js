//globals
let gba;
let runCommands = [];
let debug = null;
var statepause = 'play';
var stateff = false;
var isKeyDown = false;
var isMobile = false;
var actioncontrolorient = false; //false-> horizontal, true-> vertical
var virtualControlsEnabled = false;
var isRunning = false;
var autoPaused = false;
//get query params for automatically selecting a rom
var params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop)
});
const query_select_rom = params.rom;
const query_select_save = params.save;

window.mobileCheck = function () {
	let check = false;
	(function (a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
				a
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4)
			)
		)
			check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};

//pause canvas animation if windows is not focused, restart if so
$(window).focus(function () {
	if (isRunning && autoPaused) {
		buttonPlayPress();
		gba.runStable();
		autoPaused = false;
	}
});

$(window).blur(function () {
	if (isRunning && !gba.paused && !autoPaused) {
		buttonPlayPress();
		gba.pause();
		autoPaused = true;
	}
});

var menu_btn = document.querySelector('#menu-btn');
var sidebar = document.querySelector('#sidebar');
var container = document.querySelector('.nav-container');

var dpad_right = document.querySelector('#dpadholder > nav > a.right');
var dpad_up = document.querySelector('#dpadholder > nav > a.up');
var dpad_left = document.querySelector('#dpadholder > nav > a.left');
var dpad_down = document.querySelector('#dpadholder > nav > a.down');
var dpad_a_button = document.querySelector('#dpadabutton');
var dpad_b_button = document.querySelector('#dpadbbutton');

menu_btn.addEventListener('click', () => {
	sidebar.classList.toggle('active-nav');
	container.classList.toggle('active-cont');
});

if (window.mobileCheck()) {
	window.oncontextmenu = function () {
		return false;
	};
	enableDpad();
	enableDpadButtons();
	disableVirtualControlsMenuNode();
	isMobile = true;
}

try {
	gba = new GameBoyAdvance();
	gba.keypad.eatInput = true;
	gba.setLogger(function (level, error) {
		console.log(error);
		gba.pause();
		let screen = document.getElementById('screen');
		if (screen.getAttribute('class') === 'dead') {
			console.log(
				'We appear to have crashed multiple times without reseting.'
			);
			return;
		}
		let crash = document.createElement('img');
		crash.setAttribute('id', 'crash');
		crash.setAttribute('src', 'resources/crash.png');
		screen.parentElement.insertBefore(crash, screen);
		screen.setAttribute('class', 'dead');
	});

	if (query_select_rom != null && query_select_rom != '') {
		if (query_select_save != null && query_select_save != '') {
			loadAndRunLocalRom(query_select_rom, query_select_save);
		} else {
			loadAndRunLocalRom(query_select_rom, '');
		}
	}
} catch (exception) {
	gba = null;
	console.log('exception loading gba:' + exception);
}

//make canvas wrapper/canvas draggable and resizable
$('#screenwrapper')
	.draggable()
	.resizable({
		handles: 'se,e,w',
		aspectRatio: 3 / 2
	});
$('#actioncontrolpanel').draggable();
$('#dpadholder').draggable({
	handle: '#dpadhandle'
});
$('#dpadabbuttonholder').draggable({
	handle: '#abbuttonhandle'
});
setPixelated(true);

//set dpad/button event listeners
function setDpadEvents(elems) {
	elems.forEach(function (elem, index) {
		var keyId = $(elem).attr('data-keyid');
		var keycode = gba.keypad.getKeyCodeValue(keyId.toUpperCase());

		elem.addEventListener('mousedown', () => {
			isKeyDown = true;
			simulateKeyDown(keycode);
		});

		elem.addEventListener('mouseup', () => {
			isKeyDown = false;
			simulateKeyUp(keycode);
		});

		elem.addEventListener('mouseenter', () => {
			if (isKeyDown) {
				simulateKeyDown(keycode);
			}
		});

		elem.addEventListener('mouseleave', () => {
			if (isKeyDown) {
				simulateKeyUp(keycode);
			}
		});

		elem.addEventListener('touchstart', () => {
			isKeyDown = true;
			simulateKeyDown(keycode);
		});

		elem.addEventListener('touchend', () => {
			isKeyDown = false;
			simulateKeyDown(keycode);
		});
	});
}

setDpadEvents([
	dpad_right,
	dpad_left,
	dpad_up,
	dpad_down,
	dpad_a_button,
	dpad_b_button
]);

//main function defs
window.onload = function () {
	if (gba && FileReader) {
		let canvas = document.getElementById('screen');
		gba.setCanvas(canvas);

		gba.logLevel = gba.LOG_ERROR;

		gba.setBios(biosBin);

		if (!gba.audio.context) {
			// Remove the sound box if sound isn't available
			let soundbox = document.getElementById('sound');
			soundbox.parentElement.removeChild(soundbox);
		}

		if (window.navigator.appName === 'Microsoft Internet Explorer') {
			// Remove the pixelated option if it doesn't work
			let pixelatedBox = document.getElementById('pixelated');
			pixelatedBox.parentElement.removeChild(pixelatedBox);
		}
	} else {
		console.log('GBA/FileReader do not exist, exiting (error encountered)');
	}
};

function loadAndRunLocalRom(romloc, saveloc) {
	if (saveloc != null && saveloc != '') {
		loadLocalFile('local_saves/' + saveloc, uploadSavedataPending);
	}
	loadLocalFile('local_roms/' + romloc, run);
}

function run(file) {
	let dead = document.getElementById('loader');
	dead.value = '';
	let load = document.getElementById('select');
	load.text = 'Loading Rom...';
	load.removeAttribute('onclick');
	gba.loadRomFromFile(file, function (result) {
		if (result) {
			for (let i = 0; i < runCommands.length; ++i) {
				runCommands[i]();
			}
			runCommands = [];
			$('#actioncontrolpanel').fadeIn();
			var newtop =
				parseInt($('#screenwrapper').css('top'), 10) +
				parseInt($('#screenwrapper').css('height'), 10) +
				5 +
				'px';
			$('#actioncontrolpanel').css({
				top: newtop,
				left: $('#screenwrapper').css('left')
			});
			enableRunMenuNode();
			disablePreMenuNode();
			gba.runStable();
			isRunning = true;
		} else {
			load.textContent = 'FAILED';
			setTimeout(function () {
				load.textContent = 'Select Rom';
				load.onclick = function () {
					document.getElementById('loader').click();
				};
			}, 3000);
		}
	});
}

function reset() {
	gba.pause();
	gba.reset();
	isRunning = false;
	let load = document.getElementById('select');
	load.text = 'Select Rom';
	let crash = document.getElementById('crash');
	if (crash) {
		let context = gba.targetCanvas.getContext('2d');
		context.clearRect(0, 0, 480, 320);
		gba.video.drawCallback();
		crash.parentElement.removeChild(crash);
		let canvas = document.getElementById('screen');
		canvas.removeAttribute('class');
	} else {
		lcdFade(
			gba.context,
			gba.targetCanvas.getContext('2d'),
			gba.video.drawCallback
		);
	}
	load.onclick = function () {
		document.getElementById('loader').click();
	};
	$('#actioncontrolpanel').fadeOut();
	disableRunMenuNode();
	enablePreMenuNode();
	$('#collapseTwo').collapse('show');
}

function uploadSavedataPending(file) {
	runCommands.push(function () {
		gba.loadSavedataFromFile(file);
	});
}

function togglePause() {
	if (gba.paused) {
		if (debug && debug.gbaCon) {
			debug.gbaCon.run();
		} else {
			gba.runStable();
		}
	} else {
		if (debug && debug.gbaCon) {
			debug.gbaCon.pause();
		} else {
			gba.pause();
		}
	}
}

function screenshot() {
	var resizedCanvas = document.createElement('canvas');
	var resizedContext = resizedCanvas.getContext('2d');
	resizedContext.imageSmoothingEnabled = true;
	resizedContext.mozImageSmoothingEnabled = false;
	resizedContext.webkitImageSmoothingEnabled = false;
	resizedContext.msImageSmoothingEnabled = false;
	resizedContext.imageSmoothingEnabled = false;

	resizedCanvas.height = $('#screenwrapper').height();
	resizedCanvas.width = $('#screenwrapper').width();

	var canvas = document.getElementById('screen');
	resizedContext.drawImage(
		canvas,
		0,
		0,
		resizedCanvas.width,
		resizedCanvas.height
	);

	let data = resizedCanvas.toDataURL();
	let image = new Image();
	image.src = data;
	let w = window.open('');
	w.document.write(image.outerHTML);
}

function lcdFade(context, target, callback) {
	let i = 0;
	let drawInterval = setInterval(function () {
		i++;
		let pixelData = context.getImageData(0, 0, 240, 160);
		for (let y = 0; y < 160; ++y) {
			for (let x = 0; x < 240; ++x) {
				let xDiff = Math.abs(x - 120);
				let yDiff = Math.abs(y - 80) * 0.8;
				let xFactor = (120 - i - xDiff) / 120;
				let yFactor =
					(80 - i - (y & 1) * 10 - yDiff + Math.pow(xDiff, 1 / 2)) /
					80;
				pixelData.data[(x + y * 240) * 4 + 3] *=
					Math.pow(xFactor, 1 / 3) * Math.pow(yFactor, 1 / 2);
			}
		}
		context.putImageData(pixelData, 0, 0);
		target.clearRect(0, 0, 480, 320);
		if (i > 40) {
			clearInterval(drawInterval);
		} else {
			callback();
		}
	}, 50);
}

function setVolume(value) {
	gba.audio.masterVolume = Math.pow(2, value) - 1;
}

function setPixelated(pixelated) {
	let screen = document.getElementById('screen');
	let context = screen.getContext('2d');
	context.imageSmoothingEnabled = !pixelated;
}

function setFastForward(which) {
	if (!gba.paused) {
		gba.pause();
		clearTimeout(gba.queue);
		gba.throttle = which ? 0 : 16;
		gba.runStable();
	} else {
		gba.throttle = which ? 0 : 16;
	}
}

function enableDebug() {
	window.onmessage = function (message) {
		if (
			message.origin != document.domain &&
			(message.origin != 'file://' || document.domain)
		) {
			console.log('Failed XSS');
			return;
		}
		switch (message.data) {
			case 'connect':
				if (message.source === debug) {
					debug.postMessage('connect', document.domain || '*');
				}
				break;
			case 'connected':
				break;
			case 'disconnect':
				if (message.source === debug) {
					debug = null;
				}
		}
	};
	window.onunload = function () {
		if (debug && debug.postMessage) {
			debug.postMessage('disconnect', document.domain || '*');
		}
	};
	if (!debug || !debug.postMessage) {
		debug = window.open('debugger.html', 'debug');
	} else {
		debug.postMessage('connect', document.domain || '*');
	}
}

function enableRunMenuNode() {
	$('#ingameactionsmenu').removeClass('disabled');
	$('#ingameactionsmenu').addClass('enabled');
}

function disableRunMenuNode() {
	$('#collapseOne').collapse('hide');
	$('#ingameactionsmenu').removeClass('enabled');
	$('#ingameactionsmenu').addClass('disabled');
}

function disablePreMenuNode() {
	$('#collapseTwo').collapse('hide');
	$('#pregameactionsmenu').removeClass('enabled');
	$('#pregameactionsmenu').addClass('disabled');
}

function enablePreMenuNode() {
	$('#pregameactionsmenu').removeClass('disabled');
	$('#pregameactionsmenu').addClass('enabled');
}

function disableVirtualControlsMenuNode() {
	$('virtualcontrolsmenu').removeClass('enabled');
	$('virtualcontrolsmenu').addClass('disabled');
}

function enableDpad() {
	$('#dpadholder').fadeIn();
}

function disableDpad() {
	$('#dpadholder').fadeOut();
}

function enableDpadButtons() {
	$('#dpadabbuttonholder').fadeIn();
	$('#dpadstartselectbuttonholder').fadeIn();
}

function disableDpadButtons() {
	$('#dpadabbuttonholder').fadeOut(); //why is this not working correctly?
	$('#dpadstartselectbuttonholder').fadeOut();
}

function enableVirtualControls() {
	if (virtualControlsEnabled) {
		disableDpad();
		disableDpadButtons();
		virtualControlsEnabled = false;
	} else {
		enableDpad();
		enableDpadButtons();
		virtualControlsEnabled = true;
	}
}

document.addEventListener(
	'webkitfullscreenchange',
	function () {
		let canvas = document.getElementById('screen');
		if (document.webkitIsFullScreen) {
			canvas.setAttribute('style', 'margin: 0;top: 50%;');
		} else {
			canvas.removeAttribute('style');
		}
	},
	false
);

const fullScreen = () => {
	var elem = document.getElementById('screen');
	if (undefined === elem.requestFullscreen) {
		//noinspection JSUnresolvedVariable
		elem.requestFullscreen =
			elem.webkitRequestFullscreen ||
			elem.webkitRequestFullScreen ||
			elem.mozRequestFullScreen ||
			elem.msRequestFullscreen;
	}
	elem.requestFullscreen();
};

function buttonPlayPress() {
	if (statepause == 'stop') {
		statepause = 'play';
		var button = $('#button_play').attr('btn-success', true);
		button.select('i').attr('class', 'fa fa-pause');
	} else if (statepause == 'play' || statepause == 'resume') {
		statepause = 'pause';
		$('#button_play i').attr('class', 'fa fa-play');
	} else if (statepause == 'pause') {
		statepause = 'resume';
		$('#button_play i').attr('class', 'fa fa-pause');
	}
	togglePause();
}

function buttonFastforwardPress() {
	stateff = !stateff;
	var button = $('#button_ffw i');
	if (stateff) {
		button.attr('class', 'fa fa-forward');
	} else {
		button.attr('class', 'fa fa-fast-forward');
	}
	setFastForward(stateff);
}

function simulateKeyDown(keyCode) {
	gba.keypad.keyboardHandler(
		new KeyboardEvent('keydown', {
			keyCode: keyCode,
			which: keyCode,
			shiftKey: false,
			ctrlKey: false,
			metaKey: false
		})
	);
}

function simulateKeyUp(keyCode) {
	gba.keypad.keyboardHandler(
		new KeyboardEvent('keyup', {
			keyCode: keyCode,
			which: keyCode,
			shiftKey: false,
			ctrlKey: false,
			metaKey: false
		})
	);
}

function orientActionControlPanel() {
	if (!actioncontrolorient) {
		$('#actioncontrolpanel').css('width', '175px');
		actioncontrolorient = true;
	} else {
		$('#actioncontrolpanel').css('width', 'fit-content');
		actioncontrolorient = false;
	}
}

function fillUserKeyBinding(event, cell) {
	cell.textContent = event.key;
	$(cell).attr('data-keycode', event.keyCode);
}

function remapUserKeyBindings() {
	$('#controlsTable tr').each(function () {
		var descrip = $.trim($(this).find('.descrip').text()),
			keybinding_code = $.trim(
				$(this).find('.keybind').attr('data-keycode')
			);

		if (
			descrip != null &&
			descrip != '' &&
			keybinding_code != null &&
			keybinding_code != ''
		) {
			var tmp = parseFloat(keybinding_code);
			if (!Number.isNaN(tmp)) {
				gba.keypad.remapKeycode(descrip.toUpperCase(), tmp);
			}
		}
	});
}
