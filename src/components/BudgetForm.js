import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, setDoc, doc } from "firebase/firestore";

const BudgetForm = () => {
  const [budget, setBudget] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!budget) return alert("Please enter a budget amount");

    try {
      await setDoc(doc(db, "budgets", auth.currentUser.uid), {
        amount: parseFloat(budget),
      });
      alert("Budget set!");
      setBudget("");
    } catch (error) {
      console.error("Error setting budget:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Set Monthly Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        required
      />
      <button type="submit">Set Budget</button>
    </form>
  );
};

export default BudgetForm;
