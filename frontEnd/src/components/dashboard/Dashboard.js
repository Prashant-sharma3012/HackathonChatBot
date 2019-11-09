import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import ShortLogo from '../../assests/images/shortLogo.png'
import 'react-chat-widget/lib/styles.css';
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import axios from 'axios'
import './styles.css'


class Dashboard extends Component {
  componentDidMount() {
    addResponseMessage("Welcome to this awesome chat!");
  }

  handleNewUserMessage = (newMessage) => {
    console.log(`New message incomig! ${newMessage}`);
    // Now send the message throught the backend API
    axios.post('http://localhost:8000/ansMsg', {msg: newMessage}).then(res=>{
      console.log("------------", res.data)
      addResponseMessage(res.data.message)
    })
  }
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    return (
      // <div style={{ height: "75vh" }} className="container valign-wrapper">
      <div>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Fab
              variant="extended"
              aria-label="Apply"
              title='Logout'
              size="medium"
              color="secondary"
              onClick={this.onLogoutClick}
              style={{
                margin: 30
              }}
            >
              <ExitToAppRoundedIcon />
            </Fab>
          </Grid>
        <Widget
              handleNewUserMessage={this.handleNewUserMessage}
              profileAvatar={ShortLogo}
              title="This is Bot baba reporting"
              subtitle="At your service"
            />
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => {
    dispatch(logoutUser());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
