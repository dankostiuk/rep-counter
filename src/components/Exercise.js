import React from 'react';

class Exercise extends React.Component {

	nameRef = React.createRef();
	descRef = React.createRef();

	updateWorkout = (event) => {
		// stop form from submitting
		event.preventDefault();
		const currentWorkout = {
			name: this.nameRef.current.value,
			desc: this.descRef.current.value
		}

		this.props.updateWorkout(currentWorkout);
	}

	render() {
		return (
			<form className="current-workout-edit" onSubmit={this.updateWorkout}>
				<input name="name" ref={this.nameRef} type="text" placeholder="Name"/>
				<textarea name="desc" ref={this.descRef} placeholder="Description"/>
				<button type="submit">Apply</button>
			</form>
		);
	}
}

export default Exercise;
