import React from 'react';
import "./style.css";

import { useState } from "react";

export default function TextModifierApp() {
	const [text, setText] = useState("");
	const [modifiedText, setModifiedText] = useState("");

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
			modOpts.repeat = 1;
		}

		text = text.repeat(modOpts.repeat);

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
				<textarea readOnly value={modifiedText} className="textarea"></textarea>
				<button className="button" onClick={copyToClipboard}>
					Copy to Clipboard
				</button>
			</div>
		</div>
	);
}

