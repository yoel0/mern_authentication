import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import About from './components/About';
import Footer from './components/Footer';
import './App.css';

const PrivateRoute = ({ component: Component, ...rest }) => {
	const user = localStorage.getItem('jwtToken');
	return (
		<Route
			{...rest}
			render={props => {
				return user ? (
					<Component {...rest} {...props} />
				) : (
					<Redirect to='/login' />
				);
			}}
		/>
	);
};

function App() {
	// set state values
	let [currentUser, setCurrentUser] = useState('');
	let [isAuthenticated, setIsAuthenticated] = useState(true);

	useEffect(() => {
		let token;
		if (!localStorage.getItem('jwtToken')) {
			setIsAuthenticated(false);
		} else {
			token = jwt_decode(localStorage.getItem('jwtToken'));
			setAuthToken(localStorage.jwtToken);
			setCurrentUser(token);
			setIsAuthenticated(true);
		}
	}, []);

	const nowCurrentUser = userData => {
		console.log('nowCurrentUser is working..');
		setCurrentUser(userData);
		setIsAuthenticated(true);
	};

	const handleLogout = () => {
		if (localStorage.getItem('jwtToken')) {
			localStorage.removeItem('jwtToken');
			setCurrentUser(null);
			setIsAuthenticated(false);
		}
	};

	console.log('Current User', currentUser);
	console.log('Authenticated', isAuthenticated);

	return (
		<div>
			<Navbar handleLogout={handleLogout} isAuth={isAuthenticated} />
			<div className='container mt-5'>
				<Switch>
					<Route path='/signup' component={Signup} />
					<Route
						path='/login'
						render={props => (
							<Login
								{...props}
								setCurrentUser={setCurrentUser}
								setIsAuthenticated={setIsAuthenticated}
								user={currentUser}
							/>
						)}
					/>
					<Route path='/about' cmponent={About} />
					<PrivateRoute
						path='/profile'
						component={Profile}
						user={currentUser}
					/>
					<Route exact path='/' component={Welcome} />
				</Switch>
			</div>
			<Footer />
		</div>
	);
}

export default App;
