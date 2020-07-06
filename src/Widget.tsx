import React from 'react'
import JSONPretty from 'react-json-pretty';
import './Widget.scss'

export default function Widget({ entity }:any) {
    return (
        <div className="MyWidget">
            <h1>Hello,</h1>
            <h2>This is the entity: </h2>
            <JSONPretty id="json-pretty" data={entity}></JSONPretty>
        </div>
    );
}