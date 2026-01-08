import Filter from "bad-words";

const filter = new Filter();

const getQuestionsForItem = (item_id) => {
    return fetch(`http://localhost:3333/item/${item_id}/question`)
    .then((response) => {
        if(response.status === 200){
            return response.json();
        } 
        if (response.status === 404) {
            return [];
        }
        else {
            throw new Error("Something went wrong. Unable to fetch questions for the item");
        }
    });
}

const askQuestion = (item_id, questionText) => {
    const sanitisedQuestion = filter.clean(questionText);

    return fetch(`http://localhost:3333/item/${item_id}/question`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')},
        body: JSON.stringify({
            question_text: sanitisedQuestion
        })
    })
    .then((response) => {
        if(response.status === 200){
            return response.json();
        } 
        if (response.status === 403) {
            throw new Error("You cannot ask a question on your own items.");
        }}
    )};

const answerQuestion = (question_id, answerText) => {
    const sanitisedAnswer = filter.clean(answerText);

    return fetch(`http://localhost:3333/question/${question_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('session_token')
        },
        body: JSON.stringify({ 
            answer_text: sanitisedAnswer 
        })
    })
    .then((response) => {
        if (response.status === 200) {
            return response.json();
        } 
        if (response.status === 403) {
            throw new Error("Only the seller can answer questions for their own items.");
        }}
    )};

export const QuestionService = {
    getQuestionsForItem,
    askQuestion,
    answerQuestion
};
