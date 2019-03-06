import React from 'react';
import image from '../css/images/dumbell.png';
import ReactModalLogin from 'react-modal-login';
import NotificationSystem from 'react-notification-system';
import { Grid, Row, Col } from 'react-flexbox-grid';

class WorkoutPicker extends React.Component {

 	workoutRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      loading: false,
      loggedIn: false,
      showCreateWorkout: false,
      newWorkout: '',
      /**
      workouts: [
        'Chest',
        'Back',
        'Shoulders',
        'Arms',
        'Legs',
        'Cardio'
      ],
       */
      workouts: [],
      workoutSelected: 0
    };
  }

  componentDidMount() {
    this._notificationSystem = null;

    // check to see if we require login
    fetch('/login')
    .then(response => {
      if (!response.ok) {
        this.openModal();
      } else {
        this.onLoginSuccess('session');
        this.showNotification('login');
      }
    })
  }

  onLogin() {
    console.log('email: ' + document.querySelector('#email').value);
    console.log('password: ' + document.querySelector('#password').value);

    const userEmail = document.querySelector('#email').value;
    const userPassword = document.querySelector('#password').value;

    const user = {
      email: userEmail,
      password: userPassword
    }

    if (!userEmail || !userPassword) {
      this.setState({
        error: true
      })
    } else {
      fetch('/login', {
          method: 'POST',
  				headers: {
  					'Accept': 'application/json',
  		 			'Content-Type': 'application/json'
  				 },
          body: JSON.stringify(user)
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        this.onLoginSuccess('form');
        this.showNotification('login');
      })
      .catch(error => { 
        console.error(error);
        this.onLoginFail('form', error);
      });
    }
  }

  onRegister() {
    console.log('email: ' + document.querySelector('#email').value);
    console.log('password: ' + document.querySelector('#password').value);

    const userEmail = document.querySelector('#email').value;
    const userPassword = document.querySelector('#password').value;

    const user = {
      email: userEmail,
      password: userPassword
    }

    if (!userEmail || !userPassword) {
      this.setState({
        error: true
      })
    } else {
      fetch('/register', {
          method: 'POST',
  				headers: {
  					'Accept': 'application/json',
  		 			'Content-Type': 'application/json'
  				 },
          body: JSON.stringify(user)
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        console.log(response);
        this.onLoginSuccess('form');  
        this.showNotification('save', 'Registered successfully');
      })
      .catch(error => { 
        console.error(error)
        this.onLoginFail('form', error);
      });
    }
  }

  onRecoverPassword() {
    console.log('__onFotgottenPassword__');
    console.log('email: ' + document.querySelector('#email').value);

    const email = document.querySelector('#email').value;


    if (!email) {
      this.setState({
        error: true,
        recoverPasswordSuccess: false
      })
    } else {
      this.setState({
        error: null,
        recoverPasswordSuccess: true
      });
    }
  }

  openModal() {
    this.setState({
      showModal: true,
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
      error: null
    });
  }

  onLoginSuccess(method, response) {
    console.log('logged in successfully with ' + method);
    
    // if we logged in, fetch the workout types
    fetch('/workout/type')
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(workoutTypes => {

        this.closeModal();
        this.setState({
          loggedIn: true,
          loading: false,
          workouts: workoutTypes
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  onLoginFail(method, response) {
    console.log('login failed with ' + method);
    this.setState({
      error: response
    })
  }

  startLoading() {
    this.setState({
      loading: true
    })
  }

  finishLoading() {
    this.setState({
      loading: false
    })
  }

  afterTabsChange() {
    this.setState({
      error: null
    });
  }

  //TODO: make this better
  showNotification(type, name) {
		if (this._notificationSystem) {

			if (type === 'save') {
	 			this._notificationSystem.addNotification({
					title: 'Saved!',
					message: name,
					level: 'success'
		     });
       } else if (type === 'error') {
         this._notificationSystem.addNotification({
					 title: 'Error!',
					 message: 'Please fill all fields',
					 level: 'error'
				});
      } else if (type === 'login') {
        this._notificationSystem.addNotification({
          title: 'Logged in!',
          message: 'Have a good workout! 💪',
					level: 'success'
         });
      } else if (type === 'logout') {
        this._notificationSystem.addNotification({
          title: 'Logged out!',
          message: 'Hope to see you soon! 💪',
          level: 'success'
          });
      } else if (type === 'addedWorkout') {
        this._notificationSystem.addNotification({
          title: 'Created workout: ' + name,
          message: 'Please begin workout and add excercises to save this workout.',
					level: 'success'
		     });
      } else if (type === 'emptyWorkout') {
        this._notificationSystem.addNotification({
          title: 'Error!',
          message: 'Workout cannot be empty',
          level: 'error'
       });
      } else if (type === 'deletedWorkout') {
        this._notificationSystem.addNotification({
          title: 'Deleted workout: ' + name,
          message: 'All records for this workout have been deleted.',
          level: 'success'
       });
      } else {
        this._notificationSystem.addNotification({
          title: 'Error!',
          message: 'Feature not completed yet',
          level: 'error'
       });
      }
	  }
  }

  showAddWorkout = (e,showAddworkout) => {
    e.preventDefault();
    this.setState({
      showCreateWorkout: showAddworkout
    })
  }

  // ensures first letter of each word is capped
  updateNewWorkout = (e) => {
    let currentInput;
    if (e.target.value.length === 1) {
      currentInput = e.target.value.toUpperCase();
    }
    
    if (e.target.value.includes(' ')) {
      let words = e.target.value.split(' ');
      for (let i = 0; i < words.length; i++) {
        if (words[i].length === 0) {
          continue;
        }
        let letters = words[i].split('');
        letters[0] = letters[0].toUpperCase();
        words[i] = letters.join('');
      }
      currentInput = words.join(' ');
    }

    this.setState({
      newWorkout: currentInput || e.target.value
    });
  }

  addNewWorkout = (e) => {
    e.preventDefault();

    // check to see if we require login
    if (!this.state.loggedIn) {
      fetch('/login')
      .then(response => {
        if (!response.ok) {
          this.openModal();
        } else {
          this.onLoginSuccess('session');
        }
      })
    } else {
      if (!this.state.newWorkout) {
        this.showNotification('emptyWorkout');
        return;
      }

      let currentNewWorkout = this.state.newWorkout.trim();
      this.setState({
        workouts: [...this.state.workouts, currentNewWorkout],
        newWorkout: '',
        showCreateWorkout: false
      });
      this.showNotification('addedWorkout', currentNewWorkout);
    }
  }

  deleteWorkout = (e) => {
    e.preventDefault();
    
    let deletedWorkout = this.state.workouts[this.state.workoutSelected];
    //TODO: do delete here (should delete all exercises for workout selected)
    fetch('/workout/type/' + deletedWorkout.toLowerCase(), {
      method: 'DELETE'
      })
      .then(response => {
        let workouts = this.state.workouts;
        workouts.splice(this.state.workoutSelected, 1);
        this.setState({
          workoutSelected: 0,
          workouts: workouts
        })
        this.showNotification('deletedWorkout', deletedWorkout);
      });
  }

  handleWorkoutChanged(e) {
    this.setState({
      workoutSelected: e.target.selectedIndex
    });
	}

	goToWorkout = (event) => {
    event.preventDefault();
    
    // check to see if we require login
    if (!this.state.loggedIn) {
      fetch('/login')
      .then(response => {
        if (!response.ok) {
          this.openModal();
        } else {
          this.onLoginSuccess('session');
        }
      })
    } else {
       // get text from select
       const urlWorkout = this.workoutRef.current.value.replace(/\s+/g, '-').toLowerCase();
       // change page to /workout/workoutName
       this.props.history.push(`/workout/${urlWorkout}`);
    }
  }
  
  logout() {
		fetch('/logout')
		.then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      this.setState({
        loggedIn: false,
      });
      this.showNotification('logout');
      this.componentDidMount();
    })
    .catch(error => {
      console.log(error);
    })
	}

	render() {
		return (
      <div>
       <NotificationSystem ref={n => this._notificationSystem = n} />

       <ReactModalLogin
         visible={this.state.showModal}
         onCloseModal={this.closeModal.bind(this)}
         loading={this.state.loading}
         error={this.state.error}
         tabs={{
           afterChange: this.afterTabsChange.bind(this)
         }}
         loginError={{
           label: "Couldn't sign in, please try again."
         }}
         registerError={{
           label: "Couldn't sign up, please try again."
         }}
         startLoading={this.startLoading.bind(this)}
         finishLoading={this.finishLoading.bind(this)}
         form={{
            onLogin: this.onLogin.bind(this),
            onRegister: this.onRegister.bind(this),
            onRecoverPassword: this.onRecoverPassword.bind(this),

            recoverPasswordSuccessLabel: this.state.recoverPasswordSuccess
              ? {
                  label: "New password has been sent to your mailbox!"
                }
              : null,
            recoverPasswordAnchor: {
              label: "Forgot your password?"
            },
            loginBtn: {
              label: "Sign in"
            },
            registerBtn: {
              label: "Sign up"
            },
            recoverPasswordBtn: {
              label: "Send new password"
            },
            loginInputs: [
              {
                containerClass: 'RML-form-group',
                label: 'Email',
                type: 'email',
                inputClass: 'RML-form-control',
                id: 'email',
                name: 'email',
                placeholder: 'Email',
              },
              {
                containerClass: 'RML-form-group',
                label: 'Password',
                type: 'password',
                inputClass: 'RML-form-control',
                id: 'password',
                name: 'password',
                placeholder: 'Password',
              }
            ],
            registerInputs: [
              {
                containerClass: 'RML-form-group',
                label: 'Email',
                type: 'email',
                inputClass: 'RML-form-control',
                id: 'email',
                name: 'email',
                placeholder: 'Email',
              },
              {
                containerClass: 'RML-form-group',
                label: 'Password',
                type: 'password',
                inputClass: 'RML-form-control',
                id: 'password',
                name: 'password',
                placeholder: 'Password',
              }
            ],
            recoverPasswordInputs: [
              {
                containerClass: 'RML-form-group',
                label: 'Email',
                type: 'email',
                inputClass: 'RML-form-control',
                id: 'email',
                name: 'email',
                placeholder: 'Email',
              },
            ],
          }}
       />
       { this.state.loggedIn ? 
       <button name="logout" value="logout" onClick={() => this.logout()}>
				Logout
      </button> : <div></div>}
      <form className="workout-selector">
        <img src={image} alt="RepCounter"/>
        <h2>Repcountr</h2>

        {this.state.showCreateWorkout || 
          !this.state.workouts || 
            this.state.workouts.length === 0
        ? 
          <div className="create-new-workout">
            <Grid fluid style={{paddingLeft:0}}>
              <Row>
                <Col xs={5}>
                {this.state.workouts && this.state.workouts.length > 0 ?
                  <button name="toggleWorkoutView" onClick={(e) => this.showAddWorkout(e,false)}>
                  ←Back
                  </button>
                  :
                  <div></div>
                }
                </Col>
              </Row>
            </Grid>
            <h5>Add Workout:</h5>
            <input 
              value={this.state.newWorkout} 
              placeholder="E.g. Chest"
              onChange={(e) => this.updateNewWorkout(e)}/>
            <button type="submit" onClick={(e) => this.addNewWorkout(e)}>
              Let's Go!
            </button>
				  </div>
        :
          <div>
            <Grid fluid style={{padding:0}}>
              <Row>
                <Col xs={5}>
                <button name="toggleWorkoutView" onClick={(e) => this.showAddWorkout(e,true)}>
                  +Add Workout
                </button>
                </Col>
                <Col xs={2}/>
                <Col xs={5}>
                <button name="deleteWorkout" onClick={(e) => this.deleteWorkout(e,true)}>
                  Delete Workout
                </button>
                </Col>
              </Row>
            </Grid>
            <h5>Select Workout:</h5>
            <select 
              name="workout" 
              ref={this.workoutRef} 
              value={this.state.workouts[this.state.workoutSelected]}
              onChange={e => this.handleWorkoutChanged(e)}
              >
              {this.state.workouts.map((workout, i) => {
                return <option key={i} value={workout}>{workout}</option>
              })}
            </select>
            <button type="submit" onClick={(e) => this.goToWorkout(e)}>Begin Workout</button>
          </div>
        }

        
      </form>
      </div>
	   )
	}
}

export default WorkoutPicker;
