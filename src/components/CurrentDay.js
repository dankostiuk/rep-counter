import React from 'react';
import NotificationSystem from 'react-notification-system';
import CurrentExercise from './CurrentExercise';

class CurrentDay extends React.Component {

	constructor() {
		super();
		this.state = {
			pastWorkout: {
				workout_exercises: []
			}
		};
	}

	componentDidMount() {
		this._notificationSystem = null;
		fetch('/pastWorkout?type=' + this.props.getWorkoutFromURL())
			.then(res => res.json())
			.then(pastWorkout => {
				this.setState({ pastWorkout })
			})
			.catch(error => { console.error(error)});
  }

	showNotification(event, type, name) {
		event.preventDefault();
		if (this._notificationSystem) {

			if (type === 'save')
	 			this._notificationSystem.addNotification({
					title: 'Saved!',
					message: name,
					level: 'success'
			 });

			 if (type === 'error')
				 this._notificationSystem.addNotification({
					 title: 'Error!',
					 message: 'Please fill all fields',
					 level: 'error'
				});
	 }
 }

 addNewExercise = (event)  => {
		const newExercise = {
			name: '',
			reps: '',
			weights: '',
			notes: '',
		}
		var pastWorkout = {...this.state.pastWorkout};
		pastWorkout.workout_exercises.push(newExercise);

		this.setState({pastWorkout});
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
							notify={this.showNotification.bind(this)}
						/>
					)}
				</div>
				<div className="add-new-exercise">
					<button type="submit" onClick={this.addNewExercise}>+ Add New</button>
				</div>
			</div>
		);
	}
}

export default CurrentDay;
