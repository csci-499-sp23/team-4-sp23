import React from 'react'
import { Button, Container } from 'react-bootstrap'
import { generateStudentPins } from '../../services/accountService'

export default function Admin() {

    return <Container>
        <h2>Admin Page</h2>

        <Button onClick={generateStudentPins}>Generate Student pins</Button>
    </Container>
}