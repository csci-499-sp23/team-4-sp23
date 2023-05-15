import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase-config";
import { docToJson } from "../jsonUtils";
import { useUserSelector } from "./selectors";
import { setHostProfile } from "./appSlice";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";



export function profileWatch(ref, cb) {
    return (cb) => {

        console.log('profileWatchSubscribe')
        // onSnapshot(ref, (snapshot) => {
        //     return cb(!doc ? null : docToJson(doc))
        // })
    }
}

export function useHostProfileInitialize({ initialize } = { initialize: true }) {

    const dispatch = useDispatch()
    const user = useUserSelector()
    const [localHostProfile, setLocalHostProfile] = useState(/** @type {import("../..").HostProfile}*/(null))


    const initializeHostProfile = useCallback(async (_user = user) => {
        let subscribe

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

    const updateProfile = async (/** @template */field, value) => {
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

