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
          <Route path="/cadastro" element={<Signup />} />
          <Route path="/painel" element={protectedPage(<Dashboard />)} />
          <Route path="/clientes" element={protectedPage(<Customers />)} />
          <Route
            path="/clientes/novo"
            element={protectedPage(<NewCustomer />)}
          />
          <Route
            path="/clientes/editar/:id"
            element={protectedPage(<EditCustomer />)}
          />
          <Route
            path="/clientes/:id/informacoes"
            element={protectedPage(<CustomerInfo />)}
          />
          <Route path="/anotacoes/:id" element={protectedPage(<Notes />)} />
          <Route
            path="/anotacoes/:customerId/nova"
            element={protectedPage(<NewNote />)}
          />
          <Route
            path="/anotacoes/:customerId/editar/:noteId"
            element={protectedPage(<NewNote />)}
          />
          <Route path="/agenda" element={protectedPage(<Appointments />)} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
