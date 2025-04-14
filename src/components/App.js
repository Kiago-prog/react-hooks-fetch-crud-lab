import React, { useState, useEffect } from 'react';

function App() {
  const [questions, setQuestions] = useState([]);
  const [newQuestionPrompt, setNewQuestionPrompt] = useState('');

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('/api/questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    fetchQuestions();
  }, []);

  async function createQuestion() {
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: newQuestionPrompt, answer: 'Unknown' }),
      });
      const data = await response.json();
      setQuestions([...questions, data]);
      setNewQuestionPrompt('');
    } catch (error) {
      console.error('Error creating question:', error);
    }
  }

  async function deleteQuestion(id) {
    try {
      await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      setQuestions(questions.filter((question) => question.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  }

  async function updateAnswer(id, newAnswer) {
        try {
            await fetch(`/api/questions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answer: newAnswer }), // Send only the updated answer
            });
            setQuestions(
                questions.map((question) =>
                    question.id === id ? { ...question, answer: newAnswer } : question
                )
            );
        } catch (error) {
            console.error("Error updating answer:", error);
        }
    }

  return (
    <div>
      <h2>Questions</h2>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <p>{question.prompt}</p>
            <p>Answer: {question.answer}</p>
            <select
                value={question.answer}
                onChange={(e) => updateAnswer(question.id, e.target.value)}
            >
              <option value="Unknown">Unknown</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Maybe">Maybe</option>
            </select>
            <button onClick={() => deleteQuestion(question.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createQuestion();
        }}
      >
        <input
          type="text"
          value={newQuestionPrompt}
          onChange={(e) => setNewQuestionPrompt(e.target.value)}
          placeholder="Enter new question prompt"
        />
        <button type="submit">Create Question</button>
      </form>
    </div>
  );
}

export default App;