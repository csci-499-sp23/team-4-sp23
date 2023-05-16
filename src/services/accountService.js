import { collection, deleteField, doc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { db } from "../firebase-config";
import { docToJson } from "../jsonUtils";
import { setHostProfile } from "./appSlice";
import { useUserSelector } from "./selectors";

function generateUniquePIN() {
    const usedPins = new Set(); // Set to store used PINs

    const generateRandomDigit = () => Math.floor(Math.random() * 10); // Function to generate a random digit

    const generatePIN = () => {
        let pin = '';
        for (let i = 0; i < 6; i++) {
            if (i === 3) {
                pin += '-';
            }
            const digit = generateRandomDigit();
            pin += digit;
        }
        return pin;
    };

    let pin = generatePIN();
    while (usedPins.has(pin)) {
        pin = generatePIN();
    }

    usedPins.add(pin);
    return pin;
}



export async function generateStudentPins() {
    if (process.env.REACT_APP_ENABLE_ADMIN !== 'true') {
        console.log('Blocked: ENABLE_ADMIN!=true')
        return
    }

    try {
        //get all studennts
        const studentsRef = await getDocs(collection(db, 'students'))
        //for each student make a unique pin
        // Create a batched write operation
        const batch = writeBatch(db);

        studentsRef.docs
            .forEach((doc) => {
                const docRef = doc.ref;

                // Update the desired fields for each student document
                batch.update(docRef, { pin: generateUniquePIN() });
            })

        //update the student

        // Commit the batched write operation
        await batch.commit();

        console.log('Multiple students updated successfully!');
    } catch (error) {
        console.error('Error updating multiple students:', error);
    }

}



export async function writeUniverityToSchoolID() {
    if (process.env.REACT_APP_ENABLE_ADMIN !== 'true') {
        console.log('Blocked: ENABLE_ADMIN!=true')
        return
    }
    try {
        //get all studennts
        const studentsRef = await getDocs(collection(db, 'students'))
        //for each student make a unique pin
        // Create a batched write operation
        const batch = writeBatch(db);

        studentsRef.docs
            .forEach((doc) => {
                const docRef = doc.ref;

                // Update the desired fields for each student document
                batch.update(docRef, { university: deleteField() });
            })

        //update the student

        // Commit the batched write operation
        await batch.commit();

        console.log('Multiple students updated successfully!');
    } catch (error) {
        console.error('Error updating multiple students:', error);
    }

}




export function useHostProfileInitialize({ initialize } = { initialize: true }) {

    const dispatch = useDispatch()
    const user = useUserSelector()
    const [localHostProfile, setLocalHostProfile] = useState(/** @type {import("../..").HostProfile}*/(null))


    const initializeHostProfile = useCallback(async (_user = user) => {

        const _where = where('email', '==', _user.email)
        const studentCollectionRef = collection(db, 'students')
        const studentResponse = await getDocs(query(studentCollectionRef, _where))
        const parentCollectionRef = collection(db, 'parents')
        const parentResponse = (await getDocs(query(parentCollectionRef, _where)))


        let result;
        if (studentResponse.docs.length) {
            const [studentProfile] = studentResponse.docs.map(docToJson)
            result = { hostProfile: { type: 'student', value: studentProfile }, docRef: studentResponse }
            // subscribe = (cb) => profileWatch(studentResponse, cb)
        } else if (parentResponse.docs.length) {
            const [parentProfile] = parentResponse.docs.map(docToJson)
            result = { hostProfile: { type: 'parent', value: parentProfile }, docRef: parentResponse }
            // subscribe = (cb) => profileWatch(parentResponse, cb)
        }

        setLocalHostProfile(result?.hostProfile)
        dispatch(setHostProfile(result?.hostProfile))

        return result?.hostProfile


    }, [user, dispatch])

    useEffect(() => {
        if (!localHostProfile && initialize && user) {

            initializeHostProfile()
        }
    }, [initializeHostProfile, localHostProfile, initialize, user])

    // console.log('userprofile', { result })
    // return [result, subscribe];

    /** @template { keyof import('./../../index.d.ts').Student} T*/
    const updateProfile = async (/** @type {T} */field, value) => {
        const old_profile = { ...localHostProfile }
        /** @type {import("../..").Profile} */
        const newLocalProfile = { ...localHostProfile, value: { ...localHostProfile.value, [field]: value } }
        //update the value in the store
        try {
            const { id, ...data } = newLocalProfile.value
            setLocalHostProfile(newLocalProfile)
            dispatch(setHostProfile(newLocalProfile))
            await setDoc(doc(db, newLocalProfile.type + 's', id), data)
        } catch (error) {
            setLocalHostProfile(old_profile)
            dispatch(setHostProfile(old_profile))

            console.error(error)
        }
    }
    return { hostProfile: localHostProfile, updateProfile, loadProfile: initializeHostProfile };
}

