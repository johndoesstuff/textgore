import React from 'react';
export function Card({ children }) {
	return <div className="border rounded-lg shadow-sm">{children}</div>;
}

export function CardContent({ children }) {
	return <div className="p-4">{children}</div>;
}

