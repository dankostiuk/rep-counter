import React from 'react';
import CurrentExercise from './CurrentExercise';

class CurrentDay extends React.Component {

	state = {
		pastWorkout: {
			workout_exercises: []
		}
	};

	componentDidMount() {
	    fetch('/pastWorkout?type=' + this.props.getWorkoutFromURL())
	      .then(res => res.json())
	      .then(pastWorkout => {
					this.setState({ pastWorkout })
				})
				.catch(error => { console.error(error)});
  }

	render() {
		return (
			<div className="current-day">
				<h2>Current {this.props.getWorkoutFromURL()} Day</h2>
				<div className="exercise-list">
					{this.state.pastWorkout.workout_exercises.map(exercise =>
						<CurrentExercise currentExercise={exercise} getWorkoutFromURL={this.props.getWorkoutFromURL}/>
					)}
				</div>
			</div>
		);
	}
}

export default CurrentDay;
