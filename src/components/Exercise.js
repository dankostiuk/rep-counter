import React from 'react';

class Exercise extends React.Component {

	nameRef = React.createRef();
	descRef = React.createRef();
	numberOfSetsRef = React.createRef();

	updateWorkout = (event) => {
		// stop form from submitting
		event.preventDefault();
		const currentWorkout = {
			name: this.nameRef.current.value,
			desc: this.descRef.current.value,
			numberOfSets: this.numberOfSetsRef.current.value
		}

		this.props.updateWorkout(currentWorkout);
	}

	handleSetSets = () => {
		console.log(this.numberOfSetsRef.current.value);
		//TODO: eventually dynamically load inputs for reps and weight per set
	}

	render() {
		return (
			<form className="current-workout-edit" onSubmit={this.updateWorkout}>
				<input name="exercise" ref={this.nameRef} type="text" placeholder="Exercise"/>
				<label>Sets:</label>
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
				<input name="reps" type="text" placeholder="Reps"/>
				<input name="weights" type="text" placeholder="Weights"/>
				<textarea name="desc" ref={this.descRef} placeholder="Notes"/>
				<button type="submit">Apply</button>
			</form>
		);
	}
}

export default Exercise;
