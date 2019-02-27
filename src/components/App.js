import React from 'react';
import PreviousDay from './PreviousDay';
import CurrentDay from './CurrentDay';

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
				<button name="back" value="back" onClick={() => this.goBack()}>
					Back
				</button>
				<button name="logout" value="logout" onClick={() => this.logout()}>
					Logout
				</button>
				<div className="title">
					- repcountr -
				</div>
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
