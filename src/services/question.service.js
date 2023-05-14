import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { docToJson } from "../jsonUtils";


export const useQuestions = () => {
    const [questions, setQuestions] = useState(/** @type {import('../../index').Question[]}*/(null))
    const [options, setOptions] = useState(/** @type {import('../../index').SurveyAnswer[]} */(null))

    const loadQuestions = useCallback(async () => {
        const collectionRef = collection(db, 'surv_questions')
        const _questions = (await getDocs(query(collectionRef))).docs.map(docToJson)
        console.log('questions', _questions)
        setQuestions(/** @type {Question[]}*/ _questions)
    }, [setQuestions])

    const loadResponses = useCallback((userEmail) => {
        //load responses for the user here //optional
    }, [])

    const loadOptions = useCallback(async () => {
        const collectionRef = collection(db, 'surv_answers')
        /** @type {import("../../index").SurveyAnswer[]} */
        const _options = (await getDocs(query(collectionRef))).docs.map(docToJson)
        console.log('options', _options)
        setOptions(_options)
    }, [setOptions])



    const pair = useCallback(async (questionValue, /** @type {[]} */ optionValues) => {
        const updatedQuestion = questions.find(q => new RegExp(questionValue, 'i').test(q.question) || questionValue === q.question)
        const answer_codes = options.filter(opt => optionValues.some(answer => new RegExp(answer, 'i').test(opt.answer))).map(ans => ans.answer_code)
        updatedQuestion.answer_codes = answer_codes

        if (updatedQuestion?.answer_codes?.length) {
            console.log('pair complete', updatedQuestion)

            const { id, ...data } = updatedQuestion
            const docRef = doc(db, 'surv_questions', id)

            try {

                await setDoc(docRef, data, { merge: true })
                setQuestions(questions => questions.map(q => (q.questin_code === updatedQuestion.questin_code) ? updatedQuestion : q))
            } catch (error) {
                console.error(error)
            }
        }


    }, [questions, options])

    useEffect(() => {
        //load questions on first load
        questions === null && loadQuestions();
        //load options on first load
        options === null && loadOptions();
    }, [loadQuestions, questions, loadOptions, options]);

    const getQuestionOptions = (question, _options = options) => {
        return _options.filter(opt => question.answer_codes.includes(opt.answer_code))
    }

    return { questions, setQuestions, options, loadQuestions, loadResponses, pair, getQuestionOptions }
}