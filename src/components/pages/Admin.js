import React from 'react'
import { Button, Container } from 'react-bootstrap'
import { generateStudentPins, writeUniverityToSchoolID } from '../../services/accountService'
import { Stack } from 'react-bootstrap';

export default function Admin() {

    return <Container>
        <h2>Admin Page</h2>

        <Stack direction='horizontal' gap={2}>

            <Button onClick={generateStudentPins}>Generate Student pins</Button>
            <Button onClick={writeUniverityToSchoolID}>write student.univerty to student.schoo_id</Button>
        </Stack>

    </Container>
}