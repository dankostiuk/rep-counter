import React from 'react';
import PreviousDay from './PreviousDay';
import CurrentDay from './CurrentDay';
import { Grid, Row, Col } from 'react-flexbox-grid';

class App extends React.Component {
	state = {
		exercises: {}
	};

	updateWorkout = (exercise) => {
		// take copy of existing state
		const exercises = { ...this.state.exercises };
		// add new exercise to exercises
		exercises[`${exercise.name}`] = exercise;
		// set new exercises object to state
		this.setState({
			exercises: exercises
		});
	};

	getWorkoutFromURL = () => {
	  var pathArray = window.location.pathname.split('/');
		return pathArray[2];
	}

	goBack(event) {
		// go back to workout selector
		this.props.history.push(`/`);
	}

	logout() {
		fetch('/logout')
		.then(this.props.history.push(`/`));
	}

	render() {
		return (
			<div>
				<Grid fluid>
					<Row between="xs">
						<Col xs={2}>
						<button name="back" value="back" onClick={() => this.goBack()}>
							Back
						</button>
						</Col>
						<Col xs={3}>
						<div className="title">
							_repcountr
						</div>
						</Col>
						<Col xs={2}>
						<button name="logout" value="logout" onClick={() => this.logout()}>
							Logout
						</button>
						</Col>
					</Row>
				</Grid>
				
				
				
				<div className="rep-counter">
					<PreviousDay
						getWorkoutFromURL={this.getWorkoutFromURL}
						setPastWorkouts={this.setPastWorkout}
					/>
					<CurrentDay
						getWorkoutFromURL={this.getWorkoutFromURL}
						updateWorkout={this.updateWorkout}
					/>
				</div>
				<div className="copyright">
					<span role="img" aria-label="lift">🏋️</span> by dankostiuk
				</div>
			</div>
		)
	}
}

export default App;
