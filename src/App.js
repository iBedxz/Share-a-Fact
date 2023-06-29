import { func } from "prop-types";
import "./style.css";
import { useEffect, useState } from "react";
import supabase from "./supabase";
import { async } from "q";

// Colors and Categories Colors
const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  let query = supabase.from("facts").select("*");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");

        if (currentCategory !== "all") {
          query = query.eq("category", currentCategory);
        }

        const { data: facts, error } = await query.limit(100);
        setFacts(facts);
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header setShowForm={setShowForm} showForm={showForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? <Loader /> : <FactList facts={facts} setFact={setFacts} />}
      </main>
    </>
  );
}

function Loader() {
  return <p>Loading...</p>;
}

function Header({ setShowForm, showForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img
          src="./logo.png"
          alt="Today I Learned Logo"
          height="68px"
          width="68px"
        />
        <h1>Today I Learned</h1>
      </div>

      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((state) => !state)}
      >
        {showForm ? "Close" : "Share a Fact"}
      </button>
    </header>
  );
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  async function handleSubmit(e) {
    // 1. Prevent browser reload
    e.preventDefault();

    // 2. Check the data is valid. If os create a new fact
    console.log(text, source, category);
    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      // 3. Uploading New Fact
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      if (!error)
        // 4. Add the new fact to the UI
        setFacts((crr) => [newFact[0], ...crr]);

      // 5. Reset input fields
      setText("");
      setSource("");
      setCategory("");

      // 6. CLose the form
      setShowForm(false);
    }
  }
  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        onChange={(e) => setSource(e.target.value)}
      />
      <select
        disabled={isUploading}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Choose category</option>
        {CATEGORIES.map((el) => (
          <option key={el.name} value={el.name}>
            {el.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}
function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li>
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((el, index) => (
          <li key={index + 1}>
            <button
              onClick={() => setCurrentCategory(el.name)}
              className="btn btn-category"
              style={{ backgroundColor: el.color }}
            >
              {el.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFact }) {
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          // The factArg is the argument of the component Fact() and is storing the results of iteration of map() function
          <Fact key={fact.id} factArg={fact} setFact={setFact} />
        ))}
      </ul>
      <p>
        There are{" "}
        {facts.length == 1 ? facts.length + " Fact" : facts.length + " Facts"}.
        Add Your Own...
      </p>
    </section>
  );
}

// Apparently the factArg argument stores its value inside an Object, then here we are destructuring the Object to only get the value of its key and using as the way we like
function Fact({ factArg, setFact }) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function voteButton(string) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({
        [string]: factArg[string] + 1,
      })
      .eq("id", factArg.id)
      .select();
    setIsUpdating(false);
    if (!error)
      setFact((crr) =>
        crr.map((f) => (f.id === factArg.id ? updatedFact[0] : f))
      );
  }
  return (
    <li className="fact">
      <p>
        {factArg.text}
        <a href={factArg.source} target="_blank" className="source">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find(
            (cat) => factArg.category === cat.name
          ).color,
          padding: "5px 10px",
        }}
      >
        {factArg.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => voteButton("votesInteresting")}
          disabled={isUpdating}
        >
          👍 {factArg.votesInteresting}
        </button>
        <button
          onClick={() => voteButton("votesMindblowing")}
          disabled={isUpdating}
        >
          🤯 {factArg.votesMindblowing}
        </button>
        <button onClick={() => voteButton("votesFalse")} disabled={isUpdating}>
          ⛔ {factArg.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
