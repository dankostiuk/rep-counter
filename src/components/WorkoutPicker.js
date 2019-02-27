import React from 'react';
import image from '../css/images/dumbell.png';
import ReactModalLogin from 'react-modal-login';
import NotificationSystem from 'react-notification-system';

class WorkoutPicker extends React.Component {

 	workoutRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      loading: false,
      loggedIn: false
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
    this.closeModal();
    this.setState({
      loggedIn: true,
      loading: false
    })
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
					level: 'success'
		     });
      }
	 }
 }

	goToWorkout = (event) => {
		// stop form from saving
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
       const workoutName = this.workoutRef.current.value;

       // change page to /workout/workoutName
       this.props.history.push(`/workout/${workoutName}`);
    }
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


      <form className="workout-selector" onSubmit={this.goToWorkout}>
        <img src={image} alt="RepCounter"/>
        <h2>Repcountr</h2>
        <h5>Select Workout:</h5>
  			<select name="workout" ref={this.workoutRef}>
  			  <option value="chest">Chest</option>
  			  <option value="back">Back</option>
  			  <option value="shoulders">Shoulders</option>
  			  <option value="arms">Arms</option>
  			  <option value="legs">Legs</option>
  			  <option value="cardio">Cardio</option>
  			</select>
  			<button type="submit">Begin Workout</button>
      </form>


      </div>
	   )
	}
}

export default WorkoutPicker;
