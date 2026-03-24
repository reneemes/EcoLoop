import './dashboard.scss';
import { useAuth } from '../../context/authContext';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  console.log(user)

  return (
    <section>
      <h1>Hello {user.username}</h1>
    </section>
  )
}

export default Dashboard;