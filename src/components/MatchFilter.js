import { useCallback, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useQuestions } from "../services/question.service";

//show preseentable questions with select/multi select options to allow 
export function MatchFilter(/** @type {{responses: import("../..").QuestionAnswer[],onChange:(args=null)=>void} */ { responses, onChange }) {
    // if (!responses) {
    //     {
    //         throw Error("Error: responses invalid")
    //     }
    // }
    const [showFilters, setShowFilters] = useState(false)
    const { questions, getQuestionOptions, options } = useQuestions()

    const doClose = () => setShowFilters(false)
    const doOpen = () => setShowFilters(true)

    if (!questions?.length || !options?.length) {
        return <div>loading filters...</div>
    }
    const presentableQuestions = questions?.filter((q) => !q.presentable)
    console.log({ questions, presentableQuestions })

    const getAnswer = (/** @type {import("../..").Question} */ question) => {
        const response = responses.find(res => res.question_code === question.question_code)
        const answer = options.find(opt => opt.answer_code === response.answer_code)
        return answer
    }

    const updateFilterPairs = (question_code, answer_code) => {
        onChange(oldFilters => {
            //remove previous question entry
            const cleanFilters = oldFilters.filter(pairId => !pairId.includes(question_code + ":"))
            return [...cleanFilters, `${question_code}:${answer_code}`]
        })
    }


    return <div className="match-filters">
        <Button variant='primary' onClick={doOpen}><i className="fa fa-gear"></i> </Button>
        <Modal show={showFilters} onHide={doClose}>
            <Modal.Header className="bg-primary">
                <Button onClick={doClose}> <i className="fa fa-close"></i> </Button>
            </Modal.Header>
            <Modal.Body className="bg-primary">
                {presentableQuestions.map((pq) =>

                    <div className="btn-group d-block text-center" key={pq.id}>
                        <label >
                            {pq.question}
                        </label>
                        <select className="custom-select" name={pq.id} onChange={(e) => updateFilterPairs(pq.question_code, e.target.value)}>
                            {getQuestionOptions(pq, options).map(({ answer, answer_code }) => <option key={answer_code} value={answer_code} type="button">{answer}</option>)}

                        </select>
                    </div >

                )
                }

            </Modal.Body>
        </Modal>
    </div >
}