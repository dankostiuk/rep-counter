import React from 'react';

class PreviousDay extends React.Component {

	state = {
		pastExercises: []
	};

	componentDidMount() {
	    fetch('/pastWorkout')
	      .then(res => res.json())
	      .then(pastExercises => this.setState({ pastExercises }))
				.catch(error => { console.error(error)});
	  }

	render() {
		return (
			<div className="order">
				<h2>Previous {this.props.getWorkoutFromURL()} Day</h2>
				{this.state.pastExercises.map(exercise =>
					<div key={exercise.id}>{exercise.name}</div>
				)}
			</div>
		);
	}
}

export default PreviousDay;
