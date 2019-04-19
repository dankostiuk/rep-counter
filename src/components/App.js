import React from "react";
import PreviousDay from "./PreviousDay";
import CurrentDay from "./CurrentDay";
import { Grid, Row, Col } from "react-flexbox-grid";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      exercises: {},
      width: window.innerWidth,
      previousDayActive: false
    };
  }

  componentDidMount() {
    // add listener to detect when using mobile-web or browser resize
    window.addEventListener("resize", this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    // clean up the resize listener
    window.removeEventListener("resize", this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  toggleMWebWorkoutView = () => {
    this.setState({
      previousDayActive: !this.state.previousDayActive
    });
  };

  updateWorkout = exercise => {
    // take copy of existing state
    const exercises = { ...this.state.exercises };
    // add new exercise to exercises
    exercises[`${exercise.name}`] = exercise;
    // set new exercises object to state
    this.setState({
      exercises: exercises
    });
  };

  getWorkoutFromURL = () => {
    var pathArray = window.location.pathname.split("/");
    return pathArray[2];
  };

  goBack(event) {
    // go back to workout selector
    this.props.history.push(`/`);
  }

  logout() {
    fetch("/logout").then(this.props.history.push(`/`));
  }

  render() {
    const isMobile = this.state.width <= 1024;
    const previousDayActive = this.state.previousDayActive;
    return (
      <div>
        <Grid fluid>
          <Row between="xs">
            <Col xs={2}>
              <button name="back" value="back" onClick={() => this.goBack()}>
                Back
              </button>
            </Col>
            <Col xs={3}>
              <div className="title">alkamist</div>
            </Col>
            <Col xs={2}>
              <button
                name="logout"
                value="logout"
                onClick={() => this.logout()}
              >
                Logout
              </button>
            </Col>
          </Row>
        </Grid>

        {isMobile ? (
          <div className="rep-counter">
            {previousDayActive ? (
              <Grid fluid>
                <Row end="xs">
                  <Col xs={4}>
                    <button
                      name="togglePreviousView"
                      onClick={this.toggleMWebWorkoutView}
                    >
                      Back ➡
                    </button>
                  </Col>
                </Row>
                <PreviousDay
                  getWorkoutFromURL={this.getWorkoutFromURL}
                  setPastWorkouts={this.setPastWorkout}
                />
              </Grid>
            ) : (
              <Grid fluid>
                <button
                  name="togglePreviousView"
                  onClick={this.toggleMWebWorkoutView}
                >
                  ⬅ Previous Day Results
                </button>
                <CurrentDay
                  getWorkoutFromURL={this.getWorkoutFromURL}
                  updateWorkout={this.updateWorkout}
                />
              </Grid>
            )}
          </div>
        ) : (
          <div className="rep-counter">
            <PreviousDay
              getWorkoutFromURL={this.getWorkoutFromURL}
              setPastWorkouts={this.setPastWorkout}
            />
            <CurrentDay
              getWorkoutFromURL={this.getWorkoutFromURL}
              updateWorkout={this.updateWorkout}
            />
          </div>
        )}

        <div className="copyright">
          <span role="img" aria-label="lift">
            🏋️
          </span>{" "}
          by dankostiuk
        </div>
      </div>
    );
  }
}

export default App;
