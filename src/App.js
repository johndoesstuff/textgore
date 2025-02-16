import React from 'react';
import "./style.css";

import { useState, useRef, useEffect } from "react";

export default function TextModifierApp() {
	const [text, setText] = useState("The limits of my language means the limits of my world.");
	const [modifiedText, setModifiedText] = useState("");
	const textareaRef = useRef(null);

	const modifyText = () => {
		setModifiedText(destroyText(text));
	};

	const destroyText = (text, modOpts) => {
		if (!modOpts) {
			modOpts = {};
		}
		if (!modOpts.spacing) {
			modOpts.spacing = Math.random();
		}
		if (!modOpts.repeat) {
			modOpts.repeat = 10;
		}
		if (!modOpts.charShift) {
			modOpts.charShift = Math.random();
		}

		text += "\n";
		text = text.repeat(modOpts.repeat);

		text = text.split("").map(
			e => ~~(e.charCodeAt(0) + (modOpts.charShift/2 > Math.random() ? ((Math.random()*10*modOpts.charShift) - 5*modOpts.charShift) : 0))
		).filter(
			e => e >= 0
		).map(
			e => String.fromCodePoint(e)
		).join("")

		text = text.split("").map(
			e => e + (Math.random() < modOpts.spacing/2 ? " " : "")
		).join("").split("").map(
			e => e + (Math.random() < modOpts.spacing/6 ? "\t" : "")
		).join("").split("").map(
			e => e + (Math.random() < modOpts.spacing/20 ? "\n" : "")
		).join("");

		return text;
	}

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

