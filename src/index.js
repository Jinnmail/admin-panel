import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, withRouter } from "react-router-dom";

class UserRow extends React.Component {
  render() {
    const user = this.props.user;
    const i = this.props.index;

    return (
      <tr>
        <td>{user.userId}</td>
        <td>{user.email}</td>
        <td>{user.premium.toString()}</td>
        <td><button id={user.userId} onClick={() => this.props.userDetailsClicked(user.userId)}>Details</button></td>
      </tr>
    );
  }
}

class UsersTable extends React.Component {
  render() {
    const filterText = this.props.filterText;
    const rows = [];

    let sortedUsers = [...this.props.users];
    sortedUsers.sort((a, b) => {
      if (a.email < b.email) {
        return -1;
      }
      if (a.email > b.email) {
        return 1;
      }
      return 0;
    });

    sortedUsers.forEach((user, i) => {
      if (user.email.indexOf(filterText) === -1) {
        return;
      }
      rows.push(<UserRow key={user.userId} user={user} index={i} userDetailsClicked={this.props.userDetailsClicked} />);
    });

    return (
      <div class="scrollit">
        <table>
          <thead>
            <tr>
              <th>User Id</th>
              <th>Email</th>
              <th>Premium</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );

    return (<div></div>)
  }
}

class SearchBar extends React.Component {
  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={e => this.props.filterTextChanged(e.target.value)}
        />
        <button>clear</button>
      </form>
    );
  }
}

class FilteredUsersTableOrig extends React.Component {
  state = {
    users: null,
    user: null,
    alias: null,
    filterText: '',
    aliases: null
  };

