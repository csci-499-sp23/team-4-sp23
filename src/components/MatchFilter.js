import { useQuestions } from "../services/question.service";

//show preseentable questions with select/multi select options to allow 
export function MatchFilter(/** @type {{responses: import("../..").QuestionAnswer[]}} */ { responses, onChange }) {
    // if (!responses) {
    //     {
    //         throw Error("Error: responses invalid")
    //     }
    // }
    const { questions, getQuestionOptions, options } = useQuestions()

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
        {presentableQuestions.map((pq) =>

            <div className="btn-group d-block" key={pq.id}>
                <label >
                    {pq.question}
                </label>
                <select className="custom-select" name={pq.id} onChange={(e) => updateFilterPairs(pq.question_code, e.target.value)}>
                    {getQuestionOptions(pq, options).map(({ answer, answer_code }) => <option key={answer_code} value={answer_code} type="button">{answer}</option>)}

                </select>
            </div >

        )
        }
    </div >
}