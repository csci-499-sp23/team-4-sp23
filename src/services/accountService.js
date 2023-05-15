import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import { docToJson } from "../jsonUtils";



export function profileWatch(ref, cb) {
    return (cb) => {

        console.log('profileWatchSubscribe')
        // onSnapshot(ref, (snapshot) => {
        //     return cb(!doc ? null : docToJson(doc))
        // })
    }
}

export async function getAccountInfo({ user }) {

    if (!user) {
        return
    }
    let subscribe
    const _where = where('email', '=', user.email)
    const studentCollectionRef = collection(db, 'students')
    const studentResponse = await getDocs(query(studentCollectionRef, _where))
    const parentCollectionRef = collection(db, 'parents')
    const parentResponse = (await getDocs(query(parentCollectionRef, _where)))

    let result;
    if (studentResponse.docs.length) {
        const [studentProfile] = studentResponse.docs.map(docToJson)
        result = { type: 'student', value: studentProfile }
        subscribe = (cb) => profileWatch(studentResponse, cb)
    } else if (parentResponse) {
        result = { type: 'parent', value: docToJson(parentResponse) }
        subscribe = (cb) => profileWatch(parentResponse, cb)
    }

    console.log('userprofile', { result })
    return [result, subscribe];
}

