import React from 'react';

class PreviousDay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			pastWorkout: {
				workout_exercises: []
			}
		};
	}

	componentDidMount() {
	    fetch('/pastWorkout?type=' + this.props.getWorkoutFromURL())
	      .then(res => res.json())
	      .then(pastWorkout => {
					this.setState({ pastWorkout })
				})
				.catch(error => {
					console.error(error);
				});
  }

	getDateFromISOString(isoString) {
		if (isoString !== undefined) {
			return isoString.toString().split("T")[0];
		}
	}

	render() {
		const noPreviousWorkouts = this.state.pastWorkout.workout_exercises.length === 0;

		return (
			<div className="previous-day">
				<h2>Previous {this.props.getWorkoutFromURL()} Day</h2>
				<h5>{this.getDateFromISOString(this.state.pastWorkout.date)}</h5>
				{this.state.pastWorkout.workout_exercises.map(exercise =>
					<div key={exercise.id} class="past-workout">
						<div>
							<label>Exercise:</label> {exercise.name}
						</div>
						<div>
							<label>Reps:</label> {exercise.reps}
						</div>
						<div>
							<label>Weight:</label> {exercise.weights}
						</div>
						<div>
							<label>Notes:</label> {exercise.notes}
						</div>
					</div>
				)}
				<div>{noPreviousWorkouts ? 'No past records found - add new exercises and check back later.':''}</div>
			</div>
		);
	}
}

export default PreviousDay;
