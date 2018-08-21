import React from 'react';

class PreviousDay extends React.Component {
	render() {
		return (
			<div className="order">
				<h2>Previous {this.props.getWorkoutFromURL()} Day</h2>
			</div>
		);
	}
}

export default PreviousDay;
