import React from 'react';
import {useState, useEffect } from "react";
import {db} from "../../firebase-config";
import { collection, getDocs } from "firebase/compat/firestore";



const StudentList = () =>{
    const [students, setStudents] = useState([]);
    const studentsCollectionRef = collection(db, "students");
    useEffect(() => {
        const getStudents = async () => {
            const data = await getDocs(studentsCollectionRef);
            setStudents(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        };

        getStudents();
    }, []);
    return (
        students.map((student) => {
            return (
                <div>
                    <h1>Name: {student.first_name} {student.last_name}</h1>
                </div>
            );
        })
    );
    
};

export default StudentList;
