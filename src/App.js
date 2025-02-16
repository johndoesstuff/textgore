import React from 'react';
import "./style.css";

import { useState, useRef, useEffect } from "react";

const charMap = {};

for (let i = 0; i <= 0x10FFFF; i++) {
	const char = String.fromCodePoint(i);
	const normalized = char.normalize("NFKD");
	const baseChars = normalized.match(/[a-zA-Z0-9]/g);

	if (baseChars) {
		for (const base of baseChars) {
			if (!charMap[base]) {
				charMap[base] = new Set();
			}
			charMap[base].add(char);
		}
	}
}

for (const key in charMap) {
	charMap[key] = [...charMap[key]];
}

const supplementals = {
	latinExt: [
		["0080","00FF"],
		["0100","017F"],
		["0180","024F"],
		["0250","02AF"],
		["2C60","2C7F"],
	],
	sparkles: [
		["02B0","02FF"],
		["2070","209F"],
	],
	diacriticals: [
		["0300","036F"],
	],
	greekCyrillic: [
		["0370","03FF"],
		["0400","04FF"],
		["0500","052F"],
		["1F00","1FFF"],
	],
	letterlike: [
		["2100","214F"],
		["1D00","1D7F"],
		["2150","218F"],
	],
	math: [
		["2150","218F"],
		["2200","22FF"],
		["27C0","27EF"],
		["2980","29FF"],
		["2A00","2AFF"],
	],
	technical: [
		["2190","21FF"],
		["2300","23FF"],
		["27F0","27FF"],
		["2900","297F"],
	],
	block: [
		["2500","257F"],
		["2580","259F"],
	],
	shapes: [
		["2700","27BF"],
		["25A0","25FF"],
		["1F650","1F67F"],
		["2D30","2D7F"],
	],
	punctual: [
		["2E00","2E7F"],
		["2000","206F"],
		["FE30","FE4F"],
		["1D000","1D0FF"],
	],
}

const randCharInRange = (r0, r1) => {
	return String.fromCodePoint(~~(Math.random() * (parseInt(r1, 16) - parseInt(r0, 16)+1) + parseInt(r0, 16)))
}

const charsFromRanges = (ranges, n) => {
	return Array(n).fill(0).map(e => randCharInRange(...ranges[~~(Math.random()*ranges.length)])).join("")
}

const destroyText = (text, modOpts) => {
	if (!modOpts) {
		modOpts = {};
	}
	if (modOpts.spacing === undefined) {
		modOpts.spacing = Math.random();
	}
	if (modOpts.repeat === undefined) {
		modOpts.repeat = 10;
	}
	if (modOpts.progressive === undefined) {
		modOpts.progressive = Math.random() < 0.5;
	}
	if (modOpts.charShift === undefined) {
		modOpts.charShift = Math.random()**2;
	}
	if (modOpts.supplementals === undefined) {
		modOpts.supplementals = Math.random()**2;
	}
	if (modOpts.supSet === undefined) {
		modOpts.supSet = Object.keys(supplementals)[~~(Object.keys(supplementals).length*Math.random())];
	}
	if (modOpts.caseSwap === undefined) {
		modOpts.caseSwap = Math.random()**4;
	}
	if (modOpts.deform === undefined) {
		modOpts.deform = Math.random()**3;
	}
	console.log(JSON.stringify(modOpts));

	//repeat
	text += "\n";
	if (!modOpts.progressive) {
		text = text.repeat(modOpts.repeat);
	} else {
		let newText = "";
		for (let i = 0; i < modOpts.repeat; i++) {
			let modOptsC = JSON.parse(JSON.stringify(modOpts));
			modOptsC = Object.fromEntries(
				Object.entries(modOptsC).map(
					e => (typeof e[1] === 'number' && !isNaN(e[1])) ? [e[0], i*e[1]/modOpts.repeat] : e
				)
			);
			modOptsC.repeat = 1;
			modOptsC.progressive = false;
			newText += destroyText(text, modOptsC);
		}
		text = newText;
		return text;
	}

	//deform
	text = text.split("").map(
		e => Object.keys(charMap).includes(e) && Math.random() < modOpts.deform/2 ? charMap[e][~~(Math.random()*charMap[e].length)] : e
	).join("");

	//char shift
	text = text.split("").map(
		e => ~~(e.charCodeAt(0) + (modOpts.charShift/2 > Math.random() ? ((Math.random()*10*modOpts.charShift) - 5*modOpts.charShift) : 0))
	).filter(
		e => e >= 0
	).map(
		e => String.fromCodePoint(e)
	).join("");

	//supplementals
	text = text.split("").map(
		e => e + (Math.random() < modOpts.supplementals/2 ? charsFromRanges(supplementals[modOpts.supSet], ~~(1+modOpts.supplementals*2*Math.random()**2)) : "")
	).join("");

	//spacing
	text = text.split("").map(
		e => e + (Math.random() < modOpts.spacing/2 ? " " : "")
	).join("").split("").map(
		e => e + (Math.random() < modOpts.spacing/6 ? "\t" : "")
	).join("").split("").map(
		e => e + (Math.random() < modOpts.spacing/20 ? "\n" : "")
	).join("");

	//case swtich
	text = text.split("").map(
		e => Math.random() < modOpts.caseSwap/2 ? (e === e.toUpperCase() ? e.toLowerCase() : e.toUpperCase()) : e
	).join("");

	return text;
}

export default function TextModifierApp() {
	const [text, setText] = useState("The limits of my language means the limits of my world.");
	const [modifiedText, setModifiedText] = useState("");
	const textareaRef = useRef(null);

	const modifyText = () => {
		setModifiedText(destroyText(text));
	};


	const copyToClipboard = () => {
		navigator.clipboard.writeText(modifiedText);
	};

	const resizeTextarea = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			const prevHeight = textarea.offsetHeight + "px";
			textarea.style.height = "auto";
			const newHeight = textarea.scrollHeight + "px";
			textarea.style.height = prevHeight;
			void textarea.offsetHeight; //black magic fuckery
			textarea.style.height = newHeight;
		}
	};

	useEffect(resizeTextarea, [modifiedText]);

	return (
		<div className="container">
			<div className="card">
				<div className="input-group">
					<input
						type="text"
						placeholder="Enter text here"
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="input"
					/>
					<button className="button" onClick={modifyText}>
						Destroy!
					</button>
				</div>
			</div>

			<div className="card">
				<textarea ref={textareaRef} readOnly value={modifiedText} className="textarea"></textarea>
				<button className="button" onClick={copyToClipboard}>
					Copy to Clipboard
				</button>
			</div>
		</div>
	);
}

