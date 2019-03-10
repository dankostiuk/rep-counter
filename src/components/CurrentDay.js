import React from 'react';
import NotificationSystem from 'react-notification-system';
import CurrentExercise from './CurrentExercise';

class CurrentDay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			pastWorkout: {
				workout_exercises: []
			}
		};
	}

	componentDidMount() {
		this._notificationSystem = null;
		fetch('/workout?type=' + this.props.getWorkoutFromURL())
			.then(res => {
				if (!res.ok) {
					throw Error(res.statusText);
				}
				return res.json();
			})
			.then(pastWorkout => {
				this.setState({ pastWorkout })
			})
			.catch(error => { console.error(error)});
  }

	showNotification(event, type, name) {
		
		if (this._notificationSystem) {

			if (type === 'save')
	 			this._notificationSystem.addNotification({
					title: 'Saved!',
					message: name,
					level: 'success'
			 });

			 if (type === 'error_missing')
				 this._notificationSystem.addNotification({
					 title: 'Error!',
					 message: 'Please fill all fields',
					 level: 'error'
				});

			if (type === 'error_must_match')
				this._notificationSystem.addNotification({
					title: 'Error!',
					message: 'Sets must be complete',
					level: 'error'
			   });
	 }
 }

 addNewExercise = (event)  => {
		const newExercise = {
			_id: this.state.pastWorkout.workout_exercises.length,
			name: '',
			reps: '',
			weights: '',
			notes: '',
		}
		let pastWorkout = {...this.state.pastWorkout};
		pastWorkout.workout_exercises.push(newExercise);

		this.setState({pastWorkout});
 }

 deleteExercise = (exercise) => {
	 let pastWorkout = {...this.state.pastWorkout};
	 let currentExercises = pastWorkout.workout_exercises.filter( workout_exercise => {
		 return workout_exercise._id !== exercise._id;
	 });

	 pastWorkout.workout_exercises = currentExercises;

	 this.setState({pastWorkout});
 }

	render() {
		return (
			<div className="current-day">
				<NotificationSystem ref={n => this._notificationSystem = n} />
				<h2 name="day-title">Current {this.props.getWorkoutFromURL()} Day</h2>
				<div className="exercise-list">
					{this.state.pastWorkout.workout_exercises.map(exercise =>
						<CurrentExercise
							key={exercise._id}
							currentExercise={exercise}
							getWorkoutFromURL={this.props.getWorkoutFromURL}
							notify={(event, type, name) => 
								this.showNotification(event, type, name)}
							deleteExercise={(e) => this.deleteExercise(e)}
						/>
					)}
				</div>
				<div className="add-new-exercise">
					<button type="submit" onClick={this.addNewExercise}>+ Add Exercise</button>
				</div>
			</div>
		);
	}
}

export default CurrentDay;
