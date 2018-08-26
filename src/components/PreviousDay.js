import React from 'react';

class PreviousDay extends React.Component {

	state = {
		pastExercises: []
	};

	componentDidMount() {
	    fetch('/pastWorkout?type=' + this.props.getWorkoutFromURL())
	      .then(res => res.json())
	      .then(pastExercises => this.setState({ pastExercises }))
				.catch(error => { console.error(error)});
	  }

	render() {
		return (
			<div className="previous-day">
				<h2>Previous {this.props.getWorkoutFromURL()} Day</h2>
				{this.state.pastExercises.map(exercise =>
					<div key={exercise.id}>
						{exercise.name} {exercise.weight} {exercise.reps}
					</div>
				)}
			</div>
		);
	}
}

export default PreviousDay;
