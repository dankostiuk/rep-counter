import React from 'react';
import AddWorkoutForm from './AddWorkoutForm';

class CurrentDay extends React.Component {

	render() {
		return (
			<div className="current-day">
				<h2>Current {this.props.getWorkoutFromURL()} Day</h2>
				<AddWorkoutForm updateWorkout={this.props.updateWorkout}/>
			</div>
		);
	}
}

export default CurrentDay;
