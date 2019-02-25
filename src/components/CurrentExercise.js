import React from 'react';

class CurrentExercise extends React.Component {

	nameRef = React.createRef();
	numberOfSetsRef = React.createRef();
	repsRef = React.createRef();
	weightsRef = React.createRef();
	notesRef = React.createRef();

	updateExercise = (event) => {
		// stop form from submitting
		event.preventDefault();
		const currentExercise = {
			name: this.nameRef.current.value,
			reps: this.repsRef.current.value,
			weights: this.weightsRef.current.value,
			notes: this.notesRef.current.value,
		}

		if (currentExercise.name === '' ||
				currentExercise.reps === '' ||
				currentExercise.weights === '') {
			this.props.notify(event, 'error', 'blank');
			return;
		}

		return fetch('/exercise?type=' + this.props.getWorkoutFromURL(), {
        method: 'POST',
				headers: {
					'Accept': 'application/json',
		 			'Content-Type': 'application/json'
				 },
        body: JSON.stringify(currentExercise)
    })
    .then(response => this.props.notify(event, 'save', currentExercise.name));
	}

	handleSetSets = () => {
		console.log(this.numberOfSetsRef.current.value);
		//TODO: eventually dynamically load inputs for reps and weight per set
	}

	render() {
		return (
			<form className="current-workout-edit">
				<input
					name="exercise"
					ref={this.nameRef}
					type="text"
					placeholder="Exercise"
					defaultValue={this.props.currentExercise.name}
				/>
				<label>
					Sets:
				</label>
				<select name="numberOfSets" ref={this.numberOfSetsRef} onChange={this.handleSetSets}>
				  <option value="1">1</option>
				  <option value="2">2</option>
				  <option value="3">3</option>
				  <option value="4">4</option>
				  <option value="5">5</option>
				  <option value="6">6</option>
					<option value="7">7</option>
					<option value="8">8</option>
				</select>
				<button name="close" onClick={() => this.props.deleteExercise(this.props.currentExercise)}>
					<span role="img" aria-label="Trash">🗑️</span>
				</button>
				<input
					name="reps"
					ref={this.repsRef}
					type="text"
					placeholder="Reps"
					defaultValue={this.props.currentExercise.reps}
				/>
				<input
					name="weights"
					ref={this.weightsRef}
					type="text"
					placeholder="Weights"
					defaultValue={this.props.currentExercise.weights}
				/>
				<textarea
					name="desc"
					ref={this.notesRef}
					placeholder="Notes"
				/>
				<button type="submit" name="submit" onClick={this.updateExercise}>Apply</button>
			</form>
		);
	}
}

export default CurrentExercise;
