import React from 'react';

class PreviousDay extends React.Component {

	constructor(props) {
		super(props);
		this.handleDateSelectChange = this.handleDateSelectChange.bind(this);
		this.getWorkoutForDate = this.getWorkoutForDate.bind(this);
		this.state = {
			dateList: [],
			pastWorkout: {
				workout_exercises: []
			}
		};
	}

	componentDidMount() {
		// fetch list of dates
		fetch('/workout/dates?type=' + this.props.getWorkoutFromURL())
			.then(res => res.json())
			.then(dateList => {
				this.setState({
					dateList: dateList,
				});
				// fetch past workout for most recent date, using method getWorkoutForDate
				this.getWorkoutForDate(dateList[0]);
			})
  }

	handleDateSelectChange(e) {
		this.getWorkoutForDate(e.target.value);
	}

	getWorkoutForDate(date) {
		fetch('/workout?type=' + this.props.getWorkoutFromURL() + '&date=' + date)
			.then(res => res.json())
			.then(pastWorkout => {
				this.setState({ pastWorkout })
			})
			.catch(error => {
				console.error(error);
			});
	}

	formatDate(currentDate) {
		if (currentDate !== undefined) {
			return currentDate.toString().split("T")[0];
		}
	}

	render() {
		const noPreviousWorkouts = this.state.pastWorkout.workout_exercises.length === 0;
		const dateList = this.state.dateList;
		const dateListItems = dateList.map((date) =>
			<option key={date}>{this.formatDate(date)}</option>
			);

		return (
			<div className="previous-day">
				<h2>Previous {this.props.getWorkoutFromURL()} Day</h2>
				<h5><select onChange={this.handleDateSelectChange}>{dateListItems}</select></h5>
				{this.state.pastWorkout.workout_exercises.map(exercise =>
					<div key={exercise._id} className="past-workout">
						<div>
							<label>Exercise:</label> {exercise.name}
						</div>
						<div>
							<label>Reps:</label> {exercise.reps}
						</div>
						<div>
							<label>Weight:</label> {exercise.weights}
						</div>
						<div>
							<label>Notes:</label> {exercise.notes}
						</div>
					</div>
				)}
				<div>{noPreviousWorkouts ? 'No past records found - add new exercises and check back later.':''}</div>
			</div>
		);
	}
}

export default PreviousDay;
