import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssignmentList from "./pages/AssignmentList";
import AssignmentAttempt from "./pages/AssignmentAttempt";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AssignmentList />} />
                <Route path="/assignments/:id" element={<AssignmentAttempt />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
