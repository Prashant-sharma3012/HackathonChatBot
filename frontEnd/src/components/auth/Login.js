import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import FormControl from "@material-ui/core/FormControl";
// import FormHelperText from "@material-ui/core/FormHelperText";
// import Input from "@material-ui/core/Input";
// import InputLabel from "@material-ui/core/InputLabel";
import { loginUser, loginWithMSlogin } from "../../actions/authActions";
// import classnames from "classnames";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
// import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import Link from '@material-ui/core/Link';
// import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
// import { makeStyles } from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import SvgIcon from '@material-ui/core/SvgIcon';
import MicrosoftLogo from '../../assests/images/microsoft.svg'
import BotGif from '../../assests/images/bot.gif'
import ConversationGif from '../../assests/images/conversationalUi.gif'
import Logo from '../../assests/images/logo.png'

import "./styles.css";
import queryString from 'query-string'
import { Icon } from "@material-ui/core";


const MsLogo = () => (
    <Icon>
        <img src={MicrosoftLogo} height={25} width={25}/>
    </Icon>
)

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/overview");
    }

    const query = queryString.parse(this.props.location.search);
    // console.log("===========query========", query)
    if (query.token) {
      this.props.loginWithMSlogin(query.token)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/overview"); // push user to dashboard when they login
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    // console.log("----------e.target--------", e.target);
    this.setState({ 
      [e.target.id]: e.target.value,
      errors: {}
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    console.log(userData);
    this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };

  render() {
    const { errors } = this.state;
    // console.log("-----------errors-------", errors);
    return (
        <div className="inputFieldView">
          <div className="leftStyle">
          <div>
            <img src={BotGif} width={500} height={500} />
          </div>
          
          <div>
          <img src={ConversationGif}  width={400} height={400}  />

          </div>
          </div>
          
          <div className="loginStyle">
          {/* <Avatar className="iconStyle">
            <LockOutlinedIcon />
          </Avatar> */}
          {/* <Typography component="h1" variant="h5">
            Sign in
          </Typography> */}
          {/* <form noValidate onSubmit={this.onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onChange={this.onChange}
              value={this.state.email}
              autoComplete="email"
              autoFocus
            />
            <span style={{
              color: 'red',
              marginTop: 10,
              marginBottom: 10
            }}>
              {errors.email}
              {errors.emailNotFound}
            </span>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              onChange={this.onChange}
              value={this.state.password}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <span style={{
              color: 'red',
              marginTop: 10,
              marginBottom: 10
            }}>
              {errors.password}
              {errors.passwordincorrect}
            </span>
            <Button type="submit" fullWidth variant="contained" color="primary" style={{marginTop: 20}}>
              Sign In
            </Button>
            
          </form> */}
          <h1 style={{
            fontSize: 50,
            color: '#187e91'
          }}>
            Bot-Quero
          </h1>
          <div style={{
            display: 'flex',
          }}>
          <span>
            Powered by &nbsp;
          </span>
          <img src={Logo}  width={70} height={20}  />
          </div>
        

          <Button
            href={'http://localhost:8000/api/auth/mslogin'}
            style={{
              margin: 20,
              marginTop: 60
            }}
          >
            <MsLogo /> &nbsp; &nbsp;
            <span style={{
              textTransform: 'capitalize'
            }}>
              Login with Microsoft Account
            </span>
          </Button>
          </div>
        
        </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

const mapDispatchToProps = dispatch => ({
  loginUser: user => {
    dispatch(loginUser(user));
  },
  loginWithMSlogin: token => {
    dispatch(loginWithMSlogin(token));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
