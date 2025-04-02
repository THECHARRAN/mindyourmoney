import React, { useState, useEffect } from "react";
import { auth, googleProvider, db } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, where, orderBy, onSnapshot, setDoc, doc } from "firebase/firestore";

const App = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchExpenses(currentUser.uid);
    });
    return () => unsubscribe();
  }, []);

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(error.message);
    }
  };

  // Function to handle Sign-Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setExpenses([]); // Clear expenses on logout
    } catch (error) {
      console.error("Error during sign-out:", error);
      alert(error.message);
    }
  };

  // Function to fetch user's expenses
  const fetchExpenses = (userId) => {
    const q = query(
      collection(db, "expenses"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  };

  // Function to add an expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || !category) return alert("Please fill all fields");

    try {
      await addDoc(collection(db, "expenses"), {
        userId: user.uid,
        amount: parseFloat(amount),
        category,
        note,
        createdAt: new Date(),
      });
      setAmount("");
      setCategory("");
      setNote("");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // Function to set a monthly budget
  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!budget) return alert("Please enter a budget amount");

    try {
      await setDoc(doc(db, "budgets", user.uid), {
        amount: parseFloat(budget),
      });
      alert("Budget set successfully!");
      setBudget("");
    } catch (error) {
      console.error("Error setting budget:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>MindYourMoney</h1>

      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <img src={user.photoURL} alt="Profile" width="100" style={{ borderRadius: "50%" }} />
          <br />
          <button onClick={handleSignOut}>Sign Out</button>

          {/* Budget Form */}
          <h2>Set Monthly Budget</h2>
          <form onSubmit={handleSetBudget}>
            <input
              type="number"
              placeholder="Set Monthly Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
            <button type="submit">Set Budget</button>
          </form>

          {/* Expense Form */}
          <h2>Add Expense</h2>
          <form onSubmit={handleAddExpense}>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button type="submit">Add Expense</button>
          </form>

          {/* Expense List */}
          <h2>Your Expenses</h2>
          <ul>
            {expenses.map((expense) => (
              <li key={expense.id}>
                {expense.category}: ₹{expense.amount} - {expense.note}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      )}
    </div>
  );
};

export default App;
