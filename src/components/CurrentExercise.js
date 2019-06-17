import React from "react";
import { Grid, Row, Col } from "react-flexbox-grid";

class CurrentExercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sets: [],
      isKg: true,
      volume: 0
    };
  }

  componentDidMount() {
    let { reps, weights, isKg, v_score } = this.props.currentExercise;

    let repsArr = reps.split("-");
    let weightsArr = weights.split("-");
    let setsArr = [];
    for (let i = 0; i < repsArr.length; i++) {
      let setsObj = {
        reps: repsArr[i],
        weights: weightsArr[i]
      };
      setsArr.push(setsObj);
    }

    this.setState({
      sets: setsArr,
      isKg: isKg,
      volume: v_score
    });
  }

  nameRef = React.createRef();
  numberOfSetsRef = React.createRef();
  notesRef = React.createRef();

  updateExercise = event => {
    let repsString = "";
    let weightsString = "";
    let dirtySets = this.state.sets.filter(e => e.reps && e.weights);
    dirtySets.forEach((set, i) => {
      if (i !== dirtySets.length - 1) {
        // TODO: figure out why when saving form with empty cells keeps dashes at the end
        repsString += set.reps + "-";
        weightsString += set.weights + "-";
      } else {
        repsString += set.reps;
        weightsString += set.weights;
      }
    });
    const currentExercise = {
      name: this.nameRef.current.value,
      reps: repsString,
      weights: weightsString,
      notes: this.notesRef.current.value,
      workout_id: this.props.currentExercise.workout_id
    };

    if (
      currentExercise.name === "" ||
      currentExercise.reps === "" ||
      currentExercise.weights === ""
    ) {
      this.props.notify(event, "error_missing", "blank");
      return;
    }

    console.log(repsString);
    console.log(weightsString);
    if (repsString.split("-").length !== weightsString.split("-").length) {
      this.props.notify(event, "error_must_match", "blank");
      return;
    }

    return fetch("/exercise?type=" + this.props.getWorkoutFromURL(), {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(currentExercise)
    }).then(response => this.props.notify(event, "save", currentExercise.name));
  };

  handleSetReps = (e, i) => {
    let setsArr = this.state.sets;
    setsArr[i].reps = e.target.value;
    this.setState({
      sets: setsArr,
      volume: this.getVolume()
    });
  };

  handleSetWeights = (e, i) => {
    let setsArr = this.state.sets;
    setsArr[i].weights = e.target.value;
    this.setState({
      sets: setsArr,
      volume: this.getVolume()
    });
  };

  getVolume = () => {
    let vScore = 0;
    this.state.sets.forEach(set => {
      let reps = !set.reps ? 0 : parseInt(set.reps);
      let weights = !set.weights ? 0 : parseInt(set.weights);
      vScore += reps * weights;
    });
    return vScore;
  };

  handleSetSets = () => {
    let currentSets = this.state.sets;

    if (currentSets.length > this.numberOfSetsRef.current.value) {
      currentSets.splice(
        this.numberOfSetsRef.current.value - 1,
        currentSets.length - this.numberOfSetsRef.current.value
      );
      this.setState({
        sets: currentSets
      });
    } else {
      const originalLength = currentSets.length;
      for (
        let i = 0;
        i < this.numberOfSetsRef.current.value - originalLength;
        i++
      ) {
        currentSets.push({});
      }
      this.setState({
        sets: currentSets
      });
    }
  };

  handleUnitsChanged = () => {
    const lbsPerKg = 2.20462;
    let newSets = this.state.sets.map((e, i) => {
      let newWeight =
        this.state.sets[i].weights !== undefined
          ? this.state.isKg
            ? Math.round(this.state.sets[i].weights * lbsPerKg * 100) / 100
            : Math.round((this.state.sets[i].weights / lbsPerKg) * 100) / 100
          : undefined;

      return {
        reps: this.state.sets[i].reps,
        weights: newWeight
      };
    });

    this.setState({
      isKg: !this.state.isKg,
      sets: newSets,
      volume: this.state.isKg
        ? Math.round(this.state.volume * lbsPerKg * 100) / 100
        : Math.round((this.state.volume / lbsPerKg) * 100) / 100
    });
  };

  render() {
    return (
      <div>
        <Grid fluid style={{ padding: 0 }}>
          <Row between="xs">
            <Col xs={2}>
              <div name="volume">
                Vol: {!isNaN(this.state.volume) ? this.state.volume : ""}
              </div>
            </Col>
            <Col xs={10}>
              <div name="units">
                <form className="switch-field">
                  <input
                    type="radio"
                    id={this.props.currentExercise._id + "switch_left"}
                    name="switchToggle"
                    value="kg"
                    onChange={this.handleUnitsChanged}
                    checked={this.state.isKg}
                  />
                  <label
                    htmlFor={this.props.currentExercise._id + "switch_left"}
                  >
                    kg
                  </label>
                  <input
                    type="radio"
                    id={this.props.currentExercise._id + "switch_right"}
                    name="switchToggle"
                    value="lbs"
                    onChange={this.handleUnitsChanged}
                    checked={!this.state.isKg}
                  />
                  <label
                    htmlFor={this.props.currentExercise._id + "switch_right"}
                  >
                    lbs
                  </label>
                </form>
              </div>
            </Col>
          </Row>
        </Grid>

        <div className="current-workout-edit">
          <input
            name="exercise"
            ref={this.nameRef}
            type="text"
            placeholder="Exercise"
            defaultValue={this.props.currentExercise.name}
          />
          <label name="sets">Sets:</label>
          <select
            name="numberOfSets"
            value={this.state.sets.length}
            ref={this.numberOfSetsRef}
            onChange={() => this.handleSetSets()}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
          </select>
          <button
            name="close"
            onClick={() =>
              this.props.deleteExercise(this.props.currentExercise)
            }
          >
            <span role="img" aria-label="trash">
              🗑️
            </span>
          </button>
          <div className="sets-dynamic" style={{ width: "100%" }}>
            <Grid fluid style={{ padding: 0 }}>
              <Row center="xs" style={{ borderRight: 1 }}>
                {this.state.sets.map((e, i) => {
                  return (
                    <Col key={i} xs style={{ padding: 0 }}>
                      <input
                        name={`reps-${i}`}
                        placeholder={`R${i + 1}`}
                        value={this.state.sets[i].reps}
                        onChange={e => this.handleSetReps(e, i)}
                        style={{
                          paddingLeft: 18 - this.state.sets.length,
                          width: "100%"
                        }}
                      />
                    </Col>
                  );
                })}
              </Row>
            </Grid>
          </div>
          <div className="weights-dynamic" style={{ width: "100%" }}>
            <Grid fluid style={{ padding: 0 }}>
              <Row center="xs" style={{ borderRight: 1 }}>
                {this.state.sets.map((e, i) => {
                  return (
                    <Col key={i} xs style={{ padding: 0 }}>
                      <input
                        name={`weights-${i}`}
                        placeholder={`W${i + 1}`}
                        value={this.state.sets[i].weights}
                        onChange={e => this.handleSetWeights(e, i)}
                        style={{
                          paddingLeft: 18 - this.state.sets.length,
                          width: "100%"
                        }}
                      />
                    </Col>
                  );
                })}
              </Row>
            </Grid>
          </div>
          <textarea name="desc" ref={this.notesRef} placeholder="Notes" />
          <button
            type="submit"
            name="submit"
            onClick={e => this.updateExercise(e)}
          >
            Save
          </button>
        </div>
      </div>
    );
  }
}

export default CurrentExercise;
