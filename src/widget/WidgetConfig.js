import React from 'react'
import { useHistory } from "react-router-dom";
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import './Widget.scss'


export default function WidgetConfig() {
    const history = useHistory();

    return (
        <Container className="MyWidget">
            
            <h1>Nothing to configure!</h1>

            <Button color="primary" onClick={() => {
                history.push('/')
            }}>Go back to Widget</Button>
        </Container>
    )
}