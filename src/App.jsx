import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Container from './components/layout/Container';
import ProtectedRoute from './components/global/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import NewCustomer from './pages/NewCustomer';
import EditCustomer from './pages/EditCustomer';
import CustomerInfo from './pages/CustomerInfo';
import Notes from './pages/Notes';
import NewNote from './pages/NewNote';
import Appointments from './pages/Appointments';

const protectedPage = (page) => <ProtectedRoute>{page}</ProtectedRoute>;

function App() {
  return (
    <BrowserRouter>
      <Container>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={protectedPage(<Dashboard />)} />
          <Route path="/customers" element={protectedPage(<Customers />)} />
          <Route
            path="/customers/new"
            element={protectedPage(<NewCustomer />)}
          />
          <Route
            path="/customers/edit/:id"
            element={protectedPage(<EditCustomer />)}
          />
          <Route
            path="/customers/:id/info"
            element={protectedPage(<CustomerInfo />)}
          />
          <Route path="/notes/:id" element={protectedPage(<Notes />)} />
          <Route
            path="/notes/:customerId/new"
            element={protectedPage(<NewNote />)}
          />
          <Route
            path="/notes/:customerId/edit/:noteId"
            element={protectedPage(<NewNote />)}
          />
          <Route
            path="/appointments"
            element={protectedPage(<Appointments />)}
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
