import React from 'react';

class WorkoutPicker extends React.Component {

 	workoutRef = React.createRef();

	goToWorkout = (event) => {
		// stop form from saving
		event.preventDefault();

		// get text from select
		const workoutName = this.workoutRef.current.value;

		// change page to /workout/workoutName
		this.props.history.push(`/workout/${workoutName}`);
	}

	render() {
		return (
		<form className="workout-selector" onSubmit={this.goToWorkout}>
			<h2>Select workout</h2>
			<select name="workout" ref={this.workoutRef}>
			  <option value="chest">Chest</option>
			  <option value="back">Back</option>
			  <option value="shoulders">Shoulders</option>
			  <option value="arms">Arms</option>
			  <option value="legs">Legs</option>
			  <option value="cardio">Cardio</option>
			</select>
			<button type="submit">Begin Workout</button>
		</form>
		)
	}
}

export default WorkoutPicker;
