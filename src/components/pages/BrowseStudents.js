import React from 'react';
import {useState, useEffect } from "react";
import {db} from "../../firebase-config";
import { collection, getDocs } from "@firebase/firestore";



const StudentList = () =>{
    const [students, setStudents] = useState([]);
    
    useEffect(() => {
        const getStudents = async () => {
            const studentsCollectionRef = collection(db, "students");
            const data = await getDocs(studentsCollectionRef);
            setStudents(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        };

        getStudents();
    }, []);
    return (
        students.map((student) => {
            return (
                <div>
                    <h3 className="browse-text">Name: {student.first_name} {student.last_name}</h3>
                </div>
            );
        })
    );
    
};

export default StudentList;
