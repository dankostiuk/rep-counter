import React from 'react';
import NotificationSystem from 'react-notification-system';
import CurrentExercise from './CurrentExercise';

class CurrentDay extends React.Component {

	state = {
		pastWorkout: {
			workout_exercises: []
		}
	};

	componentDidMount() {
		this._notificationSystem = null;
		fetch('/pastWorkout?type=' + this.props.getWorkoutFromURL())
			.then(res => res.json())
			.then(pastWorkout => {
				this.setState({ pastWorkout })
			})
			.catch(error => { console.error(error)});
  }

	showSaveNotification(event, name) {
		event.preventDefault();
		if (this._notificationSystem) {
 			this._notificationSystem.addNotification({
				title: 'Saved!',
				message: name,
				level: 'success'
		 });
	 }
 }

	render() {
		return (
			<div className="current-day">
				<NotificationSystem ref={n => this._notificationSystem = n} />
				<h2>Current {this.props.getWorkoutFromURL()} Day</h2>
				<div className="exercise-list">
					{this.state.pastWorkout.workout_exercises.map(exercise =>
						<CurrentExercise
							currentExercise={exercise}
							getWorkoutFromURL={this.props.getWorkoutFromURL}
							notifySaved={this.showSaveNotification.bind(this)}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default CurrentDay;