  async componentDidMount() {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/user`,
      {
        headers: { 'Authorization': localStorage.getItem('token') }
      })
    const users = await res.json()
    this.setState({ users: users })
  }

  filterTextChanged = (filterText) => {
    this.setState({
      user: null,
      alias: null,
      filterText: filterText
    });
  }

  clearSearch = () => {
    this.setState({
      user: null,
      alias: null,
      filterText: ''
    })
  }

  userDetailsClicked = async (userId) => {
    this.setState({ alias: null })
    const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/user/${userId}`,
      {
        headers: { 'Authorization': localStorage.getItem('token') }
      })
    const user = await res.json();
    this.setState(prevState => ({
      user: {
        // ...prevState.user,
        userId: user.data[0].userId,
        email: user.data[0].email,
        created: user.data[0].created,
        aliasesCount: user.data[0].aliasesCount,
        aliases: user.data[0].aliases,
        customerId: user.data[0].customerId
      }
    }));
  }

  aliasDetailsClicked = async (aliasId) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/alias/${aliasId}`,
      {
        headers: { 'Authorization': localStorage.getItem('token') }
      })
    const json = await res.json();
    this.setState({ alias: json.data[0] });
  }

  paidClicked = () => {
    const location = {
      pathname: '/paid',
      state: { prevPath: window.location.pathname }
    }
    this.props.history.push(location)
  }

  allAliasesClicked = async () => {
    const location = {
      pathname: '/aliases',
      state: { prevPath: window.location.pathname }
    }
    this.props.history.push(location)
  }

  render() {
    const user = this.state.user;
    const alias = this.state.alias;
    return (
      <>
        <div class="col-container">
          <div class="col-2">&nbsp;</div>
          <div class="col-2"><button onClick={this.allAliasesClicked}>All Aliases</button></div>
          <div class="col-1"><button onClick={this.paidClicked}>Paid Customers</button></div>
        </div>
        <div class="col-container">
          <div class="col-1">
            <h2>Users</h2>
            <SearchBar
              filterText={this.state.filterText}
              filterTextChanged={this.filterTextChanged}
              clearSearch={this.clearSearch}
            />
            {this.state.users ? (
              <UsersTable
                users={this.state.users}
                filterText={this.state.filterText}
                userDetailsClicked={this.userDetailsClicked}
              />
            ) : (
              null
            )
            }
          </div>
          <div class="col-2">
            <h2>User Details</h2>
            {user ? (
              <div>
                <p>User Id: {user.userId}</p>
                <p>User Email: {user.email}</p>
                <p>Customer Id: {user.customerId}</p>
                <p>Timestamp: {user.created}</p>
                <p>Alias Count: {user.aliasesCount}</p>
                {
                  user.aliases.map(alias => (
                    <li>
                      Alias: {alias.alias} <button onClick={() => this.aliasDetailsClicked(alias.aliasId)}>Details</button>
                    </li>
                  ))
                }
              </div>
            ) : (<p></p>)
            }
          </div>
          <div class="col-2">
            <h2>Alias Details</h2>
            {alias ? (
              <div>
                <p>Alias Id: {alias.aliasId}</p>
                <p>Alias: {alias.alias}</p>
                <p>Timestamp: {alias.created}</p>
                <p>Type: {alias.type}</p>
                <p>Message Count: {alias.mailCount}</p>
              </div>
            ) : (
              <div></div>
            )
            }
          </div>
        </div>
      </>
    );
  }

}

const FilteredUsersTable = withRouter(FilteredUsersTableOrig);

const PaidCustomers = () => {
  const [paidCustomers, setPaidCustomers] = React.useState([]);

  useEffect(() => {
    async function fetchPaidCustomers() {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/paid`,
        { headers: { 'Authorization': localStorage.getItem('token') } }
      )
      const paidCustomers = await res.json()
      setPaidCustomers(paidCustomers.data);
    }
    fetchPaidCustomers();
  }, [])

  return (
    <table>
      <thead>
        <tr>
          <th>Created</th>
          <th>Email</th>
          <th>Customer ID</th>
        </tr>
      </thead>
      <tbody>
        {
          paidCustomers.map(paidCustomer => (
            <tr>
              <td>{new Date(paidCustomer.created).toString()}</td>
              <td>{paidCustomer.email}</td>
              <td>{paidCustomer.customerId}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

const Aliases = (props) => {
  const [aliases, setAliases] = React.useState([]);

  useEffect(() => {
    async function fetchAliases() {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/aliases`,
        {
          headers: { 'Authorization': localStorage.getItem('token') }
        })
      const aliases = await res.json()
      setAliases(aliases.data);
    }
    fetchAliases();
  }, [])

  return (
    <table>
      <thead>
        <tr>
          <th>Created</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {
          aliases.map(alias => (
            <tr>
              <td>{new Date(alias.created).toString()}</td>
              <td>{alias.alias}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

class Main extends React.Component {
  state = { redirect: false };

  setRedirect = () => {
    this.setState({ redirect: true })
  }

  goToDashboard = () => {
    if (this.state.redirect) {
      return <Redirect to="/dashboard" />
    }
  }

  logout = () => {
    localStorage.removeItem("token");
  };

  render() {
    return (
      <Router>
        {localStorage.getItem('token') ? (
          <a href="/" className="nav-link" onClick={this.logout}>
            LogOut
          </a>
        ) : (<div></div>)}
        <Switch>
          <Route exact path={["/", "/logout"]}>
            <Login setRedirect={this.setRedirect} />
            {this.goToDashboard()}
            {/* {loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />} */}
          </Route>
          <Route path="/dashboard">
            {localStorage.getItem('token') ? <FilteredUsersTable /> : <div></div>}
          </Route>
          <Route path="/paid">
            <PaidCustomers />
          </Route>
          <Route path="/Aliases">
            <Aliases />
          </Route>
        </Switch>
      </Router>
    );
  }
}

class Login extends React.Component {
  state = {
    username: '',
    password: ''
  }

  usernameChanged = (e) => {
    this.setState({ username: e.target.value });
  };

  passwordChanged = (e) => {
    this.setState({ password: e.target.value });
  };

  loginClicked = async (e) => {
    e.preventDefault();
    const username = this.state.username;
    const password = this.state.password;
    const res = await fetch(`${process.env.REACT_APP_API_URL}/admin`, {
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    });
    const json = await res.json();
    if (json.data) {
      localStorage.setItem("token", json.data.token);
      this.props.setRedirect()
    }
  }

  render() {
    return (
      <form onSubmit={this.loginClicked}>
        <h3>Login</h3>
        <label>Username: </label>
        <input
          type="text"
          onChange={this.usernameChanged}
        />
        <br />
        <label>Password: </label>
        <input
          type="password"
          onChange={this.passwordChanged}
        />
        <br />
        <button>Login</button>
      </form>
    )
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// const USERS = [
//   {_id: "a", email: "email@number.com"}, 
//   {_id: "b", email: "client@server.com"}
// ];

// <FilteredUsersTable users={USERS} />, 
