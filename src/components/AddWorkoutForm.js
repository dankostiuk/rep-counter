import React from 'react';
import Exercise from './Exercise';

class AddWorkoutForm extends React.Component {

	updateWorkout = (workout) => {
		this.props.updateWorkout(workout);
	}

	render() {
		return (
			<div className="exercise-list">
				<Exercise updateWorkout={this.updateWorkout}/>
				<Exercise updateWorkout={this.updateWorkout}/>
				<Exercise updateWorkout={this.updateWorkout}/>
				<Exercise updateWorkout={this.updateWorkout}/>
			</div>
		);
	}
}

export default AddWorkoutForm;
