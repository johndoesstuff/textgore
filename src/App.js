import React from 'react';
import "./style.css";

import { useState } from "react";

export default function TextModifierApp() {
	const [text, setText] = useState("");
	const [modifiedText, setModifiedText] = useState("");

	const modifyText = () => {
		setModifiedText(text.toUpperCase()); // Example modification
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(modifiedText);
	};

	return (
		<div className="container">
			{/* Input Section */}
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
						Modify Text
					</button>
				</div>
			</div>

			{/* Output Section */}
			<div className="card">
				<textarea readOnly value={modifiedText} className="textarea"></textarea>
				<button className="button" onClick={copyToClipboard}>
					Copy to Clipboard
				</button>
			</div>
		</div>
	);
}

