import { useReducer, useState } from "react";

interface Student {
  id: number;
  name: string;
  score: number;
}

interface State {
  students: Student[];
}

type Action =
  | {
      type: "ADD_STUDENT";
      payload: string;
    }
  | {
      type: "INCREMENT_SCORE";
      payload: number;
    }
  | {
      type: "DECREMENT_SCORE";
      payload: number;
    }
  | {
      type: "RESET_SCORE";
      payload: number;
    };

const initialState: State = {
  students: [],
};

function reducer(
  state: State,
  action: Action
): State {
  switch (action.type) {
    case "ADD_STUDENT":
      return {
        ...state,
        students: [
          ...state.students,
          {
            id: Date.now(),
            name: action.payload,
            score: 0,
          },
        ],
      };

    case "INCREMENT_SCORE":
      return {
        ...state,
        students: state.students.map(
          (student) =>
            student.id === action.payload
              ? {
                  ...student,
                  score:
                    student.score + 1,
                }
              : student
        ),
      };

    case "DECREMENT_SCORE":
      return {
        ...state,
        students: state.students.map(
          (student) =>
            student.id === action.payload
              ? {
                  ...student,
                  score:
                    student.score - 1,
                }
              : student
        ),
      };

    case "RESET_SCORE":
      return {
        ...state,
        students: state.students.map(
          (student) =>
            student.id === action.payload
              ? {
                  ...student,
                  score: 0,
                }
              : student
        ),
      };

    default:
      return state;
  }
}

function App() {
  const [name, setName] =
    useState("");

  const [state, dispatch] =
    useReducer(
      reducer,
      initialState
    );

  const addStudent = () => {
    if (!name.trim()) return;

    dispatch({
      type: "ADD_STUDENT",
      payload: name,
    });

    setName("");
  };

  const topStudent =
    state.students.length > 0
      ? state.students.reduce(
          (top, current) =>
            current.score >
            top.score
              ? current
              : top
        )
      : null;

  return (
    <div>
      <h1>
        Student Score Manager
      </h1>

      <input
        type="text"
        placeholder="Enter student name"
        value={name}
        onChange={(e) =>
          setName(
            e.target.value
          )
        }
      />

      <button
        onClick={addStudent}
      >
        Add Student
      </button>

      <hr />

      <h2>
        {topStudent
          ? `Top Student: ${topStudent.name} (${topStudent.score})`
          : "No students available"}
      </h2>

      <hr />

      {state.students.map(
        (student) => (
          <div
            key={student.id}
          >
            <p>
              Name:{" "}
              {student.name}
            </p>

            <p>
              Score:{" "}
              {student.score}
            </p>

            <button
              onClick={() =>
                dispatch({
                  type: "INCREMENT_SCORE",
                  payload:
                    student.id,
                })
              }
            >
              ➕ Increase Score
            </button>

            <button
              onClick={() =>
                dispatch({
                  type: "DECREMENT_SCORE",
                  payload:
                    student.id,
                })
              }
            >
              ➖ Decrease Score
            </button>

            <button
              onClick={() =>
                dispatch({
                  type: "RESET_SCORE",
                  payload:
                    student.id,
                })
              }
            >
              Reset Score
            </button>

            <hr />
          </div>
        )
      )}
    </div>
  );
}

export default App;