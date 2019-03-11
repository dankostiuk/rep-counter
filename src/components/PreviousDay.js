import React from 'react';
import { getDateFromDateTime,
	convertFromUtc,
	convertToUtc } from '../dateHelpers';
import Loader from 'react-loader-spinner';

class PreviousDay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			dateList: [],
			pastWorkout: {
				workout_exercises: []
			},
			loading: false
		};
	}

	componentDidMount() {
		// fetch list of dates
		fetch('/workout/dates?type=' + this.props.getWorkoutFromURL())
			.then(res => res.json())
			.then(dateList => {

				let mostRecentDate = dateList[0];
				// set state to have local times
				this.setState({
					dateList: dateList,
				});
				console.log('latest date: ' + mostRecentDate);
				if (mostRecentDate) {
					// fetch past workout for most recent date, using method getWorkoutForDate
					this.getWorkoutForDate(mostRecentDate);
				}
			})
			.catch(error => {
				console.log(error);
			});
			this.startLoading();
  	}

	handleDateSelectChange(e) {
		let index = e.target.selectedIndex;
		this.getWorkoutForDate(this.state.dateList[index]);
	}

	getWorkoutForDate(date) {
		console.log('getting past workout for date: ' + date);
		fetch('/workout?type=' + this.props.getWorkoutFromURL() + '&date=' + date)
			.then(res => {
				if (!res.ok) {
					throw Error(res.statusText);
				}
				return res.json()
			})
			.then(pastWorkout => {
				console.log(pastWorkout);
				this.setState({ 
					pastWorkout: pastWorkout,
					loading: false
				 })
			})
			.catch(error => {
				console.log(error);
			});
	}

	startLoading() {
		this.setState({
			loading: true
		})
	}
	
	render() {
		const noPreviousWorkouts = !this.state.pastWorkout.workout_exercises
			|| this.state.pastWorkout.workout_exercises.length === 0;

		return (
			<div className="previous-day">
				<h2 name="day-title">Previous {this.props.getWorkoutFromURL()} Day</h2>
				
				{this.state.loading 
					? 
					<center><Loader 
					type="Ball-Triangle"
					color="#00BFFF"
					height="50"	
					width="50"
					/></center>
					:
					<div></div>
					}
				
				{	
					noPreviousWorkouts 
					? 
						<div>
							<p>
								No records found!
							</p>
							<p>
								Add new exercises and check back after 24h.
							</p>
						</div>
					:
						<div>
							<h5 name="heading">
								<select onChange={e => this.handleDateSelectChange(e)}>
									{this.state.dateList.map((date) =>
										<option key={date}>
											{getDateFromDateTime(date)}
										</option>
									)}
								</select>
							</h5>
							{this.state.pastWorkout.workout_exercises.map(exercise =>
								<div key={exercise._id} className="past-workout">
									<div name="past-workout-exercise-row">
										<label>Exercise:</label> {exercise.name}
									</div>
									<div name="past-workout-exercise-row">
										<label>Reps:</label> {exercise.reps}
									</div>
									<div name="past-workout-exercise-row">
										<label>Weight:</label> {exercise.weights}
									</div>
									<div name="past-workout-exercise-row">
										<label>Notes:</label> {exercise.notes}
									</div>
								</div>
							
							)}
						</div>
				}
			</div>
		);
	}
}

export default PreviousDay;
